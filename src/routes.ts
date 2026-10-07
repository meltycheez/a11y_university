import { existsSync } from "node:fs";
import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
import { routeDefs } from "./routes/inventory";

/**
 * File convention (ADR-023): a route without an explicit module uses src/pages/<path>.tsx, or
 * src/pages/<path>/index.tsx for section roots, with ":slug" as "$slug" ("/news/:slug" -> pages/news/$slug.tsx).
 * Until that file exists the route renders StubPage.
 */
function moduleFor(path: string, fallback: string): string {
  if (!fallback.endsWith("StubPage.tsx")) return fallback;
  const base = `pages${path.replace(/:slug/g, "$slug")}`;
  return [`${base}.tsx`, `${base}/index.tsx`].find((m) => existsSync(`src/${m}`)) ?? fallback;
}

// Routes are generated from the inventory so paths, prerendering and breadcrumbs never drift apart.
export default [
  // Pope Tech demo pages, outside the university chrome (STANDALONE in root.tsx).
  route("start", "pages/start.tsx", { id: "start" }),
  route("leaderboard", "pages/leaderboard.tsx", { id: "leaderboard" }),
  route("ctf", "pages/ctf.tsx", { id: "ctf" }),
  layout("layouts/UniversityLayout.tsx", [
    ...routeDefs.map((d) =>
      d.path === "/" ? index(d.module, { id: d.id }) : route(d.path, moduleFor(d.path, d.module), { id: d.id }),
    ),
    route("*", "pages/NotFoundPage.tsx", { id: "not-found" }),
  ]),
] satisfies RouteConfig;
