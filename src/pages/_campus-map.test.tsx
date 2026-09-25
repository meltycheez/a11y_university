// /campus-map: every registered scenario renders its marker in the default (prerendered) state, the defects are
// real in the DOM, and the Fix toggles switch to the accessible map.
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, expect, it } from "vitest";
import { campusMapScenarios } from "~/a11y/registry/campus-map";
import { a11yStore } from "~/a11y/state";
import CampusMapPage from "./campus-map";

afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });

const renderMap = () =>
  render(<RouterProvider router={createMemoryRouter([{ path: "/campus-map", element: <CampusMapPage /> }], { initialEntries: ["/campus-map"] })} />).container;
const markers = (c: HTMLElement) => new Set([...c.innerHTML.matchAll(/data-a11y-scenario="([^"]+)"/g)].flatMap((m) => m[1].split(" ")));

it("registers 30+ scenarios and renders every marker by default", () => {
  expect(campusMapScenarios.length).toBeGreaterThanOrEqual(30);
  const found = markers(renderMap());
  expect(campusMapScenarios.filter((s) => !found.has(s.id)).map((s) => s.id)).toEqual([]);
});

it("ships the defective map and fixes it with the toggles", () => {
  const c = renderMap();
  const q = <T extends Element>(s: string) => c.querySelector<T>(s);
  const svg = q<SVGSVGElement>("svg.cmap-svg")!;
  const founders = () => q<SVGPathElement>("path#founders-hall")!;

  // Defective
  expect(svg.getAttribute("role")).toBe("img");
  expect(founders().getAttribute("role")).toBeNull();
  expect(founders().getAttribute("tabindex")).toBeNull();
  expect(c.querySelectorAll("#founders-hall").length).toBe(2);
  expect(q(".cmap-zoom-btn")!.getAttribute("tabindex")).toBe("1");
  expect(q(".cmap-zoom-btn")!.getAttribute("aria-label")).toBeNull();
  expect(q(".cmap-legend-toggle")!.getAttribute("aria-expanded")).toBe("yes");
  expect(q(".cmap-lots")!.getAttribute("aria-hidden")).toBe("true");
  expect(q("h2.cmap-detail-title")!.textContent).toBe("");
  expect(q("#cmap-category")!.getAttribute("aria-controls")).toBe("map-buildings");
  expect(q(".cmap-list")).toBeNull();
  expect(q(".cmap > .cmap-tools")).toBe(q(".cmap")!.lastElementChild);

  // Mouse still works: click a building, see details with h5 subheadings and a "Learn more" link
  fireEvent.click(founders());
  expect(q(".cmap-detail h2")!.textContent).toContain("Founders Hall");
  expect(c.querySelectorAll(".cmap-detail h5").length).toBe(3);
  expect(q(".cmap-detail a")!.textContent).toBe("Learn more");
  expect(q<HTMLImageElement>(".cmap-entrances img")!.alt).toBe("");
  fireEvent.click(q(".cmap-close")!);
  expect(document.activeElement).toBe(document.body);

  // Category filter hides other buildings
  fireEvent.change(q("#cmap-category")!, { target: { value: "athletics" } });
  expect(c.querySelectorAll("path.cmap-bldg").length).toBe(4);
  expect(q(".cmap-count")!.textContent).toContain("Showing 4 of");
  fireEvent.change(q("#cmap-category")!, { target: { value: "all" } });

  // Fixed
  act(() => a11yStore.fixAll());
  expect(svg.getAttribute("role")).toBe("group");
  expect(founders().getAttribute("role")).toBe("button");
  expect(founders().getAttribute("tabindex")).toBe("0");
  expect(founders().getAttribute("aria-label")).toBe("Founders Hall (FDR)");
  expect(c.querySelectorAll("#founders-hall").length).toBe(1);
  expect(q(".cmap-zoom-btn")!.getAttribute("tabindex")).toBeNull();
  expect(q(".cmap-zoom-btn")!.getAttribute("aria-label")).toBe("Zoom in");
  expect(q(".cmap-legend-toggle")!.getAttribute("aria-expanded")).toBe("true");
  expect(q(".cmap-lots")!.getAttribute("aria-hidden")).toBeNull();
  expect(q(".cmap-lot")!.getAttribute("aria-label")).toMatch(/^Lot A, /);
  expect(q("h2.cmap-detail-title")!.textContent).toBe("Building details");
  expect(q("#cmap-category")!.getAttribute("aria-controls")).toBe("campus-map-buildings");
  expect(q(".cmap-count")!.getAttribute("role")).toBe("status");
  expect(q(".cmap-chip")!.getAttribute("aria-pressed")).toBe("true");
  expect(q(".cmap")!.firstElementChild!.classList.contains("cmap-tools")).toBe(true);
  expect(c.querySelectorAll(".cmap-list-btn").length).toBe(c.querySelectorAll("path.cmap-bldg").length);

  // Keyboard: select with Enter, focus moves to the panel heading, close returns focus to the building
  founders().focus();
  fireEvent.keyDown(founders(), { key: "Enter" });
  expect(document.activeElement).toBe(q(".cmap-detail h2"));
  expect(c.querySelectorAll(".cmap-detail h3").length).toBe(3);
  expect(q(".cmap-detail a")!.textContent).toBe("Visit Office of the Registrar");
  expect(q<HTMLImageElement>(".cmap-entrances img")!.alt).toBe("Accessible entrance");
  fireEvent.click(q(".cmap-close")!);
  expect(document.activeElement).toBe(founders());

  // Arrow keys pan once zoomed; the list selects too
  fireEvent.click(q('[aria-label="Zoom in"]')!);
  const before = svg.getAttribute("viewBox");
  fireEvent.keyDown(svg, { key: "ArrowRight" });
  expect(svg.getAttribute("viewBox")).not.toBe(before);
  fireEvent.click(c.querySelectorAll(".cmap-list-btn")[1]);
  expect(q(".cmap-detail h2")!.textContent).toContain("Sequoia Library");
});

it("each toggle changes the DOM and turning it off restores it", () => {
  const c = renderMap();
  // Attribute order can change when React removes and re-adds an attribute, so compare sorted attributes.
  const norm = () => [...c.querySelectorAll("*")].map((el) => `${el.tagName}[${[...el.attributes].map((a) => `${a.name}=${a.value}`).sort().join(" ")}]${el.childNodes.length}`).join("\n") + c.textContent;
  const before = norm();
  for (const toggle of ["fixErrors", "fixAlerts", "fixManual"] as const) {
    act(() => a11yStore.set({ [toggle]: true }));
    expect(norm(), toggle).not.toBe(before);
    act(() => a11yStore.resetAll());
    expect(norm(), toggle).toBe(before);
  }
});

it("finds a building by name or code", () => {
  const c = renderMap();
  fireEvent.change(c.querySelector("#cmap-q")!, { target: { value: "oac" } });
  fireEvent.submit(c.querySelector(".cmap-search")!);
  expect(c.querySelector(".cmap-detail h2")!.textContent).toContain("Owl Arena");
  fireEvent.change(c.querySelector("#cmap-q")!, { target: { value: "observatory" } });
  fireEvent.submit(c.querySelector(".cmap-search")!);
  expect(c.querySelector(".cmap-search-msg")!.textContent).toContain("No building matches");
});
