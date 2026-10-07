import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Img } from "~/components/Img";
import { ChallengeBanner } from "~/ctf/ChallengeBanner";
import { ctfStore } from "~/ctf/store";
import { PopeTechWidget } from "./PopeTechWidget";
import { scenarios } from "./registry";
import { rules } from "./rules";
import { a11yStore } from "./state";
import { useScenario } from "./useScenario";

Object.assign(HTMLDialogElement.prototype, {
  showModal(this: HTMLDialogElement) { this.open = true; },
  close(this: HTMLDialogElement) { this.open = false; },
});
afterEach(() => { cleanup(); act(() => { a11yStore.resetAll(); ctfStore.set((s) => ({ ...s, run: null, result: null })); }); });

const inRouter = (ui: React.ReactNode) =>
  render(<RouterProvider router={createMemoryRouter([{ path: "/", element: ui }])} />);

describe("registry", () => {
  it("every scenario has a known rule, a page, and a resolved category", () => {
    for (const s of scenarios.values()) {
      expect(rules[s.rule], s.id).toBeDefined();
      expect(s.pages.length, s.id).toBeGreaterThan(0);
      expect(s.category).toBe(rules[s.rule].category);
    }
  });
});

describe("store", () => {
  it("toggles body classes and resets", () => {
    a11yStore.set({ fixAlerts: true });
    expect(document.body.className).toBe("a11y-fix-alerts");
    a11yStore.fixAll();
    expect(document.body.classList.length).toBe(3);
    a11yStore.resetAll();
    expect(document.body.classList.length).toBe(0);
  });
});

describe("useScenario", () => {
  function Probe({ id }: { id: string }) {
    return <span>{useScenario(id) ? "fixed" : "broken"}</span>;
  }

  it("follows only its own category toggle", () => {
    render(<Probe id="home-hero-img-alt-001" />); // error
    expect(screen.getByText("broken")).toBeTruthy();
    act(() => a11yStore.set({ fixAlerts: true, fixManual: true }));
    expect(screen.getByText("broken")).toBeTruthy();
    act(() => a11yStore.set({ fixErrors: true }));
    expect(screen.getByText("fixed")).toBeTruthy();
    act(() => a11yStore.set({ fixErrors: false }));
    expect(screen.getByText("broken")).toBeTruthy();
  });

  it("throws on an unregistered id in development", () => {
    expect(() => render(<Probe id="no-such-scenario" />)).toThrow(/Unknown accessibility scenario/);
  });
});

describe("Img helper", () => {
  it("drops alt while defective and uses fixedAlt when fixed", () => {
    const { container } = render(<Img image="home-hero-quad" scenario="home-hero-img-alt-001" fixedAlt="Students on the quad" />);
    const img = container.querySelector("img")!;
    expect(img.hasAttribute("alt")).toBe(false);
    act(() => a11yStore.set({ fixErrors: true }));
    expect(img.getAttribute("alt")).toBe("Students on the quad");
  });
});

describe("PopeTechWidget", () => {
  it("counts unique mounted scenarios and flips the switch", () => {
    inRouter(
      <>
        <Img image="home-hero-quad" scenario="home-hero-img-alt-001" />
        <Img image="home-hero-quad" scenario="home-hero-img-alt-001" />
        <Img image="home-hero-quad" scenario="home-card-img-alt-suspicious-001" />
        <PopeTechWidget />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pope Tech Accessibility Lab" }));
    const errors = screen.getByRole("switch", { name: "Fix Errors" });
    expect(errors.getAttribute("aria-checked")).toBe("false");
    expect(errors.parentElement!.textContent).toContain("1 active / 1 on page");

    fireEvent.click(errors);
    expect(errors.getAttribute("aria-checked")).toBe("true");
    expect(errors.parentElement!.textContent).toContain("0 active / 1 on page");
    expect(screen.getByRole("status").textContent).toBe("Fix Errors on. 1 errors corrected on this page.");

    fireEvent.click(screen.getByRole("button", { name: "Reset All" }));
    expect(errors.getAttribute("aria-checked")).toBe("false");
  });
});

describe("PopeTechWidget highlights", () => {
  it("outlines unfixed scenarios of a highlighted category and drops them once fixed", async () => {
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    const rect = vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue(new DOMRect(10, 40, 200, 100));
    inRouter(
      <>
        <Img image="home-hero-quad" scenario="home-hero-img-alt-001" />
        <Img image="home-hero-quad" scenario="home-card-img-alt-suspicious-001" />
        <PopeTechWidget />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pope Tech Accessibility Lab" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Highlight errors" }));
    const outlines = () => [...document.querySelectorAll(".a11y-hl")];
    await waitFor(() => expect(outlines().map((el) => el.className)).toEqual(["a11y-hl a11y-hl--error"])); // not the alert
    expect(outlines()[0].textContent).toBe(scenarios.get("home-hero-img-alt-001")!.title);
    expect(document.querySelector(".a11y-key")!.textContent).toContain("Error");

    fireEvent.click(screen.getByRole("switch", { name: "Fix Errors" }));
    await waitFor(() => expect(outlines()).toHaveLength(0));
    fireEvent.click(screen.getByRole("checkbox", { name: "Highlight errors" })); // highlights are module memory, like the fixes
    rect.mockRestore();
    vi.unstubAllGlobals();
  });
});

describe("PopeTechWidget challenges", () => {
  const at = (path: string, ui: React.ReactNode = <PopeTechWidget />) =>
    render(<RouterProvider router={createMemoryRouter([{ path, element: ui }], { initialEntries: [path] })} />);

  it("is one button named Pope Tech Accessibility Lab, and its Challenges tab is the same list on every page", () => {
    for (const path of ["/", "/admissions/apply"]) {
      at(path);
      const button = screen.getByRole("button", { name: "Pope Tech Accessibility Lab" });
      expect(button.textContent!.trim()).toBe("Accessibility Lab"); // visible text; the logo's alt adds "Pope Tech" to the name
      fireEvent.click(button);
      expect(screen.getByRole("tab", { name: "Fixes" }).getAttribute("aria-selected")).toBe("true");
      fireEvent.click(screen.getByRole("tab", { name: "Challenges" }));
      for (const name of ["Application for Admission", "Class Registration", "Campus Map"]) expect(screen.getByRole("link", { name })).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Start the Challenge" })).toBeNull();
      cleanup();
    }
  });

  it("the page's challenge bar starts a run, shows its instructions and score, and the widget charges penalties", () => {
    localStorage.clear();
    at("/admissions/apply", <><ChallengeBanner id="apply-sr" /><PopeTechWidget /></>);
    const bar = within(screen.getByRole("region", { name: "Pope Tech Challenge: Application for Admission" }));
    expect(bar.getByText("Assistive technology: Screen reader")).toBeTruthy();
    act(() => a11yStore.set({ fixErrors: true }));
    expect(bar.queryByLabelText("Your name")).toBeNull(); // collapsed to the heading and one button
    fireEvent.click(bar.getByRole("button", { name: "Start Challenge" }));
    expect(document.activeElement).toBe(bar.getByLabelText("Your name"));
    expect(bar.queryByRole("button", { name: "Start the Challenge" })).toBeNull(); // name first, then the challenge
    fireEvent.click(bar.getByRole("button", { name: "Continue" }));
    expect(bar.getByRole("alert").textContent).toBe("Enter your name to start.");
    fireEvent.change(bar.getByLabelText("Your name"), { target: { value: "ada" } });
    fireEvent.click(bar.getByRole("button", { name: "Continue" }));
    expect(document.activeElement!.textContent).toBe("Pope Tech Challenge: Application for Admission");
    expect(bar.getByText("Player: ada")).toBeTruthy();
    const go = bar.getByRole("button", { name: "Start the Challenge" });
    expect(go.getAttribute("aria-describedby")!.split(" ").map((d) => document.getElementById(d)!.textContent).join(" ")).toContain("fades out over 5 seconds");
    fireEvent.click(go);
    expect(a11yStore.get().fixErrors).toBe(false); // a run starts with every defect on
    expect(document.activeElement!.textContent).toBe("Challenge running");
    expect(bar.getByText("Score: 500 points")).toBeTruthy();
    expect(bar.getByText(/Fill in every required field/)).toBeTruthy();

    fireEvent.click(bar.getByRole("switch", { name: "Fix Alerts" })); // the bar has its own Fix switches during a run
    expect(screen.getAllByRole("status").some((s) => s.textContent!.includes("Challenge penalty: minus 150 points."))).toBe(true);
    expect(bar.getByText("Score: 350 points")).toBeTruthy();

    // Site-styled confirm dialogs, never window.confirm.
    const confirmSpy = vi.spyOn(window, "confirm");
    fireEvent.click(bar.getByRole("button", { name: "Get a hint (−50)" }));
    expect(screen.getByRole("dialog", { name: "Reveal hint 1 of 3?" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(bar.getByText("Score: 350 points")).toBeTruthy();
    fireEvent.click(bar.getByRole("button", { name: "Get a hint (−50)" }));
    fireEvent.click(screen.getByRole("button", { name: "Reveal hint (−50)" }));
    expect(bar.getByText("Score: 300 points")).toBeTruthy();
    expect(bar.queryByRole("button", { name: "View challenge source" })).toBeNull(); // hidden during a run
    fireEvent.click(bar.getByRole("button", { name: "Abandon" }));
    fireEvent.click(screen.getByRole("button", { name: "Abandon challenge" }));
    expect(ctfStore.get().run).toBeNull();
    expect(bar.getByRole("button", { name: "Start the Challenge" })).toBeTruthy();
    expect(confirmSpy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("the challenge bar shows allowed, not allowed and costs-points chips, with details on expand", () => {
    at("/campus-map", <ChallengeBanner id="map-eyes" />);
    const bar = within(screen.getByRole("region", { name: "Pope Tech Challenge: Campus Map" }));
    fireEvent.click(bar.getByRole("button", { name: "Start Challenge" }));
    fireEvent.change(bar.getByLabelText("Your name"), { target: { value: "ada" } });
    fireEvent.click(bar.getByRole("button", { name: "Continue" }));
    const chips = (title: string) => within(bar.getByRole("heading", { name: title, level: 3 }).nextElementSibling as HTMLElement).getAllByRole("listitem").map((li) => li.textContent);
    expect(chips("Allowed")).toContain("✓Gaze and dwell");
    expect(chips("Discouraged")).toEqual(expect.arrayContaining(["✕Physical keyboard", "✕Voice control"]));
    expect(chips("Costs points")).toContain("−Fix switches −150");
    expect(bar.getByText("More about what's allowed and what isn't").closest("details")!.textContent).toContain("including the arrow keys to pan the map");
  });
});
