// Plan 11: the assistive technology CTFs. One record per challenge; the widget list, the page banner, the run
// store and the leaderboard all read from here.
export type ChallengeId = "reqinfo-sr" | "registration-voice" | "map-eyes" | "apply-sr";

export interface Challenge {
  id: ChallengeId;
  path: string;
  title: string;
  /** The assistive technology the challenge must be completed with. */
  at: string;
  atExamples: string[];
  basePoints: number;
  /** The time bonus falls from 100 to 0 over this many minutes: 5 for booth challenges, longer for harder ones. */
  timeLimitMin: number;
  /** A harder version of this challenge, linked from its bar and its congratulations. */
  harder?: ChallengeId;
  /** A harder challenge: its own leaderboard, left out of the overall total. */
  advanced?: boolean;
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
  /** "Set up your assistive technology": suggested settings and commands, for anyone playing outside a staffed event. */
  setup: SetupSection[];
  /** Count mouse clicks inside <main> (informational "no mouse" badge). Off for head pointer, which is a pointer. */
  trackMouse: boolean;
  /** Lazy ?raw imports for the source viewer: [label, loader]. */
  sources: [string, () => Promise<{ default: string }>][];
}

export interface Rule { label: string; detail: string }
/** One setup group: a list (`items`), or a two-column table (`columns` and `rows`). */
export interface SetupSection { heading: string; items?: string[]; columns?: [string, string]; rows?: [string, string][]; link?: { label: string; href: string } }

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
      { heading: "Screen readers", items: [
        "NVDA (free, Windows) with Firefox or Chrome: use browse mode, H for headings, F for form fields, and Tab.",
        "JAWS with Chrome.",
        "VoiceOver on a Mac (Cmd+F5) with Safari: use the rotor (VO+U).",
        "Turn the screen off, look away, or turn on the screen curtain (NVDA+Ctrl+Escape; VoiceOver: VO+Fn+Shift+Minus).",
      ] },
];

/** The three booth challenges, a few minutes each: these make up the overall leaderboard. */
export const challenges: Challenge[] = [
  {
    id: "reqinfo-sr",
    path: "/admissions/request-info",
    title: "Request Information",
    at: "Screen reader",
    atExamples: ["NVDA with Firefox or Chrome", "JAWS with Chrome", "VoiceOver with Safari", "TalkBack with Chrome"],
    basePoints: 500,
    timeLimitMin: 5,
    harder: "apply-sr",
    brief: "Fill in and send the Request Information form to reveal the flag. Turn your monitor off, or look away, and use only your screen reader. It takes a few minutes.",
    reveal: "Show the form",
    warning: "Once you start, the form below fades out over 5 seconds and can't be seen, but your screen reader can still read and fill it in.",
    instructions: [
      "The form fades out over 5 seconds once you start, then focus moves to its first field: complete it with your screen reader.",
      "Fill in your first name, last name and email.",
      "Answer I am a, When do you plan to start and Area of interest. Any answer is fine, but each one starts unselected and can't be left that way.",
      "Select Send me information. If everything is filled in, the challenge completes and your flag is entered for you.",
      "Reloading the page ends the run and uses up the attempt.",
    ],
    allowed: srAllowed,
    notAllowed: srNotAllowed,
    hints: [
      "Tab doesn't follow the page: from First name it jumps to Email, then back to Last name, and it skips the I am a buttons. Use browse mode (the arrow keys) to move through the form in reading order instead.",
      "The name fields have no labels, only placeholder text, and Email's label isn't connected to its field. Listen to the text just before each field in browse mode to know which one you're in.",
      "The I am a choices and the start term list have no labels of their own: the question is the line of text just before them. Arrow down past I am a to reach its choices, and find the list just after When do you plan to start. Each list starts on Select one: pick something else.",
    ],
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
    atExamples: ["Voice Control (macOS or iOS)", "Dragon Professional", "Windows Voice Access", "Android Voice Access"],
    basePoints: 500,
    timeLimitMin: 5,
    brief: "Register for two classes in a set priority order to reveal the flag. Keep your hands off the keyboard and mouse: speak every action.",
    instructions: [
      "Add two classes to your cart in this order: first ENGL 111 section 01 (CRN 43099), then MATH 101 section 02 (CRN 44458). Each course has several sections; you need exactly these. Search for them, or add them by CRN.",
      "Then put the cart in priority order: MATH 101-02 first, then ENGL 111-01.",
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
      "There is no button to reorder the cart. You have to drag: use \"Show grid\" / MouseGrid to place the pointer on a row's handle, then \"Drag that\" (Dragon) or \"Drag from … to …\" (Voice Control). Or remove ENGL 111-01 and add it back, so it drops below MATH 101-02.",
      "When a time conflict warning appears, its confirm button has no name at all. Use numbers or the grid to click it.",
    ],
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
    atExamples: ["Head Pointer for Mac", "Windows Eye Control", "Tobii Dynavox / Tobii Experience", "iOS or iPadOS Eye Tracking"],
    basePoints: 500,
    timeLimitMin: 5,
    brief: "Find Hawthorne Observatory on the campus map and check in with its after-hours code to reveal the flag. Point and click with Head Pointer for Mac (or an eye tracker) only.",
    instructions: [
      "Head Pointer gestures: raise your eyebrows to click, stick out your tongue to drag and drop (to scroll, point at the scroll bar, stick out your tongue, move your head, then stick it out again), and smile to recalibrate.",
      "Find Hawthorne Observatory. It isn't where the map first opens: search for it by name or by its code (OBS, listed in the building directory below the map), or pan the map to it.",
      "Select the observatory to see its details, including its after-hours access code.",
      "Type the code into the Observatory check-in box below the map and submit it. That completes the challenge and enters your flag for you.",
      "Reloading the page ends the run and uses up the attempt.",
    ],
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
    setup: [
      { heading: "Turn on Head Pointer (Mac)", items: [
        "System Settings → Accessibility → Pointer Control → turn on Head pointer.",
        "Head pointer options: Pointer moves \"When facing screen edges\", Pointer speed 70, Distance to edge 15.",
        "Accessibility → Keyboard → turn on Accessibility Keyboard, for typing.",
      ] },
      { heading: "Alternate pointer actions (Mac)", items: [
        "Pointer Control → turn on Alternate pointer actions and assign a facial expression to each action.",
        "Left click: raise eyebrows.",
        "Drag and drop: stick out tongue (once to grab, again to drop).",
        "Recalibrate: smile.",
        "To scroll: point at the scroll bar, stick out your tongue, move your head, then stick it out again.",
      ] },
      { heading: "More help", items: [
        "Windows Eye Control or Tobii: use the launchpad's click, drag and scroll tools.",
      ], link: { label: "Apple: Change Pointer Control settings for accessibility on Mac", href: "https://support.apple.com/guide/mac-help/change-pointer-control-settings-accessibility-unac899/mac" } },
    ],
    trackMouse: false,
    sources: [
      ["Page: src/pages/campus-map.tsx", () => import("~/pages/campus-map.tsx?raw")],
      ["Scenarios: src/a11y/registry/campus-map.ts", () => import("~/a11y/registry/campus-map.ts?raw")],
    ],
  },
];

/** Longer versions for players' own time, linked from their booth challenge (`harder`). Own leaderboard, not in the overall total. */
export const harderChallenges: Challenge[] = [
  {
    id: "apply-sr",
    path: "/admissions/apply",
    title: "Application for Admission",
    at: "Screen reader",
    atExamples: ["NVDA with Firefox or Chrome", "JAWS with Chrome", "VoiceOver with Safari", "TalkBack with Chrome"],
    basePoints: 500,
    timeLimitMin: 20,
    advanced: true,
    brief: "The harder screen reader challenge, for when you have more time: submit a complete two-step application for admission to reveal the flag. Turn your monitor off, or look away, and use only your screen reader.",
    reveal: "Show the form",
    warning: "Once you start, the application form below fades out over 5 seconds and can't be seen, but your screen reader can still read and fill it in.",
    instructions: [
      "The form fades out over 5 seconds once you start, then focus moves to its first field: complete it with your screen reader.",
      "Fill in every required field on both steps and submit the application. It takes about 20 minutes with a screen reader.",
      "On the Program and submit step you also need your Application referral code. It is somewhere on that step.",
      "Submitting the application completes the challenge. Your flag is entered for you.",
      "Reloading the page ends the run and uses up the attempt.",
    ],
    allowed: srAllowed,
    notAllowed: srNotAllowed,
    hints: [
      "Some fields are not in the order you expect, and some labels belong to the field next to them. Check what each field is called before you type, and read the text around it in browse mode.",
      "The referral code image's alternative text is a file name. Listen to the full name of the Application referral code field: it tells you what to type.",
      "The Next button has no name; it is the last button on each step. The first-choice major list opens when you activate its current value (\"Choose a major\") in browse mode, and the certify checkbox on step 2 is hidden from your screen reader but still reachable with Tab.",
    ],
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
