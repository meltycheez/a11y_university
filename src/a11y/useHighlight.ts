import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * `?highlight=<scenario-id>` outlines the first `[data-a11y-scenario]` match and scrolls it into view.
 * Presentation only (a CSS class): doesn't persist and doesn't change accessibility semantics.
 */
export function useHighlight() {
  const { search } = useLocation();

  useEffect(() => {
    const id = new URLSearchParams(search).get("highlight");
    if (!id) return;
    const el = document.querySelector(`[data-a11y-scenario="${CSS.escape(id)}"]`);
    if (!el) return;
    el.classList.add("a11y-highlight");
    el.scrollIntoView({ block: "center" });
    return () => el.classList.remove("a11y-highlight");
  }, [search]);
}
