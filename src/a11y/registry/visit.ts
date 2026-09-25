import type { ScenarioDef } from "./types";

type Def = Omit<ScenarioDef, "pages" | "component"> & { severity: NonNullable<ScenarioDef["severity"]> };
const on = (pages: string[], component: string, defs: Def[]): ScenarioDef[] => defs.map((d) => ({ ...d, pages, component }));

// Visit scheduling on /admissions/visit (plan 06 #12: date picker, booking modal, toast). The rest of the page's
// scenarios are in admissions.ts.
export const visitScenarios: ScenarioDef[] = [
  ...on(["/admissions/visit"], "VisitScheduler", [
    { id: "visit-datepicker-grid-001", rule: "kbd-div-button", title: "Tour date calendar works by mouse only", description: "The tour calendar is a grid of clickable <div> days with <div> month arrows: nothing is focusable, the days have no names beyond a number, and the chosen day is shown only by its fill color.", fixDescription: "Uses a labeled native date input limited to the bookable range.", mechanism: "behavior", severity: "serious" },
    { id: "visit-time-state-001", rule: "sr-visual-only-state", title: "Chosen tour time shown by color only", description: "The 10:00 a.m. and 2:00 p.m. time buttons show which one is chosen only by a filled background; they expose no pressed state.", fixDescription: "Adds aria-pressed to the time buttons.", mechanism: "markup", severity: "serious" },
    { id: "visit-modal-restore-001", rule: "focus-not-restored", title: "Focus is dropped after the booking dialog closes", description: "After confirming or closing the reservation dialog, focus lands on the page body instead of the \"Reserve this tour\" button, so keyboard users start over at the top.", fixDescription: "Returns focus to the button that opened the dialog.", mechanism: "behavior", severity: "serious" },
    { id: "visit-toast-001", rule: "sr-status-not-announced", title: "Booking confirmation toast vanishes silently", description: "The \"You're booked\" toast with the confirmation number shows for 3 seconds and disappears. It isn't a live region, so screen readers never announce it.", fixDescription: "The toast is a persistent role=\"status\" message with a Dismiss button.", mechanism: "behavior", severity: "moderate" },
    { id: "visit-name-placeholder-001", rule: "placeholder-as-label", title: "Visitor name field uses a placeholder as its label", description: "In the booking dialog, \"Visitor name\" is placeholder text inside the box; it disappears as you type and there is no label.", fixDescription: "Adds a visible \"Visitor name\" label.", mechanism: "markup", severity: "moderate" },
    { id: "visit-guests-select-001", rule: "select-missing-label", title: "Party size select has no label", description: "The \"How many in your group?\" text above the party size select is a <p>, so the select has no accessible name.", fixDescription: "Uses a <label for> on the select.", mechanism: "markup", severity: "critical" },
  ]),
];
