import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id, rule, pages: ["/accessibility-lab/keyboard"], component: "KeyboardLab", mechanism, severity, title, description, fixDescription });

export const labKeyboardScenarios: ScenarioDef[] = [
  d("dropdown-keyboard-lab", "kbd-dropdown-inoperable", "behavior", "serious",
    "Contact method picker is a mouse-only dropdown",
    "The \"Preferred contact method\" control is a styled div that opens a list of clickable divs. Nothing in it is focusable, so it cannot be operated from a keyboard.",
    "Uses a labeled native <select>, focusable and operable with the keyboard."),
  d("menu-keyboard-lab", "kbd-hover-only-menu", "behavior", "serious",
    "Resources menu opens on hover only",
    "The \"Resources\" menu reveals its list with a CSS :hover rule and no :focus-within fallback, so there is no way to reach it from a keyboard.",
    "Replaces the hover trigger with a disclosure button (aria-expanded) that opens and closes on click."),
  d("tabs-keyboard-lab", "kbd-tabs-wrong-keys", "behavior", "serious",
    "Sample tabs ignore arrow keys",
    "The tabs have correct roles, but the arrow keys, Home and End do nothing, and only the active tab sits in the Tab order.",
    "Adds arrow key, Home and End handling and a roving tabindex."),
  d("modal-keyboard-lab", "kbd-focus-trap-bad", "behavior", "serious",
    "Sample dialog does not trap focus",
    "The dialog opens non-modally, so Tab walks focus out into the page behind it instead of staying inside the dialog.",
    "Opens the dialog modally (native <dialog>.showModal()), trapping focus until it closes."),
  d("drag-drop-keyboard-lab", "kbd-drag-no-alternative", "behavior", "serious",
    "Reading list can only be reordered by dragging",
    "The reading list can only be reordered with mouse drag-and-drop. There is no keyboard way to move an item.",
    "Adds Move up / Move down buttons for each item as a keyboard alternative."),
  d("carousel-keyboard-lab", "kbd-carousel-unreachable", "markup", "serious",
    "Carousel arrows are unreachable divs",
    "The previous/next arrows are plain <div> elements with a click handler: not focusable, not buttons, and unreachable from a keyboard.",
    "Uses real <button> elements for the arrows."),
  d("positive-tabindex-keyboard-lab", "focus-positive-tabindex", "markup", "moderate",
    "A positive tabindex breaks the visual tab order",
    "Field B has tabindex=\"1\", so Tab visits B before A, out of visual reading order.",
    "Removes the positive tabindex so the natural DOM order applies."),
];
