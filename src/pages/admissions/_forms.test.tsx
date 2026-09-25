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
import DonatePage from "../giving/donate";
import LegacyAidPage from "../financial-aid/legacy-application";
import ApplyPage from "./apply";

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
  expect(screen.getByText(/Step 1 of 5/)).toBeTruthy();
  fireEvent.click(screen.getByText("Next"));
  expect(screen.getAllByText("Invalid").length).toBeGreaterThan(3);
  for (const [id, v] of [["first", "Ada"], ["last", "Quill"], ["dob-m", "4"], ["dob-d", "12"], ["dob-y", "2008"], ["email", "ada@example.com"],
    ["street", "1 Grove Way"], ["city", "Arcadia Falls"], ["zip", "95579"], ["citizenship", "U.S. citizen"]]) type(id, v);
  fireEvent.click(screen.getByText("Next"));
  expect(screen.getByText(/Step 2 of 5/)).toBeTruthy();
  expect(document.querySelector('[aria-current="step"]')).toBeNull();
  act(() => a11yStore.fixAll());
  expect(document.querySelector('[aria-current="step"]')!.textContent).toContain("Academic history");
  fireEvent.click(screen.getByText("Back"));
  expect((document.getElementById("first") as HTMLInputElement).value).toBe("Ada");
  expect(document.activeElement?.textContent).toContain("Step 1 of 5");
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
