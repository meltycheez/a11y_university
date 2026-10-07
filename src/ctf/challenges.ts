// Plan 11: the assistive technology CTFs. One record per challenge; the widget list, the page banner, the run
// store and the leaderboard all read from here.
export type ChallengeId = "apply-sr" | "registration-voice" | "map-eyes";

export interface Challenge {
  id: ChallengeId;
  path: string;
  title: string;
  /** The assistive technology the challenge must be completed with. */
  at: string;
  atExamples: string[];
  basePoints: number;
  brief: string;
  /** What happens to the page when the run starts, shown in a warning box just above "Start the Challenge". */
  warning?: string;
  /** Label of the paid button that undoes `warning`'s effect, e.g. showing a faded-out form again. */
  reveal?: string;
  /** The task, step by step. What may and may not be used is in `allowed` / `notAllowed`. */
  instructions: string[];
  /** Shown as chips; `detail` appears when the player expands the rules. */
  allowed: Rule[];
  notAllowed: Rule[];
  hints: string[];
  /** Count mouse clicks inside <main> (informational "no mouse" badge). Off for eye tracking, which is a pointer. */
  trackMouse: boolean;
  /** Lazy ?raw imports for the source viewer: [label, loader]. */
  sources: [string, () => Promise<{ default: string }>][];
}

export interface Rule { label: string; detail: string }

// Same for every challenge.
const noDevTools: Rule = { label: "Source code", detail: "No browser developer tools, View Source or page inspection during a run. The challenge source viewer is hidden while a run is going; read it before you start or after you finish." };
const noHelp: Rule = { label: "Help from others", detail: "Play on your own. Someone may set up the assistive technology for you before you start, but not guide you during the run." };

export const challenges: Challenge[] = [
  {
    id: "apply-sr",
    path: "/admissions/apply",
    title: "Application for Admission",
    at: "Screen reader",
    atExamples: ["NVDA with Firefox or Chrome", "JAWS with Chrome", "VoiceOver with Safari", "TalkBack with Chrome"],
    basePoints: 500,
    brief: "Submit a complete application for admission to reveal the flag. Turn your monitor off, or look away, and use only your screen reader.",
    reveal: "Show the form",
    warning: "Once you start, the application form below fades out over 5 seconds and can't be seen, but your screen reader can still read and fill it in.",
    instructions: [
      "The form fades out over 5 seconds once you start, then focus moves to its first field: complete it with your screen reader.",
      "Fill in every required field on all three steps and submit the application.",
      "On the Academics and program step you also need your Application referral code. It is somewhere on that step.",
      "Submitting the application completes the challenge. Your flag is entered for you.",
      "Reloading the page ends the run and uses up the attempt.",
    ],
    allowed: [
      { label: "Screen reader", detail: "Any screen reader: NVDA, JAWS, Narrator, VoiceOver or TalkBack, with any of its own commands and settings." },
      { label: "Keyboard", detail: "Tab, Shift+Tab, the arrow keys, Enter, Space and your screen reader's keys, such as browse mode, headings and form field lists." },
      { label: "Screen reader tools", detail: "Built-in features like element lists, the rotor, image descriptions or OCR are fair game." },
    ],
    notAllowed: [
      { label: "Looking at the screen", detail: "Turn the monitor off, look away, or switch on your screen reader's screen curtain (NVDA: NVDA+Ctrl+Escape; VoiceOver: VO+Fn+Shift+Minus)." },
      { label: "Mouse or touchpad", detail: "No pointing and clicking. Screen reader commands that click for you are fine." },
      noDevTools,
      noHelp,
    ],
    hints: [
      "Some fields are not in the order you expect, and some labels belong to the field next to them. Check what each field is called before you type, and read the text around it in browse mode.",
      "The referral code image's alternative text is a file name. Listen to the full name of the Application referral code field: it tells you what to type.",
      "The Next button has no name; it is the last button on each step. The first-choice major list opens when you activate its current value (\"Choose a major\") in browse mode, and the certify checkbox on the last step is hidden from your screen reader but still reachable with Tab.",
    ],
    trackMouse: true,
    sources: [
      ["Page: src/pages/admissions/apply.tsx", () => import("~/pages/admissions/apply.tsx?raw")],
      ["Scenarios: src/a11y/registry/apply.ts", () => import("~/a11y/registry/apply.ts?raw")],
    ],
  },
  {
    id: "registration-voice",
    path: "/portal/registration",
    title: "Class Registration",
    at: "Voice control",
    atExamples: ["Voice Control (macOS or iOS)", "Dragon Professional", "Windows Voice Access", "Android Voice Access"],
    basePoints: 500,
    brief: "Register for three classes in a set priority order to reveal the flag. Keep your hands off the keyboard and mouse: speak every action.",
    instructions: [
      "Add CHEM 101-02, MATH 101-02, and ENGL 111-01 to your cart.",
      "Order the cart by priority: MATH 101-02 first, then CHEM 101-02, then ENGL 111-01.",
      "Register. If the classes and their order are right, the challenge completes and your flag is entered for you.",
      "Reloading the page ends the run and uses up the attempt.",
    ],
    allowed: [
      { label: "Voice commands", detail: "Voice Control, Dragon, Windows Voice Access or Android Voice Access, with any of their commands." },
      { label: "Numbers and grids", detail: "\"Show numbers\", \"Show names\", \"Show grid\" and MouseGrid are all fine, including grid-based clicks and drags." },
      { label: "Dictation", detail: "Dictate anything you need to type, such as a CRN or a search." },
    ],
    notAllowed: [
      { label: "Keyboard", detail: "Hands off the keyboard: no typing, Tab or Enter. Spoken key commands (\"Press Tab\") are fine." },
      { label: "Mouse, touchpad or touch", detail: "No pointing, clicking, dragging or tapping by hand. Spoken mouse commands are fine." },
      noDevTools,
      noHelp,
    ],
    hints: [
      "Saying the word you see on a button doesn't always work: the buttons' spoken names differ from their visible text. Try \"Show numbers\" (or \"Show names\") to see what each control is really called.",
      "There is no button to reorder the cart. You have to drag: use \"Show grid\" / MouseGrid to place the pointer on a row's handle, then \"Drag that\" (Dragon) or \"Drag from … to …\" (Voice Control).",
      "When a time conflict warning appears, its confirm button has no name at all. Use numbers or the grid to click it.",
    ],
    trackMouse: true,
    sources: [
      ["Page: src/pages/portal/registration.tsx", () => import("~/pages/portal/registration.tsx?raw")],
      ["Scenarios: src/a11y/registry/registration.ts", () => import("~/a11y/registry/registration.ts?raw")],
    ],
  },
  {
    id: "map-eyes",
    path: "/campus-map",
    title: "Campus Map",
    at: "Eye tracking",
    atExamples: ["Windows Eye Control", "Tobii Dynavox / Tobii Experience", "iOS or iPadOS Eye Tracking", "A head mouse with dwell click"],
    basePoints: 500,
    brief: "Find Hawthorne Observatory on the campus map and check in with its after-hours code to reveal the flag. Point and click with your eyes only.",
    instructions: [
      "Hawthorne Observatory is on the map, but not where the map first opens. Pan the map to find it.",
      "Dwell on the observatory to see its details, including its after-hours access code.",
      "Type the code into the Observatory check-in box below the map and submit it. That completes the challenge and enters your flag for you.",
      "Reloading the page ends the run and uses up the attempt.",
    ],
    allowed: [
      { label: "Gaze and dwell", detail: "Point with your eyes (or a head mouse) and click by dwelling or with your tracker's switch." },
      { label: "Tracker tools", detail: "Your eye tracking software's precise click, zoom, drag and scroll tools." },
      { label: "On-screen keyboard", detail: "Type with an on-screen keyboard you operate by gaze." },
    ],
    notAllowed: [
      { label: "Physical mouse or touch", detail: "No hand-held mouse, touchpad or touchscreen." },
      { label: "Physical keyboard", detail: "No keys at all, including the arrow keys to pan the map." },
      { label: "Voice control", detail: "No speech commands or dictation: this one is eyes only." },
      noDevTools,
      noHelp,
    ],
    hints: [
      "The map only pans by dragging. Use your eye tracker's drag action (in Windows Eye Control: the drag tool on the launchpad) and drag the map to the left and up.",
      "The observatory's details appear in a tooltip that closes quickly and also closes if your gaze drifts. Keep your gaze still and read it in one go, or dwell again.",
      "The \"Are you still there?\" prompt has a tiny Continue button in its bottom corner. Use your tracker's precise or zoomed click to hit it before the time runs out.",
    ],
    trackMouse: false,
    sources: [
      ["Page: src/pages/campus-map.tsx", () => import("~/pages/campus-map.tsx?raw")],
      ["Scenarios: src/a11y/registry/campus-map.ts", () => import("~/a11y/registry/campus-map.ts?raw")],
    ],
  },
];

export const challengeById = new Map(challenges.map((c) => [c.id, c]));
export const challengeForPath = (path: string) => challenges.find((c) => c.path === path);
