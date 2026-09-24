import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { Img } from "~/components/Img";
import { A11yControl } from "./A11yControl";
import { scenarios } from "./registry";
import { rules } from "./rules";
import { a11yStore } from "./state";
import { useScenario } from "./useScenario";

afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });

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

describe("A11yControl", () => {
  it("counts unique mounted scenarios and flips the switch", () => {
    inRouter(
      <>
        <Img image="home-hero-quad" scenario="home-hero-img-alt-001" />
        <Img image="home-hero-quad" scenario="home-hero-img-alt-001" />
        <Img image="home-hero-quad" scenario="home-card-img-alt-suspicious-001" />
        <A11yControl />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Accessibility Test Controls" }));
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
