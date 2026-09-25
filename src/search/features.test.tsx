// Plan 06 #5, #6 and #12 (search, event registration, study-room grid, visit scheduling): every registered
// scenario renders its marker in the default render on each page it lists, and the toggles switch behavior.
import { readFileSync } from "node:fs";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { eventsScenarios } from "~/a11y/registry/events";
import { libraryScenarios } from "~/a11y/registry/library";
import { searchScenarios } from "~/a11y/registry/search";
import { visitScenarios } from "~/a11y/registry/visit";
import { a11yStore } from "~/a11y/state";
import { SiteHeader } from "~/components/SiteHeader";
import { inventory } from "~/routes/inventory";
import Visit from "~/pages/admissions/visit";
import EventPage from "~/pages/events/$slug";
import StudyRooms from "~/pages/library/study-rooms";
import SearchPage from "~/pages/SearchPage";

beforeAll(() => {
  Object.assign(HTMLDialogElement.prototype, {
    showModal(this: HTMLDialogElement) { this.open = true; },
    show(this: HTMLDialogElement) { this.open = true; },
    close(this: HTMLDialogElement) { this.open = false; },
  });
  const index = readFileSync("public/search-index.json", "utf8");
  vi.stubGlobal("fetch", async () => new Response(index));
});
afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });

const pages: Record<string, React.ComponentType> = {
  "/search": SearchPage, "/admissions/visit": Visit, "/library/study-rooms": StudyRooms, "/events/:slug": EventPage,
};
function renderAt(url: string, element?: React.ReactNode) {
  const path = url.split("?")[0];
  const pattern = inventory.find((e) => e.path === path)?.pattern ?? path;
  const Page = pages[pattern];
  const router = createMemoryRouter([{ path: pattern, element: element ?? <Page /> }], { initialEntries: [url] });
  return render(<RouterProvider router={router} />).container;
}
const markersOf = (el: Element) => new Set([...el.innerHTML.matchAll(/data-a11y-scenario="([^"]+)"/g)].flatMap((m) => m[1].split(" ")));

describe("markers", () => {
  const mine = [
    ...searchScenarios,
    ...visitScenarios,
    ...libraryScenarios.filter((s) => s.pages.includes("/library/study-rooms")),
    ...eventsScenarios.filter((s) => s.id.startsWith("events-reg-")),
  ];
  const expand = (p: string) => (p.includes(":") ? inventory.filter((e) => e.pattern === p).map((e) => e.path) : [p]);

  it("every page scenario is rendered on every page it lists", () => {
    const missing: string[] = [];
    for (const s of mine.filter((s) => !s.pages.includes("*"))) {
      for (const path of s.pages.flatMap(expand)) {
        if (!markersOf(renderAt(path)).has(s.id)) missing.push(`${s.id} on ${path}`);
        cleanup();
      }
    }
    expect(missing).toEqual([]);
  });

  it("registration form renders exactly on the listed events", () => {
    const listed = new Set(eventsScenarios.find((s) => s.id === "events-reg-stepper-001")!.pages);
    for (const path of inventory.filter((e) => e.pattern === "/events/:slug").map((e) => e.path)) {
      expect(markersOf(renderAt(path)).has("events-reg-stepper-001"), path).toBe(listed.has(path));
      cleanup();
    }
  });

  it("header search chrome scenarios render on a sample page", () => {
    const html = markersOf(renderAt("/about", <SiteHeader />));
    for (const s of searchScenarios.filter((s) => s.pages.includes("*"))) expect(html).toContain(s.id);
  });

  it("every page renders with all toggles on", () => {
    act(() => a11yStore.fixAll());
    for (const path of ["/search", "/admissions/visit", "/library/study-rooms", "/events/fall-choral-concert"]) {
      expect(renderAt(path).querySelector("h1"), path).not.toBeNull();
      cleanup();
    }
  });
});

describe("header search", () => {
  it("unnamed icon button and mouse-only suggestions until fixed", async () => {
    const c = renderAt("/about", <SiteHeader />);
    const input = c.querySelector<HTMLInputElement>("#site-search-q")!;
    expect(c.querySelector(".site-search-submit")!.textContent).toBe("");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "nursing" } });
    await waitFor(() => expect(c.querySelector(".site-search-list")).not.toBeNull());
    expect(c.querySelector('[role="listbox"]')).toBeNull();
    expect(input.getAttribute("role")).toBeNull();

    act(() => a11yStore.set({ fixErrors: true, fixManual: true }));
    expect(c.querySelector(".site-search-submit")!.textContent).toBe("Search");
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe("site-search-opt-0");
    expect(c.querySelector("#site-search-opt-0")!.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("/search", () => {
  it("did-you-mean, facets and live count follow their toggles", async () => {
    const c = renderAt("/search?q=nursng");
    await screen.findByText(/Did you mean/);
    expect(c.querySelector(".search-suggestion a")!.getAttribute("href")).toBe("#");
    expect(c.querySelector(".search-count")!.getAttribute("role")).toBeNull();
    expect(c.querySelector("#search-page-q")!.getAttribute("placeholder")).toBe("Search terms");
    act(() => a11yStore.fixAll());
    expect(c.querySelector(".search-suggestion a")!.getAttribute("href")).toBe("/search?q=nursing");
    expect(c.querySelector(".search-count")!.getAttribute("role")).toBe("status");
    expect(c.querySelector('label[for="search-page-q"]')).not.toBeNull();
  });

  it("facet buttons expose pressed state once fixed", async () => {
    const c = renderAt("/search?q=computer science");
    await waitFor(() => expect(c.querySelector(".search-facet")).not.toBeNull());
    expect(c.querySelector(".search-facet")!.hasAttribute("aria-pressed")).toBe(false);
    expect(c.querySelector("#search-facets-label")).toBeNull();
    expect(c.querySelector(".search-result-title")!.tagName).toBe("H4");
    act(() => a11yStore.fixAll());
    expect(c.querySelector(".search-facet")!.getAttribute("aria-pressed")).toBe("true");
    expect(c.querySelector("#search-facets-label")).not.toBeNull();
    expect(c.querySelector(".search-result-title")!.tagName).toBe("H3");
  });
});

describe("event registration", () => {
  it("vague errors and span stepper until fixed; confirms with a deterministic code", async () => {
    const c = renderAt("/events/fall-choral-concert");
    const form = c.querySelector<HTMLFormElement>(".evd-form")!;
    expect(c.querySelector("span.evd-step")).not.toBeNull();
    fireEvent.click(c.querySelectorAll("span.evd-step")[1]);
    expect(c.querySelector(".evd-count")!.textContent).toBe("2");
    fireEvent.submit(form);
    expect(c.querySelectorAll(".evd-error")[0].textContent).toBe("Invalid input");

    act(() => a11yStore.fixAll());
    expect(c.querySelector('button[aria-label="Add one attendee"]')).not.toBeNull();
    expect(c.querySelector<HTMLInputElement>("#reg-fall-choral-concert-count")!.value).toBe("2");
    fireEvent.submit(form);
    const nameInput = c.querySelector("#reg-fall-choral-concert-name")!;
    expect(nameInput.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById(nameInput.getAttribute("aria-describedby")!)!.textContent).toMatch(/Enter the name/);
    expect(nameInput.getAttribute("aria-required")).toBe("true");

    fireEvent.change(nameInput, { target: { value: "Maya Lin" } });
    fireEvent.change(c.querySelector("#reg-fall-choral-concert-email")!, { target: { value: "maya@example.com" } });
    fireEvent.submit(form);
    const code = await screen.findByText(/^RSU-/, {}, { timeout: 2000 });
    expect(code.closest('[role="status"]')).not.toBeNull();
    expect(c.querySelector(".evd-confirm")!.textContent).toContain("total $30");
  });
});

describe("study rooms", () => {
  it("books by pointer; the fixed state adds a keyboard form; toast persists once fixed", async () => {
    const c = renderAt("/library/study-rooms");
    expect(c.querySelector(".lib-rooms-picker")).toBeNull();
    const slot = c.querySelector<HTMLElement>("[data-slot]")!;
    fireEvent.pointerDown(slot);
    expect(slot.className).toContain("lib-slot--selected");
    fireEvent.click(screen.getByRole("button", { name: "Reserve" }));
    await waitFor(() => expect(c.querySelector(".toast")).not.toBeNull(), { timeout: 2000 });
    expect(c.querySelector(".toast-region")!.getAttribute("role")).toBeNull();
    expect(c.querySelector(".lib-slot--mine")).not.toBeNull();

    act(() => a11yStore.fixAll());
    expect(c.querySelector(".toast-region")!.getAttribute("role")).toBe("status");
    expect(c.querySelector(".lib-rooms-picker select")).not.toBeNull();
  });
});

describe("visit scheduling", () => {
  it("honors ?date=&time=, books through the dialog and shows a toast", async () => {
    const c = renderAt("/admissions/visit?date=2026-10-07&time=10%3A00%20a.m.");
    await waitFor(() => expect(c.querySelector(".visit-time.is-selected")).not.toBeNull());
    expect(c.querySelector(".fake-calendar-day.is-selected")!.textContent).toBe("7");
    expect(c.querySelector(".visit-time")!.hasAttribute("aria-pressed")).toBe(false);
    expect(c.querySelector('label[for="visit-guests"]')).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Reserve this tour" }));
    expect(c.querySelector<HTMLDialogElement>("dialog.modal")!.open).toBe(true);
    fireEvent.change(c.querySelector("#visit-name")!, { target: { value: "Sam Ortiz" } });
    fireEvent.change(c.querySelector("#visit-email")!, { target: { value: "sam@example.com" } });
    fireEvent.submit(c.querySelector(".visit-form")!);
    await waitFor(() => expect(c.querySelector(".toast")!.textContent).toMatch(/Wednesday, October 7, 2026 at 10:00 a\.m\..*RSU-/), { timeout: 2000 });
    expect(c.querySelector<HTMLDialogElement>("dialog.modal")!.open).toBe(false);

    act(() => a11yStore.fixAll());
    expect(c.querySelector<HTMLInputElement>('input[type="date"]')!.value).toBe("2026-10-07");
    expect(c.querySelector(".visit-time.is-selected")!.getAttribute("aria-pressed")).toBe("true");
    expect(c.querySelector('label[for="visit-guests"]')).not.toBeNull();
    expect(c.querySelector(".toast-region")!.getAttribute("role")).toBe("status");
  });
});
