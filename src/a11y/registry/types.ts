import type { RuleKey } from "../rules";
import type { Category } from "../state";

/** What a registry file declares. Category, WCAG and detections default from the rule. */
export interface ScenarioDef {
  id: string;
  rule: RuleKey;
  title: string;
  description: string;
  fixDescription: string;
  /** Route paths or patterns ("/news/:slug"); "*" means every university page. */
  pages: string[];
  component: string;
  mechanism: "markup" | "css" | "behavior" | "document";
  severity?: "minor" | "moderate" | "serious" | "critical";
  wcag?: string[];
  detectedBy?: { wave?: string[]; axe?: string[]; manualOnly?: boolean };
}

export interface Scenario extends ScenarioDef {
  category: Category;
  wcag: string[];
  detectedBy: { wave?: string[]; axe?: string[]; manualOnly?: boolean };
}
