// Plan 11: the assistive technology CTFs. One record per challenge; the widget list, the page banner, the run
// store and the leaderboard all read from here.
export type ChallengeId = "reqinfo-sr" | "registration-voice" | "map-eyes" | "apply-sr";

export interface Challenge {
  id: ChallengeId;
  path: string;
  title: string;
  /** The assistive technology the challenge must be completed with. */
  at: string;
  basePoints: number;
  /** The time bonus falls from 100 to 0 over this many minutes: 5 for booth challenges, longer for harder ones. */
  timeLimitMin: number;
  /** An advanced version of this challenge, linked from its bar and its results. */
  harder?: ChallengeId;
  /** An advanced challenge: its own leaderboard, left out of the overall total. */
  advanced?: boolean;
  /** One plain sentence: what to do, with what, when it's done and how long it takes. Shown before the run starts. */
  brief: string;
  /** The task in one line, shown in the bar during a run. */
  task: string;
  /** The pinned side panel's list during a run: the task in detail and anything to know. */
  panelNotes: string[];
  /** The side panel's numbered "Your task" steps, for a challenge that lists them (plan 14 §5f). */
  panelSteps?: string[];
  /** Collapsible term / description groups in the side panel, after the task; `open` ones start expanded. */
  panelSections?: { title: string; open?: boolean; note?: string; rows: [string, string][] }[];
  /** What the side panel holds, for "Before you start": e.g. "Your task and the head pointer actions". */
  panelLabel?: string;
  /** First "Before you start" bullet: what happens to the page when the run starts, if anything. */
  beforeStart?: string;
  /** Label of the paid button that shows a faded-out page again. */
  reveal?: string;
  /** Shown as chips; `detail` appears when the player expands the rules. */
  allowed: Rule[];
  notAllowed: Rule[];
  hints: string[];
  /** Heading of the setup section, e.g. "Set up your screen reader". */
  setupTitle: string;
  /** Suggested settings, commands and help, for anyone playing outside a staffed event. */
  setup: SetupSection[];
  /** A second, collapsed reference section after setup, e.g. the head pointer actions table. */
  moreSetup?: { title: string; sections: SetupSection[] };
  /** Count mouse clicks inside <main> (informational "no mouse" badge). Off for head pointer, which is a pointer. */
  trackMouse: boolean;
  /** Lazy ?raw imports for the source viewer: [label, loader]. */
  sources: [string, () => Promise<{ default: string }>][];
}

export interface Rule { label: string; detail: string }
/** One setup group: a paragraph (`text`), a list (`items`), a two-column table (`columns` and `rows`) and/or links. */
export interface SetupSection {
  heading?: string; text?: string; items?: string[]; columns?: [string, string]; rows?: [string, string][];
  /** Show `items` as numbered steps. */
  ordered?: boolean;
  /** Open in a new tab; `note` follows the link, e.g. "(YouTube)". */
  links?: { label: string; href: string; note?: string }[];
}

// Suggested facial expressions for Head Pointer's Alternate pointer actions: the setup table and the side panel.
const headActions: [string, string][] = [
  ["Left click", "Raise your eyebrows."],
  ["Drag and drop", "Stick out your tongue to grab, then move your head to move what you're selecting in that direction."],
  ["Scroll", "Point at the scroll bar, stick out your tongue, move your head, then stick out your tongue again."],
  ["Recalibrate", "Smile."],
];

// Same for every challenge.
const noDevTools: Rule = { label: "Source code", detail: "No browser developer tools, View Source or page inspection during a run. The challenge source viewer is hidden while a run is going; read it before you start or after you finish." };
const noHelp: Rule = { label: "Help from others", detail: "Play on your own. Someone may set up the assistive technology for you before you start, but not guide you during the run." };

// The two screen reader challenges share their rules and setup advice.
const srAllowed: Rule[] = [
      { label: "Screen reader", detail: "Any screen reader: NVDA, JAWS, Narrator, VoiceOver or TalkBack, with any of its own commands and settings." },
      { label: "Keyboard", detail: "Tab, Shift+Tab, the arrow keys, Enter, Space and your screen reader's keys, such as browse mode, headings and form field lists." },
      { label: "Screen reader tools", detail: "Built-in features like element lists, the rotor, image descriptions or OCR are fair game." },
];
const srNotAllowed: Rule[] = [
      { label: "Looking at the screen", detail: "Turn the monitor off, look away, or switch on your screen reader's screen curtain (NVDA: NVDA+Ctrl+Escape; VoiceOver: VO+Fn+Shift+Minus)." },
      { label: "Mouse or touchpad", detail: "No pointing and clicking. Screen reader commands that click for you are fine." },
      noDevTools,
      noHelp,
];
const srSetup: SetupSection[] = [
  { text: "Turn on your screen reader before you start. These screen reader and browser pairs work well: NVDA with Firefox or Chrome, JAWS with Chrome, VoiceOver with Safari, or TalkBack with Chrome." },
  { text: "New to screen readers? Watch one of our videos first:", links: [
    { label: "Getting started with NVDA screen reader for Windows", href: "https://www.youtube.com/watch?v=h09RaEsRn6Q", note: "(YouTube)" },
    { label: "Getting started with Mac's VoiceOver screen reader", href: "https://www.youtube.com/watch?v=_eLUi_-jDQc", note: "(YouTube)" },
  ] },
];
const srBeforeStart = "The form fades out over 5 seconds. Your screen reader can still read it and fill it in.";
const srHidden = "The form is hidden, but your screen reader can still read it and fill it in. Focus starts on the first field.";

/** The three booth challenges, a few minutes each: these make up the overall leaderboard. */
export const challenges: Challenge[] = [
  {
    id: "reqinfo-sr",
    path: "/admissions/request-info",
    title: "Request Information",
    at: "Screen reader",
    basePoints: 500,
    timeLimitMin: 5,
    harder: "apply-sr",
    brief: "Use only your screen reader to fill out and send the Request Information form. The challenge is complete when the form sends successfully. It takes about 5 minutes.",
    task: "Fill in your name and email, answer the three questions (any answer), then select Send me information.",
    panelNotes: [srHidden, "Fill in your first name, last name and email. Answer the three questions: any answer is fine, but none can be left unselected. Then select Send me information."],
    beforeStart: srBeforeStart,
    reveal: "Show the form",
    allowed: srAllowed,
    notAllowed: srNotAllowed,
    hints: [
      "Tab doesn't follow the page: from First name it jumps to Email, then back to Last name, and it skips the I am a buttons. Use browse mode (the arrow keys) to move through the form in reading order instead.",
      "The name fields have no labels, only placeholder text, and Email's label isn't connected to its field. Listen to the text just before each field in browse mode to know which one you're in.",
      "The I am a choices and the start term list have no labels of their own: the question is the line of text just before them. Arrow down past I am a to reach its choices, and find the list just after When do you plan to start. Each list starts on Select one: pick something else.",
    ],
    setupTitle: "Set up your screen reader",
    setup: srSetup,
    trackMouse: true,
    sources: [
      ["Page: src/pages/admissions/request-info.tsx", () => import("~/pages/admissions/request-info.tsx?raw")],
      ["Scenarios: src/a11y/registry/admissions.ts", () => import("~/a11y/registry/admissions.ts?raw")],
    ],
  },
  {
    id: "registration-voice",
    path: "/portal/registration",
    title: "Class Registration",
    at: "Voice control",
    basePoints: 500,
    timeLimitMin: 5,
    brief: "Use only your voice to add two classes to your cart, put them in priority order and register. The challenge is complete when both classes register. It takes about 5 minutes.",
    task: "Add ENGL 111-01 (CRN 43099), then MATH 101-02 (CRN 44458). Put MATH first, then register.",
    panelNotes: ["Add ENGL 111-01 (CRN 43099) first, then MATH 101-02 (CRN 44458). Then reorder the cart so MATH is first, and register. Adding them in the final order won't count.", "Hands off the keyboard and mouse: say every action. \"Show numbers\" and \"Show grid\" help when a name doesn't work."],
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
      "There is no button to reorder the cart. You have to drag: use \"Show grid\" / MouseGrid to place the pointer on a row's handle, then \"Drag that\" (Dragon) or \"Drag from … to …\" (Voice Control). Or remove ENGL 111-01 and add it back, so it drops below MATH 101-02.",
      "When a time conflict warning appears, its confirm button has no name at all. Use numbers or the grid to click it.",
    ],
    setupTitle: "Set up voice control",
    setup: [
      { heading: "Getting started", columns: ["Task", "Voice Control (Mac) / Voice Access (Windows)"], rows: [
        ["Turn it on", "Mac: System Settings → Accessibility → Voice Control. Windows 11: Settings → Accessibility → Speech → Voice Access."],
        ["Stop listening", "\"Go to sleep\" / \"Voice access sleep\""],
        ["Start listening", "\"Wake up\" / \"Voice access wake up\""],
        ["See available commands", "\"Show commands\" / \"What can I say\""],
      ] },
      { heading: "Navigation and clicking", columns: ["Say", "What it does"], rows: [
        ["\"Show names\"", "Labels clickable items with their names (Voice Control only)."],
        ["\"Show numbers\"", "Puts a number on each clickable item. Then say \"Click 5\" to select one."],
        ["\"Show grid\"", "Overlays a numbered grid for areas without labels. Say a number to zoom in, then \"Click\"."],
        ["\"Hide numbers\" / \"Hide grid\"", "Removes the overlay."],
        ["\"Click [name]\"", "Clicks an item by its label, e.g. \"Click Register\". Voice Control needs an exact match."],
        ["\"Scroll up\" / \"Scroll down\"", "Scrolls the page."],
        ["\"Press [key]\"", "Presses a key, e.g. \"Press Tab\" or \"Press Escape\"."],
      ] },
      { heading: "Dictation", columns: ["Say", "What it does"], rows: [
        ["\"Select [word or phrase]\"", "Selects that text."],
        ["\"Delete that\"", "Deletes the last dictated text or selection."],
        ["\"Undo that\"", "Undoes the last action."],
        ["Example", "Click the CRN field, say the digits, then click Add."],
      ] },
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
    at: "Head pointer for Mac",
    basePoints: 500,
    timeLimitMin: 5,
    brief: "Use only Head Pointer to find Hawthorne Observatory on the campus map and check in with its after-hours code. The challenge is complete when you check in. It takes about 5 minutes.",
    task: "Find Hawthorne Observatory (search for OBS), then type its after-hours code into the check-in box below the map.",
    panelNotes: [],
    panelSteps: ["Find Hawthorne Observatory on the campus map.", "Enter the after-hours code in the Check in text field."],
    panelSections: [
      { title: "Head pointer actions", open: true, rows: headActions,
        note: "These only work after you turn on Alternate pointer actions and assign each one in Pointer Control (see Setup reminders below). These are suggestions, so you can pick other expressions." },
      { title: "Setup reminders", rows: [
        ["Change your actions", "System Settings → Accessibility → Pointer Control → Alternate pointer actions."],
        ["Type with the on-screen keyboard", "System Settings → Accessibility → Keyboard → turn on Accessibility Keyboard."],
      ] },
    ],
    panelLabel: "Your task and the head pointer actions",
    allowed: [
      { label: "Head or gaze pointing", detail: "Point with Head Pointer (or an eye tracker) and click with a facial expression, dwell or your tracker's switch." },
      { label: "Pointer tools", detail: "Your pointer software's click, drag and scroll actions, such as Alternate pointer actions on a Mac or the Windows Eye Control launchpad." },
      { label: "On-screen keyboard", detail: "Type with an on-screen keyboard, such as the Mac Accessibility Keyboard." },
    ],
    notAllowed: [
      { label: "Physical mouse or touch", detail: "No hand-held mouse, touchpad or touchscreen." },
      { label: "Physical keyboard", detail: "No keys at all, including the arrow keys to pan the map." },
      { label: "Voice control", detail: "No speech commands or dictation: this one is pointer only." },
      noDevTools,
      noHelp,
    ],
    hints: [
      "You don't have to pan: select the building search, type OBS with the on-screen keyboard, and select the search button. If you do pan, the map only moves by dragging (on a Mac: your drag-and-drop expression), toward the top left.",
      "Once the observatory is selected, its details open in the panel next to the map, with the after-hours code under Hours. Pointing at it on the map shows the code in a tooltip too, but that closes if the pointer drifts.",
      "The check-in box is below the map. To scroll, point at the scroll bar, use your drag-and-drop expression, move your head down, and use it again to let go.",
    ],
    setupTitle: "Set up Head Pointer on Mac",
    setup: [
      { ordered: true, items: [
        "Go to System Settings → Accessibility → Pointer Control and turn on Head pointer.",
        "In Head pointer options, set Pointer moves to \"When facing screen edges\", Pointer speed to 70 and Distance to edge to 15.",
        "Go to Accessibility → Keyboard and turn on Accessibility Keyboard, so you can type.",
        "In Pointer Control, turn on Alternate pointer actions and assign a facial expression to each action. Suggested expressions are in \"Head pointer actions for this challenge\" below.",
      ] },
      { text: "Using Windows? Use Eye Control or Tobii, with the launchpad's click, drag and scroll tools.", links: [
        { label: "Microsoft: Eye control basics in Windows", href: "https://support.microsoft.com/en-US/accessibility/windows/eye-control/eye-control-basics-in-windows" },
        { label: "Apple: Change Pointer Control settings for accessibility on Mac", href: "https://support.apple.com/guide/mac-help/change-pointer-control-settings-accessibility-unac899/mac" },
      ] },
    ],
    moreSetup: { title: "Head pointer actions for this challenge", sections: [
      { text: "These are suggested facial expressions for Alternate pointer actions on Mac. You can assign different ones in Pointer Control.", columns: ["Action", "Facial expression"], rows: headActions },
    ] },
    trackMouse: false,
    sources: [
      ["Page: src/pages/campus-map.tsx", () => import("~/pages/campus-map.tsx?raw")],
      ["Scenarios: src/a11y/registry/campus-map.ts", () => import("~/a11y/registry/campus-map.ts?raw")],
    ],
  },
];

/** Advanced versions for players' own time, linked from their booth challenge (`harder`). Own leaderboard, not in the overall total. */
export const harderChallenges: Challenge[] = [
  {
    id: "apply-sr",
    path: "/admissions/apply",
    title: "Application for Admission",
    at: "Screen reader",
    basePoints: 500,
    timeLimitMin: 20,
    advanced: true,
    brief: "Use only your screen reader to fill out and submit the two-step Application for Admission. The challenge is complete when your application is submitted.",
    task: "Fill out and submit both steps of the application with your screen reader.",
    panelNotes: [srHidden, "The application has two steps. On the Program and submit step, you also need your Application referral code. It is somewhere on that step."],
    beforeStart: srBeforeStart,
    reveal: "Show the form",
    allowed: srAllowed,
    notAllowed: srNotAllowed,
    hints: [
      "Some fields are not in the order you expect, and some labels belong to the field next to them. Check what each field is called before you type, and read the text around it in browse mode.",
      "The referral code image's alternative text is a file name. Listen to the full name of the Application referral code field: it tells you what to type.",
      "The Next button has no name; it is the last button on each step. The first-choice major list opens when you activate its current value (\"Choose a major\") in browse mode, and the certify checkbox on step 2 is hidden from your screen reader but still reachable with Tab.",
    ],
    setupTitle: "Set up your screen reader",
    setup: srSetup,
    trackMouse: true,
    sources: [
      ["Page: src/pages/admissions/apply.tsx", () => import("~/pages/admissions/apply.tsx?raw")],
      ["Scenarios: src/a11y/registry/apply.ts", () => import("~/a11y/registry/apply.ts?raw")],
    ],
  },
];

export const allChallenges = [...challenges, ...harderChallenges];

export const challengeById = new Map(allChallenges.map((c) => [c.id, c]));
export const challengeForPath = (path: string) => allChallenges.find((c) => c.path === path);
