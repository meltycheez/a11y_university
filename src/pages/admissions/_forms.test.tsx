// Plan 06 form pages: /giving/donate, /admissions/apply, /financial-aid/legacy-application.
// Every registered scenario renders its marker on load, toggles change the DOM, and each form works end to end.
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import { applyScenarios } from "~/a11y/registry/apply";
import { donateScenarios } from "~/a11y/registry/donate";
import { legacyAidScenarios } from "~/a11y/registry/legacy-aid";
import type { ScenarioDef } from "~/a11y/registry";
import { a11yStore } from "~/a11y/state";
import { ctfStore, endRun, revealPage, startRun } from "~/ctf/store";
import DonatePage from "../giving/donate";
import LegacyAidPage from "../financial-aid/legacy-application";
import ApplyPage, { INVALID_PAUSE_MS, validateStep } from "./apply";

Object.assign(HTMLDialogElement.prototype, {
  showModal(this: HTMLDialogElement) { this.open = true; },
  show(this: HTMLDialogElement) { this.open = true; },
  close(this: HTMLDialogElement) { this.open = false; },
});
afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); vi.useRealTimers(); });

const pages: [string, React.ComponentType, ScenarioDef[], number][] = [
  ["/giving/donate", DonatePage, donateScenarios, 30],
  ["/admissions/apply", ApplyPage, applyScenarios, 8],
  ["/financial-aid/legacy-application", LegacyAidPage, legacyAidScenarios, 30],
];
const renderAt = (path: string, Page: React.ComponentType, entry = path) =>
  render(<RouterProvider router={createMemoryRouter([{ path, element: <Page /> }], { initialEntries: [entry] })} />).container;
// DOM snapshot that ignores attribute order (React may re-add an attribute in a different position).
const snapshot = (el: HTMLElement) =>
  [...el.querySelectorAll("*")].map((n) => n.tagName + [...n.attributes].map((a) => `${a.name}=${a.value}`).sort().join(",")).join("|") + el.textContent;
const markers = (el: HTMLElement) => new Set([...el.innerHTML.matchAll(/data-a11y-scenario="([^"]+)"/g)].flatMap((m) => m[1].split(" ")));

it.each(pages)("%s renders every registered marker on load and stays within budget", (path, Page, defs, min) => {
  const found = markers(renderAt(path, Page));
  expect(defs.length).toBeGreaterThanOrEqual(min);
  expect(defs.filter((s) => s.mechanism !== "document" && !found.has(s.id)).map((s) => s.id)).toEqual([]);
  expect([...found].filter((id) => !defs.some((s) => s.id === id))).toEqual([]);
  expect(defs.every((s) => s.pages.includes(path))).toBe(true);
});

// Some instances only appear after interaction (later steps, errors), so each toggle must restore the DOM and
// Fix All must change it; the flow tests below check specific fixes.
it.each(pages)("%s changes the DOM when fixed and restores it", (path, Page) => {
  const el = renderAt(path, Page);
  const before = snapshot(el);
  for (const toggle of ["fixErrors", "fixAlerts", "fixManual"] as const) {
    act(() => a11yStore.set({ [toggle]: true }));
    act(() => a11yStore.resetAll());
    expect(snapshot(el), toggle).toBe(before);
  }
  act(() => a11yStore.fixAll());
  expect(snapshot(el)).not.toBe(before);
});

const type = (id: string, value: string) => fireEvent.change(document.getElementById(id)!, { target: { value } });

it("donate: honors ?fund=, shows errors, reviews and confirms", async () => {
  renderAt("/giving/donate", DonatePage, "/giving/donate?fund=sequoia-library");
  expect((document.getElementById("fund") as HTMLSelectElement).value).toBe("sequoia-library");
  expect(document.querySelector('[aria-current="yes"]')).not.toBeNull();
  expect(document.querySelector("img:not([alt])")).not.toBeNull();

  fireEvent.click(screen.getByText("Review my gift"));
  expect(screen.getAllByText("Invalid entry").length).toBeGreaterThan(3);
  expect(document.querySelector(".donate-errors")!.getAttribute("role")).toBeNull();
  act(() => a11yStore.fixAll());
  fireEvent.click(screen.getByText("Review my gift"));
  expect(document.querySelector(".donate-errors")!.getAttribute("role")).toBe("alert");
  expect(screen.getAllByText(/Card number: enter 13 to 19 digits/).length).toBe(2);
  expect(document.getElementById("cc-number")!.getAttribute("aria-invalid")).toBe("true");
  expect(document.querySelector('label[for="cc-number"]')).not.toBeNull();

  for (const [id, v] of [["first", "Ada"], ["last", "Quill"], ["email", "ada@example.com"], ["street", "1 Grove Way"], ["city", "Arcadia Falls"], ["zip", "95579"],
    ["cc-number", "4000 0000 0000 0002"], ["exp-month", "12"], ["exp-year", "2028"], ["cvv", "123"]]) type(id, v);
  fireEvent.click(screen.getByText("Review my gift"));
  expect(screen.getByText("Review your gift")).toBeTruthy();
  expect(document.activeElement?.textContent).toBe("Review your gift");
  fireEvent.click(screen.getByText("Complete my gift"));
  await waitFor(() => expect(screen.getByText(/Thank you, Ada/)).toBeTruthy(), { timeout: 2000 });
  expect(document.querySelector(".donate-code")!.textContent).toMatch(/^RSU-[0-9A-Z]{6}$/);
});

it("donate: the session expires silently at 4:00, and warns at 3:00 once fixed", () => {
  vi.useFakeTimers();
  renderAt("/giving/donate", DonatePage);
  type("first", "Ada");
  act(() => { vi.advanceTimersByTime(3 * 60_000 + 1000); });
  expect(screen.queryByText("Are you still there?")).toBeNull();
  act(() => { vi.advanceTimersByTime(60_000); });
  expect(screen.getByText(/Your session has expired/)).toBeTruthy();
  expect((document.getElementById("first") as HTMLInputElement).value).toBe("");
  cleanup();

  act(() => a11yStore.fixAll());
  renderAt("/giving/donate", DonatePage);
  act(() => { vi.advanceTimersByTime(3 * 60_000 + 1000); });
  expect(document.querySelector("dialog[open]")!.textContent).toContain("Are you still there?");
  fireEvent.click(screen.getByText("Continue my gift"));
  act(() => { vi.advanceTimersByTime(2 * 60_000); });
  expect(document.querySelector("dialog[open]")).toBeNull();
});

it("apply: validates a step, moves on, and keeps data in the store", () => {
  renderAt("/admissions/apply", ApplyPage);
  expect(screen.getByText(/Step 1 of 3/)).toBeTruthy();
  // apply-next-name-001: the defective Next button has no name, only an arrow icon.
  const next = () => fireEvent.click(document.querySelector('.apply-nav button[type="submit"]')!);
  next();
  expect(screen.getAllByText("Invalid").length).toBeGreaterThan(3);
  for (const [id, v] of [["first", "Ada"], ["last", "Quill"], ["dob-m", "4"], ["dob-d", "12"], ["dob-y", "2008"], ["email", "ada@example.com"],
    ["street", "1 Grove Way"], ["city", "Arcadia Falls"], ["zip", "95579"]]) type(id, v);
  fireEvent.click(document.getElementById("citizenship")!);
  next();
  expect(screen.getByText(/Step 2 of 3/)).toBeTruthy();
  expect(document.querySelector('[aria-current="step"]')).toBeNull();
  act(() => a11yStore.fixAll());
  expect(document.querySelector('[aria-current="step"]')!.textContent).toContain("Academics and program");
  fireEvent.click(screen.getByText("Back"));
  expect((document.getElementById("first") as HTMLInputElement).value).toBe("Ada");
  expect(document.activeElement?.textContent).toContain("Step 1 of 3");
});

it("apply: date errors point at the wrong part; month and day take 1 or 01", () => {
  const base = { first: "a", last: "b", email: "a@b.co", street: "s", city: "c", zip: "95521", citizenship: "x", "dob-m": "01", "dob-d": "5", "dob-y": "2008" };
  const dob = (patch: Record<string, string>) => validateStep(0, { ...base, ...patch }).find((e) => e.field.startsWith("dob-"));
  expect(dob({})).toBeUndefined();
  expect(dob({ "dob-m": "1", "dob-d": "05" })).toBeUndefined();
  expect(dob({ "dob-y": "2016" })).toMatchObject({ field: "dob-y", parts: ["dob-y"], message: "Enter a year for your date of birth from 1940 to 2012." });
  expect(dob({ "dob-m": "13" })).toMatchObject({ field: "dob-m", parts: ["dob-m"] });
  expect(dob({ "dob-m": "2", "dob-d": "30" })).toMatchObject({ field: "dob-d", parts: ["dob-d"] });
  expect(dob({ "dob-m": "0", "dob-y": "2016" })).toMatchObject({ field: "dob-m", parts: ["dob-m", "dob-y"] });

  renderAt("/admissions/apply", ApplyPage);
  for (const [id, v] of Object.entries({ ...base, "dob-y": "2016" })) if (id !== "citizenship") type(id, v);
  fireEvent.click(document.getElementById("citizenship")!);
  fireEvent.click(document.querySelector('.apply-nav button[type="submit"]')!);
  expect(document.getElementById("dob-y")!.hasAttribute("data-error")).toBe(true); // the year is highlighted
  expect(document.getElementById("dob-m")!.hasAttribute("data-error")).toBe(false);
});

it("apply: an invalid step focuses the problem count, then the first problem field", () => {
  vi.useFakeTimers();
  renderAt("/admissions/apply", ApplyPage);
  type("first", "Ada");
  type("last", ""); // the store keeps the previous test's answers
  fireEvent.click(document.querySelector('.apply-nav button[type="submit"]')!);
  expect(document.activeElement?.textContent).toMatch(/^This step has \d+ problems?\. Moving you to the first one\.$/);
  act(() => { vi.advanceTimersByTime(INVALID_PAUSE_MS); });
  expect(document.activeElement?.id).toBe("last"); // first is filled, so last name is the first problem
});

it("apply: on step 2 an invalid major moves focus to the (mouse-only) major menu", () => {
  vi.useFakeTimers();
  renderAt("/admissions/apply", ApplyPage);
  const next = () => fireEvent.click(document.querySelector('.apply-nav button[type="submit"]')!);
  for (const [id, v] of [["first", "Ada"], ["last", "Quill"], ["dob-m", "4"], ["dob-d", "12"], ["dob-y", "2008"], ["email", "ada@example.com"],
    ["street", "1 Grove Way"], ["city", "Arcadia Falls"], ["zip", "95579"]]) type(id, v);
  fireEvent.click(document.getElementById("citizenship")!);
  next();
  for (const [id, v] of [["school", "Arcadia High"], ["school-city", "Arcadia Falls, CA"], ["grad-m", "6"], ["grad-d", "1"], ["grad-y", "2026"], ["gpa", "3.5"]]) type(id, v);
  fireEvent.click(document.getElementById("term")!);
  next(); // no major chosen
  expect(document.activeElement?.textContent).toBe("This step has 1 problem. Moving you to the first one.");
  act(() => { vi.advanceTimersByTime(INVALID_PAUSE_MS); });
  expect(document.activeElement?.id).toBe("major");
  expect(document.activeElement?.textContent).toContain("First-choice major");
  fireEvent.click(screen.getByText("Back"));
});

it("apply CTF: starting counts down while the form fades, then focuses the first field", () => {
  vi.useFakeTimers();
  localStorage.clear();
  renderAt("/admissions/apply", ApplyPage);
  act(() => { startRun("apply-sr", "tester"); });
  expect(document.querySelector(".apply-card--blind")).toBeNull(); // first the form scrolls into view
  expect(document.querySelector(".apply-countdown")).toBeNull();
  act(() => { vi.advanceTimersByTime(700); });
  expect(document.querySelector(".apply-card--blind")).not.toBeNull();
  expect(document.querySelector(".apply-countdown")!.textContent).toBe("Form hides in 5");
  act(() => { vi.advanceTimersByTime(2000); });
  expect(document.querySelector(".apply-countdown")!.textContent).toBe("Form hides in 3");
  act(() => { vi.advanceTimersByTime(3000); });
  expect(document.querySelector(".apply-countdown")).toBeNull();
  expect(document.activeElement?.id).toBe("first");
  act(() => { endRun(); });
});

it("apply CTF: a run needs the referral code and ends with the flag", async () => {
  localStorage.clear();
  renderAt("/admissions/apply", ApplyPage);
  act(() => { startRun("apply-sr", "tester"); });
  await waitFor(() => expect(document.querySelector(".apply-card--blind")).not.toBeNull()); // fades out after scrolling into view
  act(() => { revealPage(); });
  expect(document.querySelector(".apply-card--blind")).toBeNull(); // until the player pays to show it
  const next = () => fireEvent.click(document.querySelector('.apply-nav button[type="submit"]')!);
  for (const [id, v] of [["first", "Ada"], ["last", "Quill"], ["dob-m", "4"], ["dob-d", "12"], ["dob-y", "2008"], ["email", "ada@example.com"],
    ["street", "1 Grove Way"], ["city", "Arcadia Falls"], ["zip", "95579"]]) type(id, v);
  fireEvent.click(document.getElementById("citizenship")!);
  next();
  for (const [id, v] of [["school", "Arcadia High"], ["school-city", "Arcadia Falls, CA"], ["grad-m", "6"], ["grad-d", "1"], ["grad-y", "2026"], ["gpa", "3.5"]]) type(id, v);
  fireEvent.click(document.getElementById("term")!);
  fireEvent.click(document.querySelector(".fake-select-value")!);
  fireEvent.click([...document.querySelectorAll(".fake-select-option")].find((o) => o.textContent === "Undeclared (exploring)")!);
  next();
  expect(screen.getByText(/Step 2 of 3/)).toBeTruthy(); // the referral code is required during a run
  type("referral", "rsu 7q4k");
  next();
  type("essay1", "I learned to ask for help.");
  type("essay2", "Because I love it.");
  fireEvent.click(document.getElementById("certify")!);
  next();
  await waitFor(() => expect(screen.getByText("Application submitted")).toBeTruthy(), { timeout: 2000 });
  expect(screen.getByRole("heading", { name: "Congratulations! You completed the challenge!" })).toBeTruthy();
  expect(document.querySelector(".ctf-complete .ctf-flag")!.textContent).toMatch(/^RSU\{apply-sr-[0-9a-f]{8}\}$/);
  expect(ctfStore.get().run).toBeNull(); // completed automatically, no flag to type
  fireEvent.click(screen.getByText("Try again with all issues fixed"));
  expect(ctfStore.get().result).toBeNull();
  expect(a11yStore.get()).toMatchObject({ fixErrors: true, fixAlerts: true, fixManual: true });
  expect(screen.getByText(/Step 1 of 3/)).toBeTruthy(); // the application starts over
  endRun();
});

it("legacy aid: works with a mouse, submits to an on-page confirmation", async () => {
  renderAt("/financial-aid/legacy-application", LegacyAidPage);
  expect(document.querySelector("table.legacy-frame")).not.toBeNull();
  expect(document.querySelector('input[type="image"]:not([alt])')).not.toBeNull();
  expect(document.querySelector('[tabindex="1"]')).not.toBeNull();
  expect(document.querySelector("title")?.textContent ?? "").toBe("");
  fireEvent.submit(document.querySelector("form")!);
  expect(screen.getByText(/ERROR: Invalid input/)).toBeTruthy();

  for (const [id, v] of [["sid", "912345678"], ["last", "Quill"], ["first", "Ada"], ["dob-m", "4"], ["dob-d", "12"], ["dob-y", "2004"], ["email", "ada@example.com"],
    ["street", "1 Grove Way"], ["city", "Arcadia Falls"], ["zip", "95579"], ["income", "42000"], ["explanation", "Lost hours at work."], ["captcha", "7kq2m"]]) type(id, v);
  fireEvent.click(document.querySelector('input[name="enroll"]')!);
  fireEvent.click(document.getElementById("aid-sug")!);
  fireEvent.click(document.getElementById("certify")!);
  fireEvent.click(document.querySelector('input[type="image"]')!);
  await waitFor(() => expect(screen.getByText("Application Received")).toBeTruthy(), { timeout: 2000 });
  expect(document.querySelector(".legacy-code")!.textContent).toMatch(/^RSU-/);

  act(() => a11yStore.fixAll());
  expect(document.querySelector("table.legacy-frame")).toBeNull();
  expect(document.querySelector("title")!.textContent).toContain("Institutional Aid Application");
});

it("apply: Tab is scrambled between step 1 fields only, until fixed", () => {
  renderAt("/admissions/apply", ApplyPage);
  const tab = (id: string, shiftKey = false) => { document.getElementById(id)!.focus(); fireEvent.keyDown(document.getElementById(id)!, { key: "Tab", shiftKey }); return document.activeElement?.id; };
  expect(tab("last")).toBe("zip");
  expect(tab("zip", true)).toBe("last");
  expect(tab("phone")).toBe("citizenship"); // then on through the rest of the form
  expect(tab("last", true)).toBe("last"); // leaving backwards is the browser's normal order
  expect(document.querySelector('.apply-form [tabindex]:not([tabindex="-1"])')).toBeNull(); // no positive tabindex
  act(() => a11yStore.set({ fixManual: true }));
  expect(tab("last")).toBe("last"); // natural order: the browser moves focus (jsdom doesn't)
});
