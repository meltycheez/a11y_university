import type { Area, RuleKey } from "../rules";
import type { Category } from "../state";

/** What a registry file declares. Category, WCAG and detections default from the rule. */
export interface ScenarioDef {
  id: string;
  rule: RuleKey;
  title: string;
  description: string;
  fixDescription: string;
  /** Route paths or patterns ("/news/:slug"); "*" means every page with the university header and footer (not portal or lab). */
  pages: string[];
  component: string;
  mechanism: "markup" | "css" | "behavior" | "document";
  severity?: "minor" | "moderate" | "serious" | "critical";
  wcag?: string[];
  /** Coverage areas; defaults to the rule's. */
  areas?: Area[];
  detectedBy?: { wave?: string[]; axe?: string[]; manualOnly?: boolean };
}

export interface Scenario extends ScenarioDef {
  category: Category;
  wcag: string[];
  areas: Area[];
  detectedBy: { wave?: string[]; axe?: string[]; manualOnly?: boolean };
}
