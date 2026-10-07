// Portal pages (incl. the registration SPA): every registered scenario's marker is in the default render, the
// fixed state renders, the interactions work, and portal/cart state survives client navigation.
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { scenarios } from "~/a11y/registry";
import { registrationScenarios } from "~/a11y/registry/registration";
import { a11yStore } from "~/a11y/state";
import { endRun, startRun } from "~/ctf/store";
import * as dashboard from "./index";
import * as schedule from "./schedule";
import * as grades from "./grades";
import * as audit from "./degree-progress";
import * as account from "./account";
import * as registration from "./registration";
import * as holds from "./holds";
import * as todo from "./todo";
import * as messages from "./messages";
import * as profile from "./profile";

// jsdom has no <dialog> methods.
Object.assign(HTMLDialogElement.prototype, {
  showModal(this: HTMLDialogElement) { this.open = true; },
  show(this: HTMLDialogElement) { this.open = true; },
  close(this: HTMLDialogElement) { this.open = false; },
});
afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });

type Mod = { default: React.ComponentType; loader: () => unknown };
const pages: Record<string, Mod> = {
  "/portal": dashboard, "/portal/schedule": schedule, "/portal/grades": grades, "/portal/degree-progress": audit,
  "/portal/account": account, "/portal/registration": registration, "/portal/holds": holds, "/portal/todo": todo,
  "/portal/messages": messages, "/portal/profile": profile,
};
const routes = Object.entries(pages).map(([path, m]) => ({ path, loader: m.loader, Component: m.default }));

async function open(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const view = render(<RouterProvider router={router} />);
  await waitFor(() => expect(view.container.querySelector("h1")).toBeTruthy());
  return { router, container: view.container };
}
const markers = (el: Element) =>
  new Set([...el.querySelectorAll("[data-a11y-scenario]")].flatMap((n) => n.getAttribute("data-a11y-scenario")!.split(/\s+/)));

describe("portal pages", () => {
  it.each(Object.keys(pages))("%s renders every registered marker, and the fixed state", async (path) => {
    const { container } = await open(path);
    // PortalShell scenarios render in the layout, which these page-only renders leave out; check:scenarios
    // verifies them in the prerendered HTML.
    const expected = [...scenarios.values()].filter((s) => s.pages.includes(path) && s.component !== "PortalShell").map((s) => s.id);
    expect(expected.filter((id) => !markers(container).has(id))).toEqual([]);
    const unregistered = [...markers(container)].filter((id) => !scenarios.get(id)?.pages.includes(path));
    expect(unregistered).toEqual([]);
    act(() => a11yStore.fixAll());
    expect(container.querySelector("h1")).toBeTruthy();
  });

  it("registration is a tier T page", () => {
    expect(registrationScenarios.length + 1).toBeGreaterThanOrEqual(30); // + the template Print button
  });
});

describe("registration SPA", () => {
  it("adds to the cart, flags conflicts, reorders, and registers", async () => {
    const { container, router } = await open("/portal/registration");
    const addButtons = () => container.querySelectorAll<HTMLButtonElement>(".rg-add");
    const cart = () => container.querySelector(".rg-cart")!;

    // CS 220 and CS 222 both meet MWF 9:00–9:50 in Spring 2027.
    const row = (code: string) => [...container.querySelectorAll(".rg-course")].find((c) => c.textContent!.includes(code))!;
    fireEvent.click(row("CS 220").querySelector(".rg-add")!);
    fireEvent.click(row("CS 222").querySelector(".rg-add")!);
    expect(within(cart() as HTMLElement).getAllByRole("listitem")).toHaveLength(2);
    expect(container.querySelectorAll(".rg-conflict")).toHaveLength(2);
    expect(container.querySelector(".rg-conflict-msg")!.textContent).toBe(""); // color only while defective
    expect(screen.getByText(/added to your Spring 2027 cart/)).toBeTruthy();
    expect(addButtons()[0].textContent).toBe(""); // unnamed icon button

    act(() => a11yStore.fixAll());
    expect(container.querySelector(".rg-conflict-msg")!.textContent).toMatch(/Time conflict with CS 22/);
    expect(container.querySelector(".rg-conflict-msg")!.getAttribute("role")).toBe("alert");
    expect(container.querySelector("table.rg-grid")).toBeTruthy();
    // Up/down buttons replace drag-only priority.
    const first = container.querySelector(".rg-cart-item strong")!.textContent;
    fireEvent.click(screen.getByText(/^Move CS 222-\d+ up$/).closest("button")!);
    expect(container.querySelector(".rg-cart-item strong")!.textContent).not.toBe(first);
    // Removing moves focus to the cart heading.
    fireEvent.click(container.querySelector<HTMLButtonElement>(".rg-cart-actions .pt-linkbtn")!);
    expect(document.activeElement?.id).toBe("rg-cart-heading");

    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm registration" }));
    expect(container.ownerDocument.querySelector("dialog.rg-processing[open]")).toBeTruthy();
    await waitFor(() => expect(container.querySelector("#rg-results-heading")).toBeTruthy(), { timeout: 2000 });
    expect(document.activeElement?.id).toBe("rg-results-heading");
    expect(container.querySelector(".rg-result")!.textContent).toMatch(/Registered|Waitlisted/);

    // The store survives client navigation: the registered class shows under Current Schedule on return.
    await act(() => router.navigate("/portal"));
    await act(() => router.navigate("/portal/registration"));
    await waitFor(() => expect(container.querySelector("#rg-results-heading")).toBeTruthy());
    expect(screen.getByText(/Current Schedule \(1\)/)).toBeTruthy();
  });

  it("gives a vague CRN error until fixed", async () => {
    const { container } = await open("/portal/registration");
    const input = container.querySelector<HTMLInputElement>("#rg-crn")!;
    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.submit(input.form!);
    expect(container.querySelector("#rg-crn-error")!.textContent).toBe("Invalid entry.");
    act(() => a11yStore.fixAll());
    fireEvent.submit(input.form!);
    expect(container.querySelector("#rg-crn-error")!.textContent).toMatch(/5-digit CRN/);
    expect(input.getAttribute("aria-describedby")).toBe("rg-crn-error");
  });
});

describe("voice control CTF", () => {
  it("needs exactly the three classes in priority order, then shows the flag", async () => {
    localStorage.clear();
    const { container } = await open("/portal/registration");
    act(() => { startRun("registration-voice", "tester"); });
    const input = container.querySelector<HTMLInputElement>("#rg-crn")!;
    const quickAdd = (crn: string) => { fireEvent.change(input, { target: { value: crn } }); fireEvent.submit(input.form!); };
    const register = async () => {
      fireEvent.click(screen.getByRole("button", { name: "Submit enrollment request" })); // visible text: "Register"
      fireEvent.click(container.querySelector(".rg-confirm-icon")!); // the unnamed check-mark
      await waitFor(() => expect(container.querySelector("#rg-results-heading")).toBeTruthy(), { timeout: 2000 });
    };
    expect(screen.getByRole("button", { name: "Enroll" }).textContent).toBe("Add");
    quickAdd("43772"); // HIST 111-80: not part of the task (and full, so it's waitlisted)
    await register();
    await waitFor(() => expect(screen.getByText(/Challenge not complete yet/)).toBeTruthy(), { timeout: 2000 });
    for (const crn of ["44458", "45934", "43099"]) quickAdd(crn);
    await register();
    await waitFor(() => expect(container.querySelector(".ctf-complete .ctf-flag")?.textContent).toMatch(/^RSU\{registration-voice-[0-9a-f]{8}\}$/), { timeout: 2000 });
    endRun();
  });
});

describe("portal interactions", () => {
  it("acknowledges, reads messages and checks off to-dos, surviving navigation", async () => {
    const { container, router } = await open("/portal");
    expect(screen.getByText("Announcements (2)")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: /^Acknowledge/ })[0]);
    expect(screen.getByText("Announcements (1)")).toBeTruthy();

    await act(() => router.navigate("/portal/messages"));
    await waitFor(() => expect(container.querySelector(".pt-inbox")).toBeTruthy());
    const unread = () => container.querySelectorAll(".pt-unread").length;
    const before = unread();
    const row = container.querySelector<HTMLElement>(".pt-unread .pt-inbox-open")!;
    expect(row.tagName).toBe("DIV"); // clickable div while defective
    fireEvent.click(row);
    expect(unread()).toBe(before - 1);

    await act(() => router.navigate("/portal/todo"));
    await waitFor(() => expect(container.querySelector(".pt-todo")).toBeTruthy());
    const heading = () => container.querySelector("#todo-open")!.textContent;
    const count = heading();
    fireEvent.click(container.querySelector<HTMLInputElement>(".pt-todo input[type=checkbox]")!);
    expect(heading()).not.toBe(count);

    await act(() => router.navigate("/portal"));
    await waitFor(() => expect(screen.getByText("Announcements (1)")).toBeTruthy());
  });

  it("opens a hold's detail modal and grades tabs switch terms", async () => {
    const { container, router } = await open("/portal/holds");
    fireEvent.click(screen.getAllByText("View details")[0]);
    expect(container.querySelector(".modal--div")).toBeTruthy(); // no-semantics variant
    await act(() => router.navigate("/portal/grades"));
    await waitFor(() => expect(container.querySelector(".tabs")).toBeTruthy());
    const tabs = container.querySelectorAll<HTMLButtonElement>(".tab");
    fireEvent.click(tabs[1]);
    expect(tabs[1].classList.contains("is-active")).toBe(true);
    expect(tabs[1].getAttribute("role")).toBeNull(); // no-roles while defective
  });
});
