// Plan 06 #1 and #4: course search, faculty directory and employee directory. Every registered scenario has a
// marker in the default render, toggles switch the markup, and the interactions work.
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { scenarios } from "~/a11y/registry";
import { a11yStore } from "~/a11y/state";
import * as courses from "./courses";
import * as faculty from "../faculty/index";
import * as employees from "../employees/directory";
import { matches } from "./_coursesSearch";

afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });

type Mod = { default: () => React.ReactNode; loader?: () => unknown };
function renderPage(path: string, mod: Mod, url = path) {
  const router = createMemoryRouter([{ path, loader: mod.loader, Component: mod.default }], { initialEntries: [url] });
  return render(<RouterProvider router={router} />);
}
const markers = (el: HTMLElement) =>
  new Set([...el.querySelectorAll("[data-a11y-scenario]")].flatMap((e) => e.getAttribute("data-a11y-scenario")!.split(/\s+/)));
const slow = { timeout: 2000 };

describe.each([
  ["/academics/courses", courses],
  ["/faculty", faculty],
  ["/employees/directory", employees],
] as [string, Mod][])("%s", (path, mod) => {
  it("renders every registered scenario marker, defective and fixed", async () => {
    const { container } = renderPage(path, mod);
    await screen.findByRole("heading", { level: 1 });
    const expected = [...scenarios.values()].filter((s) => s.pages.includes(path)).map((s) => s.id);
    expect(expected.length).toBeGreaterThanOrEqual(8);
    expect(expected.filter((id) => !markers(container).has(id))).toEqual([]);
    act(() => a11yStore.fixAll());
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });
});

describe("course search", () => {
  it("matches keyword tokens as word prefixes", () => {
    const c = { code: "CS 101", title: "Introduction to Programming", subjectName: "Computer Science", description: "", level: "undergraduate", credits: 4, terms: ["Fall 2026"], sections: [] };
    const k = { q: "", subject: "all", term: "all", levels: [], credits: [] };
    expect(matches(c, { ...k, q: "cs 101" })).toBe(true);
    expect(matches(c, { ...k, q: "intro prog" })).toBe(true);
    expect(matches(c, { ...k, q: "cs 102" })).toBe(false);
    expect(matches(c, { ...k, term: "Spring 2027" })).toBe(false);
    expect(matches(c, { ...k, credits: [3] })).toBe(false);
  });

  it("honors ?q=, expands rows and adds to the plan", async () => {
    renderPage("/academics/courses", courses, "/academics/courses?q=CS%20101");
    await waitFor(() => expect(screen.getByText(/^Showing 1–1 of 1 courses$/)).toBeTruthy(), slow);
    const toggle = screen.getByRole("button", { name: /CS 101 Introduction to Programming/ });
    expect(toggle.getAttribute("aria-expanded")).toBeNull(); // defective
    fireEvent.click(toggle);
    expect(screen.queryByRole("table", { name: "Sections of CS 101" })).toBeNull();

    act(() => a11yStore.fixAll());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("table", { name: "Sections of CS 101" })).toBeTruthy();
    expect(screen.getByLabelText("Keyword")).toBeTruthy();
    expect(screen.getByText(/^Showing 1–1 of 1/).getAttribute("role")).toBe("status");

    fireEvent.click(screen.getByRole("button", { name: "Add CS 101 to plan" }));
    const plan = screen.getByRole("complementary", { name: "My course plan" });
    expect(within(plan).getByText("CS 101", { selector: "strong" })).toBeTruthy();
    fireEvent.click(within(plan).getByRole("button", { name: "Remove CS 101" }));
    expect(document.activeElement?.id).toBe("course-plan-heading"); // fixed: focus moves to the plan heading
  });

  it("applies facets after a delay", async () => {
    renderPage("/academics/courses", courses);
    const count = await screen.findByText(/^Showing 1–20 of 304 courses$/);
    fireEvent.click(screen.getByRole("checkbox", { name: "Graduate" }));
    expect(count.textContent).toBe("Searching…");
    await waitFor(() => expect(count.textContent).toMatch(/^Showing 1–\d+ of \d+ courses$/), slow);
    expect(count.textContent).not.toMatch(/of 304/);
  });
});

describe("faculty directory", () => {
  it("filters, switches view and loads more", async () => {
    renderPage("/faculty", faculty);
    expect(await screen.findByText("Showing 12 of 30 faculty")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(screen.getByText("Showing 24 of 30 faculty")).toBeTruthy();

    act(() => a11yStore.fixAll());
    const more = screen.getByRole("button", { name: "Load more" });
    more.focus();
    fireEvent.click(more);
    expect(screen.getByText("Showing 30 of 30 faculty")).toBeTruthy();
    expect(document.activeElement?.classList.contains("fac-name-link")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Table" }));
    expect(screen.getByRole("button", { name: "Table" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("table", { name: "Faculty directory" })).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Research topic"), { target: { value: "robotics" } });
    expect(screen.getByRole("status").textContent).toMatch(/^Showing [1-9] of [1-9] faculty$/);
  });
});

describe("employee directory", () => {
  it("filters by name", async () => {
    renderPage("/employees/directory", employees);
    await screen.findByText(/^\d+ people found$/);
    fireEvent.change(screen.getByPlaceholderText("Name or title"), { target: { value: "zzzz" } });
    expect(screen.getByText("No one matches your search.")).toBeTruthy();
    act(() => a11yStore.fixAll());
    expect(screen.getByLabelText("Name or title")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("No one matches your search.");
  });
});
