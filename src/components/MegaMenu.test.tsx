import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, expect, it } from "vitest";
import { a11yStore } from "~/a11y/state";
import { MegaMenu } from "./MegaMenu";

afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });
const inRouter = () => render(<RouterProvider router={createMemoryRouter([{ path: "/", element: <MegaMenu /> }])} />);

it("defective: panels have no keyboard-reachable trigger, only a hover-only link", () => {
  const { container } = inRouter();
  expect(container.querySelectorAll("button.mega-trigger")).toHaveLength(0);
  expect(container.querySelectorAll("a.mega-trigger").length).toBeGreaterThan(0);
});

it("fixed: Enter/click opens a panel, Escape closes it and returns focus, arrows move between triggers", () => {
  act(() => a11yStore.set({ fixManual: true }));
  inRouter();
  const triggers = screen.getAllByRole("button", { name: /./ }).filter((b) => b.className.includes("mega-trigger"));
  expect(triggers.length).toBeGreaterThan(1);
  const [first, second] = triggers;

  expect(first.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(first);
  expect(first.getAttribute("aria-expanded")).toBe("true");
  expect(document.getElementById(first.getAttribute("aria-controls")!)!.hidden).toBe(false);

  first.focus();
  fireEvent.keyDown(first, { key: "ArrowRight" });
  expect(document.activeElement).toBe(second);

  fireEvent.keyDown(second, { key: "Escape" });
  expect(first.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(first);
});
