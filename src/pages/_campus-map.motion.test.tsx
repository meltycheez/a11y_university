// Plan 06 #11 (motion): the /athletics score ticker. Loader data is passed as hydration data so the first
// render is synchronous, like the prerendered page, and fake timers drive rotation.
// (Lives beside the campus map tests because of file ownership during plan 06; move freely. The homepage's
// hero carousel and announcement ticker were removed in the minimal homepage redesign; `npm run check:scenarios`
// still verifies home's scenario/marker parity at build time.)
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { athleticsScenarios } from "~/a11y/registry/athletics";
import { a11yStore } from "~/a11y/state";
import AthleticsHome, { loader as athleticsLoader } from "./athletics/index";

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); vi.useRealTimers(); vi.unstubAllGlobals(); });

async function renderPage(path: string, Page: React.ComponentType, loader: () => Promise<unknown>) {
  const loaderData = { page: await loader() };
  const router = createMemoryRouter([{ id: "page", path, element: <Page />, loader }], { initialEntries: [path], hydrationData: { loaderData } });
  return render(<RouterProvider router={router} />).container;
}
const markers = (c: HTMLElement) => new Set([...c.innerHTML.matchAll(/data-a11y-scenario="([^"]+)"/g)].flatMap((m) => m[1].split(" ")));
const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

it("athletics renders every /athletics marker and the ticker gets a pause button when fixed", async () => {
  const c = await renderPage("/athletics", AthleticsHome, athleticsLoader);
  const found = markers(c);
  expect(athleticsScenarios.filter((s) => s.pages.includes("/athletics") && !found.has(s.id)).map((s) => s.id)).toEqual([]);
  expect(athleticsScenarios.filter((s) => s.pages.includes("/athletics")).length).toBeLessThanOrEqual(15);
  const ticker = c.querySelector(".ath-ticker")!;
  expect(ticker.querySelector(".ath-ticker-pause")).toBeNull();
  expect(ticker.querySelector(".ath-ticker-dup")!.getAttribute("aria-hidden")).toBe("true");
  act(() => a11yStore.set({ fixManual: true }));
  fireEvent.click(ticker.querySelector(".ath-ticker-pause")!);
  expect(ticker.classList.contains("is-paused")).toBe(true);
});
