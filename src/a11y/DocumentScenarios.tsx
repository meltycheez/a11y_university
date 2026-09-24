import { useEffect } from "react";
import { useScenario } from "./useScenario";

/**
 * <html lang> scenario. React renders <html> without lang on university pages; this sets or removes it.
 * No cleanup on unmount: root.tsx renders lang="en" itself on lab pages and this must not strip it.
 */
export function HtmlLang() {
  const fixed = useScenario("global-html-lang-001");
  useEffect(() => {
    if (fixed) document.documentElement.lang = "en";
    else document.documentElement.removeAttribute("lang");
  }, [fixed]);
  return null;
}

/** Page <title> scenario: an empty title while defective. React 19 hoists <title> into <head>. */
export function ScenarioTitle({ scenario, title }: { scenario: string; title: string }) {
  const fixed = useScenario(scenario);
  return <title>{fixed ? title : ""}</title>;
}
