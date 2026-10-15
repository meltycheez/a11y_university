import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { a11yStore } from "~/a11y/state";
import * as board from "./leaderboard";
import { ctfStore, endRun, liveScore, makeFlag, noteHighlight, retryWithFixes, revealFlag, revealPage, startRun, takeHint, timeBonus } from "./store";

beforeEach(() => localStorage.clear());
afterEach(() => { endRun(); a11yStore.resetAll(); vi.restoreAllMocks(); });

const run = () => ctfStore.get().run!;

describe("CTF run", () => {
  it("starting resets every fix and needs a handle", () => {
    a11yStore.fixAll();
    expect(startRun("apply-sr", "   ")).toBe("handle");
    expect(a11yStore.get().fixErrors).toBe(true);
    expect(startRun("apply-sr", "ada")).toBeNull();
    expect(a11yStore.get()).toEqual({ fixErrors: false, fixAlerts: false, fixManual: false });
    expect(liveScore(run())).toBe(500);
  });

  it("charges each fix category and highlight once, and hints at rising cost", () => {
    startRun("apply-sr", "ada");
    a11yStore.set({ fixErrors: true });
    a11yStore.set({ fixErrors: false });
    a11yStore.set({ fixErrors: true });
    expect(liveScore(run())).toBe(350);
    a11yStore.fixAll(); // errors already charged: alerts and manual only
    expect(liveScore(run())).toBe(50);
    expect(noteHighlight("error")).toBe(true);
    expect(noteHighlight("error")).toBe(false);
    expect(liveScore(run())).toBe(25);
    expect(takeHint()).toMatch(/./);
    expect(liveScore(run())).toBe(0); // 25 − 50, floored at 0
  });

  it("hint costs are 50, 75, 100 and run out", () => {
    startRun("apply-sr", "ada");
    takeHint(); takeHint(); takeHint();
    expect(liveScore(run())).toBe(500 - 225);
    expect(takeHint()).toBeNull();
  });

  it("completes with a deterministic flag, a time bonus, and a saved best", () => {
    startRun("apply-sr", "ada");
    const t0 = run().startedAt;
    expect(revealFlag("map-eyes", ["x"])).toBeNull(); // a different challenge is not running
    expect(ctfStore.get().run).not.toBeNull();
    const flag = revealFlag("apply-sr", ["Ada", "Lovelace", "RSU7Q4K"], t0 + 10 * 60_000)!;
    expect(flag).toBe(makeFlag("apply-sr", ["ada", "lovelace", "rsu7q4k"]));
    expect(flag).toMatch(/^RSU\{apply-sr-[0-9a-f]{8}\}$/);
    expect(ctfStore.get().run).toBeNull(); // the task finishing completes the run: no flag to type
    expect(ctfStore.get().result!.flag).toBe(flag);
    expect(ctfStore.get().result!.score).toBe(550);
    expect(board.rankChallenge(board.load(), "apply-sr")).toEqual([expect.objectContaining({ handle: "ada", score: 550 })]);
    expect(timeBonus(0)).toBe(100);
    expect(timeBonus(30 * 60_000)).toBe(0);
    expect(timeBonus(2.5 * 60_000, 5)).toBe(50); // booth challenges: 0 at 5 minutes
    expect(timeBonus(5 * 60_000, 5)).toBe(0);
  });

  it("retrying with fixes clears the result, turns every fix on and is free", () => {
    startRun("apply-sr", "ada");
    revealFlag("apply-sr", ["a"]);
    retryWithFixes("apply-sr");
    expect(ctfStore.get().result).toBeNull();
    expect(ctfStore.get().compare).toBe("apply-sr");
    expect(a11yStore.get()).toMatchObject({ fixErrors: true, fixAlerts: true, fixManual: true });
    startRun("apply-sr", "ada");
    expect(ctfStore.get().compare).toBeNull();
    expect(a11yStore.get()).toMatchObject({ fixErrors: false, fixAlerts: false, fixManual: false }); // a real run turns them off again
  });

  it("a comparison run keeps every fix on, uses no attempt and saves nothing", () => {
    startRun("apply-sr", "ada");
    revealFlag("apply-sr", ["a"]);
    retryWithFixes("apply-sr");
    expect(startRun("apply-sr", "ada", { compare: true })).toBeNull();
    expect(a11yStore.get()).toMatchObject({ fixErrors: true, fixAlerts: true, fixManual: true });
    expect(run().compare).toBe(true);
    expect(noteHighlight("error")).toBe(false);
    expect(board.attemptsUsed("ada", "apply-sr")).toBe(1);
    revealFlag("apply-sr", ["b"]);
    expect(ctfStore.get().result).toMatchObject({ compare: true, score: 0 });
    expect(board.load()[0].best!.flag).toBe(makeFlag("apply-sr", ["a"])); // the scored run, not the comparison
  });

  it("showing a faded page costs REVEAL_PENALTY once", () => {
    startRun("apply-sr", "ada");
    revealPage();
    revealPage();
    expect(liveScore(run())).toBe(450);
  });
});

describe("leaderboard", () => {
  it("allows the first try plus 3 retries; an abandoned run still counts", () => {
    for (let i = 0; i < 4; i++) { expect(startRun("apply-sr", "Ada")).toBeNull(); endRun(); }
    expect(startRun("apply-sr", "ada ")).toBe("attempts"); // handles match case- and space-insensitively
    expect(startRun("map-eyes", "ada")).toBeNull(); // attempts are per challenge
  });

  it("keeps the best score per handle and sums the overall board", () => {
    const best = (score: number) => ({ score, flag: "f", finishedAt: "t", noMouse: false });
    board.recordFinish("ada", "reqinfo-sr", best(300));
    board.recordFinish("Ada", "reqinfo-sr", best(200));
    board.recordFinish("ada", "map-eyes", best(400));
    board.recordFinish("bob", "reqinfo-sr", best(500));
    board.recordFinish("bob", "apply-sr", best(900)); // the harder version: its own board, not in the total
    const entries = board.load();
    expect(board.rankChallenge(entries, "reqinfo-sr").map((r) => [r.handle, r.score])).toEqual([["bob", 500], ["ada", 300]]);
    expect(board.rankChallenge(entries, "apply-sr").map((r) => [r.handle, r.score])).toEqual([["bob", 900]]);
    expect(board.rankOverall(entries).map((r) => [r.handle, r.score])).toEqual([["ada", 700], ["bob", 500]]);
    expect(board.toCsv(entries).split("\n")).toHaveLength(5);
  });

  it("is empty, never a crash, when localStorage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(board.load()).toEqual([]);
    expect(startRun("apply-sr", "ada")).toBeNull();
  });
});

describe("leaderboard", () => {
  it("keeps the best run per name per challenge, ignoring case", () => {
    const row = (handle: string, challengeId: "reqinfo-sr" | "map-eyes", score: number) => ({ handle, challengeId, attempts: 0, best: { score, flag: "", finishedAt: "", noMouse: false } });
    const best = board.bestOf([row("Ada", "reqinfo-sr", 300), row("ada ", "reqinfo-sr", 450), row("Ada", "map-eyes", 200), row("Bo", "reqinfo-sr", 100)]);
    expect(board.rankChallenge(best, "reqinfo-sr").map((r) => [r.handle, r.score])).toEqual([["Ada", 450], ["Bo", 100]]);
    expect(board.rankOverall(best).map((r) => [r.handle, r.score])).toEqual([["Ada", 650], ["Bo", 100]]);
  });
});

describe("leaderboard loading (plan 13)", () => {
  it("reuses a recently loaded board, and a new finish shows up at once", async () => {
    const first = await board.loadBoard({ fresh: true });
    expect(first.entries).toEqual([]);
    board.recordFinish("ada", "reqinfo-sr", { score: 420, flag: "f", finishedAt: new Date().toISOString(), noMouse: false });
    expect(board.peekBoard().entries).toEqual([expect.objectContaining({ handle: "ada" })]); // the finish clears the cache
    const again = await board.loadBoard();
    expect(board.rankChallenge(again.entries, "reqinfo-sr").map((r) => r.score)).toEqual([420]);
    expect(await board.loadBoard()).toBe(again); // within 30 s: the same board, no new fetch
  });
});

describe("leaderboard loading race (plan 13 review)", () => {
  it("a run that finishes while the board is loading is still in the loaded board", async () => {
    await board.loadBoard({ fresh: true });
    const pending = board.loadBoard({ fresh: true }); // reads storage before the finish below
    board.recordFinish("bo", "map-eyes", { score: 333, flag: "f", finishedAt: new Date().toISOString(), noMouse: false });
    const loaded = await pending;
    expect(board.rankChallenge(loaded.entries, "map-eyes").map((r) => r.handle)).toContain("bo");
    expect(board.rankChallenge((await board.loadBoard()).entries, "map-eyes").map((r) => r.handle)).toContain("bo"); // and in the cache
  });
});
