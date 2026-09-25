import type { RuleKey } from "../rules";
import type { ScenarioDef } from "./types";

type Mech = ScenarioDef["mechanism"];
type Sev = NonNullable<ScenarioDef["severity"]>;
const d = (id: string, rule: RuleKey, mechanism: Mech, severity: Sev, title: string, description: string, fixDescription: string): ScenarioDef =>
  ({ id, rule, pages: ["/accessibility-lab/manual"], component: "ManualLab", mechanism, severity, title, description, fixDescription });

// Manual Testing Specimens (plan 08): contrast, color-only, motion, reflow, and text-in-image.
export const labManualScenarios: ScenarioDef[] = [
  d("contrast-text-low-manual-lab", "contrast-text-low", "css", "serious",
    "Body text has low contrast", "This paragraph is set in light gray (#9a9a92) on white, about 2.5:1 — below the 4.5:1 minimum for body text.", "Uses a dark, near-black text color, about 16:1."),
  d("contrast-ui-low-manual-lab", "contrast-ui-low", "css", "serious",
    "Button border has low contrast", "This button's visible border is a very light gray (#d8d8d2) on white, about 1.2:1 — below the 3:1 minimum for UI components.", "Uses a dark border, about 8:1."),
  d("color-only-info-manual-lab", "color-only-info", "markup", "serious",
    "Scholarship status shown only by color", "\"Renewable\" scholarships are marked only with a green dot plus a color-key legend; the word itself never appears in the row.", "Adds the word \"Renewable\" to the row text and removes the color legend."),
  d("color-only-error-manual-lab", "color-only-error", "markup", "serious",
    "Form error shown only by a red border", "An invalid row is marked only with a red left border — no icon, no text saying what's wrong.", "Adds visible \"Error: \" text to the row."),
  d("motion-autorotate-no-pause-manual-lab", "motion-autorotate-no-pause", "behavior", "moderate",
    "Auto-advancing ticker has no pause control", "A small news ticker advances to the next item every 2 seconds on a timer, with no way to stop it.", "Adds a working Pause/Play button that stops and resumes the timer."),
  d("motion-animated-announcement-manual-lab", "motion-animated-announcement", "css", "moderate",
    "Status banner scrolls as a marquee", "A status message slides continuously across its banner as a CSS animation, making it hard to read.", "Removes the motion; the same message sits still."),
  d("motion-ignores-reduced-motion-manual-lab", "motion-ignores-reduced-motion", "css", "moderate",
    "Slide-in animation ignores reduced motion", "A card animates in with a CSS slide/fade transition regardless of the operating system's reduced-motion setting.", "Only animates inside @media (prefers-reduced-motion: no-preference), so it's skipped when the user has reduced motion on."),
  d("reflow-overflow-200-manual-lab", "reflow-overflow-200", "css", "serious",
    "Card text is clipped at larger zoom", "A card has a fixed height with overflow: hidden, so at 200% zoom its text is cut off.", "Removes the fixed height so the card grows with its content."),
  d("reflow-horizontal-scroll-manual-lab", "reflow-horizontal-scroll", "css", "serious",
    "Fixed-width element forces page scrolling", "An element has min-width: 50rem inside a narrow container, so at 320px the whole page scrolls sideways.", "Lets the element shrink and scroll inside its own container instead."),
  d("reflow-clipped-text-manual-lab", "reflow-clipped-text", "css", "moderate",
    "Badge text is clipped at larger text sizes", "A status badge has a fixed height and overflow: hidden, so increasing the browser's default text size clips its label.", "Uses min-height so the badge grows with its text."),
  d("reflow-fixed-dimensions-manual-lab", "reflow-fixed-dimensions", "css", "moderate",
    "Card overflows its border at 200% zoom", "A card is sized with a fixed pixel width and height; at 200% zoom its text overlaps the border.", "Uses relative units (rem/%) and min-height instead of a fixed box."),
  d("text-spacing-breaks-manual-lab", "text-spacing-breaks", "css", "moderate",
    "Tight line height clips text under user spacing", "A paragraph forces a tight line-height with overflow: hidden, so a user stylesheet that increases line height or letter spacing clips its lines.", "Removes the override so user-applied text spacing (WCAG 1.4.12) never clips content."),
  d("text-in-image-manual-lab", "text-in-image", "markup", "moderate",
    "Promotional message is baked into an image", "A promotional graphic reads \"50% off — apply by June 1\" as pixels in the image; the alt text only describes the picture, not the offer.", "Replaces the message with real, resizable HTML text next to a purely decorative image (alt=\"\")."),
];
