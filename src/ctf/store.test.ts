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
    board.recordFinish("ada", "apply-sr", best(300));
    board.recordFinish("Ada", "apply-sr", best(200));
    board.recordFinish("ada", "map-eyes", best(400));
    board.recordFinish("bob", "apply-sr", best(500));
    const entries = board.load();
    expect(board.rankChallenge(entries, "apply-sr").map((r) => [r.handle, r.score])).toEqual([["bob", 500], ["ada", 300]]);
    expect(board.rankOverall(entries).map((r) => [r.handle, r.score])).toEqual([["ada", 700], ["bob", 500]]);
    expect(board.toCsv(entries).split("\n")).toHaveLength(4);
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
    const row = (handle: string, challengeId: "apply-sr" | "map-eyes", score: number) => ({ handle, challengeId, attempts: 0, best: { score, flag: "", finishedAt: "", noMouse: false } });
    const best = board.bestOf([row("Ada", "apply-sr", 300), row("ada ", "apply-sr", 450), row("Ada", "map-eyes", 200), row("Bo", "apply-sr", 100)]);
    expect(board.rankChallenge(best, "apply-sr").map((r) => [r.handle, r.score])).toEqual([["Ada", 450], ["Bo", 100]]);
    expect(board.rankOverall(best).map((r) => [r.handle, r.score])).toEqual([["Ada", 650], ["Bo", 100]]);
  });
});
