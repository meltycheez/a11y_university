// Plan 06 #11 (motion): the homepage carousel and ticker and the /athletics score ticker. Loader data is passed as
// hydration data so the first render is synchronous, like the prerendered page, and fake timers drive rotation.
// (Lives beside the campus map tests because of file ownership during plan 06; move freely.)
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { athleticsScenarios } from "~/a11y/registry/athletics";
import { homeScenarios } from "~/a11y/registry/home";
import { a11yStore } from "~/a11y/state";
import HomePage, { loader as homeLoader } from "./HomePage";
import AthleticsHome, { loader as athleticsLoader } from "./athletics/index";

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); vi.useRealTimers(); vi.unstubAllGlobals(); });

async function renderPage(path: string, Page: React.ComponentType, loader: () => Promise<unknown>) {
  const loaderData = { page: await loader() };
  const router = createMemoryRouter([{ id: "page", path, element: <Page />, loader }], { initialEntries: [path], hydrationData: { loaderData } });
  return render(<RouterProvider router={router} />).container;
}
const markers = (c: HTMLElement) => new Set([...c.innerHTML.matchAll(/data-a11y-scenario="([^"]+)"/g)].flatMap((m) => m[1].split(" ")));
const activeSlide = (c: HTMLElement) => [...c.querySelectorAll(".home-slide")].findIndex((s) => s.classList.contains("is-active"));
const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

it("home renders every registered marker, with the hero alt defect on slide 1", async () => {
  const c = await renderPage("/", HomePage, homeLoader);
  const found = markers(c);
  expect(homeScenarios.filter((s) => s.mechanism !== "document" && !found.has(s.id)).map((s) => s.id)).toEqual([]);
  const heroImg = () => c.querySelector(".home-slide img")!;
  expect(heroImg().hasAttribute("alt")).toBe(false);
  expect(c.querySelector(".home-slide h1")!.textContent).toBe("Deep roots. Wide branches.");
  act(() => a11yStore.set({ fixErrors: true }));
  expect(heroImg().getAttribute("alt")).toBeTruthy();
});

it("defective carousel auto-rotates, steals focus and has unreachable controls", async () => {
  const c = await renderPage("/", HomePage, homeLoader);
  expect(activeSlide(c)).toBe(0);
  expect(c.querySelector(".carousel-pause")).toBeNull();
  expect(c.querySelector(".carousel-controls button")).toBeNull();
  expect(c.querySelectorAll(".home-slide[inert]").length).toBe(4);
  tick(6000);
  expect(activeSlide(c)).toBe(1);
  expect(document.activeElement).toBe(c.querySelectorAll(".home-slide")[1]);
  fireEvent.mouseEnter(c.querySelector(".home-carousel")!);
  tick(6000);
  expect(activeSlide(c)).toBe(2); // hovering doesn't stop it
  fireEvent.click(c.querySelector(".carousel-arrow")!); // mouse still works
  expect(activeSlide(c)).toBe(1);
  expect(c.querySelector(".home-ticker .ticker-pause")).toBeNull();
});

it("fixed carousel has pause/play, reachable controls and leaves focus alone", async () => {
  const c = await renderPage("/", HomePage, homeLoader);
  act(() => a11yStore.set({ fixManual: true }));
  const input = c.querySelector<HTMLInputElement>("#program-finder-q")!;
  input.focus();
  tick(6000);
  expect(activeSlide(c)).toBe(1);
  expect(document.activeElement).toBe(input);
  expect(c.querySelectorAll(".carousel-controls button").length).toBe(1 + 2 + 5);
  expect(c.querySelector('[aria-label="Slide 2 of 5: A 1,200-acre forest for a laboratory"]')!.getAttribute("aria-current")).toBe("true");
  fireEvent.click(c.querySelector(".carousel-pause")!);
  expect(c.querySelector(".carousel-pause")!.textContent).toContain("Play");
  tick(18000);
  expect(activeSlide(c)).toBe(1);
  fireEvent.click(c.querySelector('[aria-label="Next slide"]')!);
  expect(activeSlide(c)).toBe(2);

  const ticker = c.querySelector(".home-ticker")!;
  fireEvent.click(ticker.querySelector(".ticker-pause")!);
  expect(ticker.classList.contains("is-paused")).toBe(true);
});

it("fixed carousel doesn't auto-rotate under prefers-reduced-motion", async () => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
  act(() => a11yStore.set({ fixManual: true }));
  const c = await renderPage("/", HomePage, homeLoader);
  tick(18000);
  expect(activeSlide(c)).toBe(0);
  expect(c.querySelector(".carousel-pause")!.textContent).toContain("Play");
});

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
