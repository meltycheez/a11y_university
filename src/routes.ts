import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
import { routeDefs } from "./routes/inventory";

// Routes are generated from the inventory so paths, prerendering and breadcrumbs never drift apart.
export default [
  layout("layouts/UniversityLayout.tsx", [
    ...routeDefs.map((d) =>
      d.path === "/" ? index(d.module, { id: d.id }) : route(d.path, d.module, { id: d.id }),
    ),
    route("*", "pages/NotFoundPage.tsx", { id: "not-found" }),
  ]),
] satisfies RouteConfig;
