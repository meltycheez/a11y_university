import { useLocation } from "react-router";
import { normalizePath } from "./inventory";

/**
 * Current pathname without a trailing slash. Pre-rendering requests every path with a trailing slash
 * ("/about/") while browsers may load "/about", so anything that renders from the pathname must use
 * this hook to keep pre-rendered HTML and hydrated output identical.
 */
export function usePathname(): string {
  return normalizePath(useLocation().pathname);
}
