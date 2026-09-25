// Smoke test for the academics and faculty templates: every page renders, and every scenario registered for
// it has a data-a11y-scenario marker in the defective (default) DOM. Mirrors scripts/check-scenarios.ts
// without needing a build.
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, useLoaderData, useParams } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { scenarios } from "~/a11y/registry";
import { a11yStore } from "~/a11y/state";
import { inventory } from "~/routes/inventory";
import * as hub from "./index";
import * as college from "./colleges/$slug";
import * as dept from "./departments/$slug";
import * as finder from "./programs/index";
import * as program from "./programs/$slug";
import * as minors from "./minors";
import * as certificates from "./certificates";
import * as calendar from "./calendar";
import * as directory from "../faculty/index";
import * as profile from "../faculty/$slug";

afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });

type Mod = { default: (props: any) => React.ReactNode; loader?: (args: any) => unknown };
const modules: Record<string, Mod> = {
  "/academics": hub, "/academics/colleges/:slug": college, "/academics/departments/:slug": dept,
  "/academics/programs": finder, "/academics/programs/:slug": program, "/academics/minors": minors,
  "/academics/certificates": certificates, "/academics/calendar": calendar, "/faculty": directory, "/faculty/:slug": profile,
};

const pages = inventory.filter((e) => modules[e.pattern ?? e.path]);

describe("academics CMS templates", () => {
  it.each(pages.map((e) => [e.path, e.pattern ?? e.path]))("%s renders its registered scenarios", async (path, pattern) => {
    const mod = modules[pattern];
    const Page = mod.default;
    function Wrapper() {
      return <Page params={useParams()} loaderData={useLoaderData()} />;
    }
    const router = createMemoryRouter([{ path: pattern, loader: mod.loader as never, Component: Wrapper }], { initialEntries: [path] });
    const { container } = render(<RouterProvider router={router} />);
    await waitFor(() => expect(container.querySelector(".cms-page")).toBeTruthy());

    const markers = new Set([...container.querySelectorAll("[data-a11y-scenario]")].flatMap((el) => el.getAttribute("data-a11y-scenario")!.split(/\s+/)));
    const expected = [...scenarios.values()].filter((s) => s.pages.includes(path) || s.pages.includes(pattern)).map((s) => s.id);
    expect(expected.filter((id) => !markers.has(id))).toEqual([]);
    act(() => a11yStore.fixAll()); // the fixed state renders too
    expect(container.querySelector(".cms-page")).toBeTruthy();
  });
});
