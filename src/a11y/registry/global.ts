import type { ScenarioDef } from "./types";

// Site-wide chrome and document-level scenarios.
export const globalScenarios: ScenarioDef[] = [
  {
    id: "global-html-lang-001",
    rule: "html-lang-missing",
    title: "Page language not set",
    description: "The <html> element has no lang attribute, so screen readers guess the pronunciation language.",
    fixDescription: "Sets lang=\"en\" on <html>.",
    pages: ["*"],
    component: "HtmlLang",
    mechanism: "document",
    severity: "serious",
  },
  {
    id: "nav-megamenu-hover-001",
    rule: "kbd-hover-only-menu",
    title: "Mega menu opens on hover only",
    description: "Main navigation panels open on mouse hover. Keyboard and touch users can reach the top-level links but never the panel links.",
    fixDescription: "Replaces the hover menu with disclosure buttons that open on Enter/Space, close on Escape, and return focus.",
    pages: ["*"],
    component: "MegaMenu",
    mechanism: "behavior",
    severity: "serious",
  },
];
