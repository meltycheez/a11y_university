import type { MetaFunction } from "react-router";
import { pageTitle } from "~/data/brand";
import { getEntry } from "./inventory";

/** Default `meta` for inventory pages: `export { inventoryMeta as meta } from "~/routes/meta";` */
export const inventoryMeta: MetaFunction = ({ location }) => [{ title: pageTitle(getEntry(location.pathname)?.title ?? "Page") }];
