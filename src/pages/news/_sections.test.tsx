// Every news, events and library scenario renders its marker on every page it is registered for,
// and each page still renders with all toggles on. (check:scenarios does the same after a full build.)
import { act, cleanup, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, expect, it } from "vitest";
import { a11yStore } from "~/a11y/state";
import { eventsScenarios } from "~/a11y/registry/events";
import { libraryScenarios } from "~/a11y/registry/library";
import { newsScenarios } from "~/a11y/registry/news";
import { inventory } from "~/routes/inventory";
import NewsFront from "./index";
import NewsArchive from "./archive";
import NewsSearch from "./search";
import NewsCategory from "./category/$slug";
import ArticlePage from "./$slug";
import EventsCalendar from "../events/index";
import EventsSearch from "../events/search";
import EventsCategory from "../events/category/$slug";
import EventPage from "../events/$slug";
import LibraryHome from "../library/index";
import LibrarySearch from "../library/search";
import DatabasesAZ from "../library/databases";
import GuidesIndex from "../library/guides/index";
import GuidePage from "../library/guides/$slug";
import StudyRooms from "../library/study-rooms";
import LibraryHours from "../library/hours";
import LibraryPolicies from "../library/policies";
import LibraryAccount from "../library/account";

const routes: Record<string, React.ComponentType> = {
  "/news": NewsFront, "/news/archive": NewsArchive, "/news/search": NewsSearch, "/news/category/:slug": NewsCategory, "/news/:slug": ArticlePage,
  "/events": EventsCalendar, "/events/search": EventsSearch, "/events/category/:slug": EventsCategory, "/events/:slug": EventPage,
  "/library": LibraryHome, "/library/search": LibrarySearch, "/library/databases": DatabasesAZ, "/library/guides": GuidesIndex,
  "/library/guides/:slug": GuidePage, "/library/study-rooms": StudyRooms, "/library/hours": LibraryHours, "/library/policies": LibraryPolicies,
  "/library/account": LibraryAccount,
};

afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });

const renderPath = (path: string) => {
  const entry = inventory.find((e) => e.path === path)!;
  const pattern = entry.pattern ?? path;
  const Page = routes[pattern];
  const router = createMemoryRouter([{ path: pattern, element: <Page /> }], { initialEntries: [path] });
  return render(<RouterProvider router={router} />).container;
};

const expand = (p: string) => (p.includes(":") ? inventory.filter((e) => e.pattern === p).map((e) => e.path) : [p]);
const mine = inventory.filter((e) => e.section === "news" || e.section === "events" || e.section === "library").map((e) => e.path);

it("renders every registered marker where registered", () => {
  const scenarios = [...newsScenarios, ...eventsScenarios, ...libraryScenarios];
  const markers = new Map<string, Set<string>>();
  for (const path of mine) {
    const html = renderPath(path).innerHTML;
    markers.set(path, new Set([...html.matchAll(/data-a11y-scenario="([^"]+)"/g)].flatMap((m) => m[1].split(" "))));
    cleanup();
  }
  expect(markers.get("/events")!.size).toBeGreaterThanOrEqual(10);
  const missing = scenarios.flatMap((s) => s.pages.flatMap(expand).filter((p) => !markers.get(p)?.has(s.id)).map((p) => `${s.id} on ${p}`));
  expect(missing).toEqual([]);
  const ids = new Set(scenarios.map((s) => s.id));
  const unregistered = [...markers].flatMap(([p, set]) => [...set].filter((id) => !ids.has(id) && !id.startsWith("global")).map((id) => `${id} on ${p}`));
  expect(unregistered).toEqual([]);
});

it("renders every page with all toggles on", () => {
  act(() => a11yStore.fixAll());
  for (const path of mine) {
    expect(renderPath(path).querySelector("h1")).not.toBeNull();
    cleanup();
  }
});
