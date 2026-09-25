# Plan 06 — Interactive Features

## Goal

Build realistic client-side interactions. They run on in-memory state only, reset on reload, and each one carries paired defective and fixed behaviors that are registered in the scenario engine.

## Shared rules

- State lives in React state or in a per-feature module store (the same pattern as plan 02 for anything that must survive client-side navigation, such as the registration cart or portal changes). There is **no persistent storage**.
- Fake latency (300–800 ms, fixed per action for determinism) makes loading states and live-region scenarios realistic.
- Nothing is sent over the network. Forms end in on-page confirmations.
- Every feature lists its scenarios. The IDs below are examples, and plan 07 has the full catalog.

## Features

### 1. Course search: `/academics/courses`
- Keyword search, department and semester filters, level and credits facets, expandable course rows, "Add to plan" and remove, and pagination.
- Defects: an unlabeled keyword input (error), a filter `<select>` with no name (error), result count updates not announced (manual), expand toggles without `aria-expanded` (manual), and "Add" icon buttons with no name (error).

### 2. Student registration SPA: `/portal/registration` (tier T)
- Search sections, add them to a cart, check for time conflicts, drag to reorder priority, "Register" (fake), and show a success or waitlist result.
- Defects: focus is lost after a cart update, the conflict error is shown in color only and never announced, drag-and-drop has no keyboard alternative, custom tabs with broken arrow keys, `aria-controls` pointing to missing IDs, `role="grid"` without the required children, and a "Processing…" overlay that doesn't trap or restore focus.
- Fixed: focus moves to the updated cart heading, errors use `role="alert"` plus an icon and text, up/down buttons replace drag, correct tab keyboard behavior, and valid ARIA.

### 3. Student portal (all `/portal/*`)
- Dashboard widgets, dismissible alerts ("acknowledge"), tabbed grades by term, an expandable degree audit, a message inbox (open, mark read), a to-do checklist, holds with a detail modal, an account ledger table, and profile edits held in memory.
- Defects: a message list made of clickable `<div>`s, an unread count conveyed by color only, a hold modal with no dialog semantics, an audit accordion that doesn't expose state, and a fixed-width ledger that breaks at 200% zoom.

### 4. Faculty directory: `/faculty` (also `/employees/directory`)
- Filter by name, department, and research topic, switch between card and table views, and "Load more."
- Defects: an unlabeled filter, result changes not announced, a view toggle that uses color only for its selected state, and "Load more" that doesn't move focus.

### 5. Global search: `/search` (plus the header box)
- A MiniSearch-backed search with type facets and "Did you mean" suggestions.
- Defects: the header search box has an icon-only submit button, and a suggestions combobox with no ARIA combobox pattern and no keyboard support.

### 6. Event registration: `/events/:slug`
- Choose an attendee count, a session, attendee name and email, and submit to see a confirmation with a fake confirmation number (deterministic hash).
- Defects: required fields marked only by red asterisk color, vague errors ("Invalid input"), a confirmation not announced, and a custom stepper for attendee count that doesn't work with the keyboard.

### 7. Donation form: `/giving/donate` (tier T)
- Amount chips with a custom amount, frequency, fund select, tribute section (shown conditionally), donor info, fake card fields (**never** validated against real card rules beyond format, and never transmitted), and a review step.
- Defects: ungrouped radio chips (no fieldset or legend), placeholder-only fields, instructions that disappear on focus, errors listed only at the top in red, a session "timeout" modal with no way to extend it, and a CVV help icon that works on hover only.

### 8. Admissions application: `/admissions/apply`
- Five steps: personal information, academic history, program choice, essays, then review and submit. A progress indicator and Back/Next buttons, with the data held in memory.
- Defects: the stepper's current step shown only visually, focus not moved to the new step heading, a long form with no headings or groups, and date fields split into three unlabeled inputs.

### 9. Legacy financial aid form: `/financial-aid/legacy-application` (tier T)
- A table-based layout, `<font>`-style inline styles, image buttons, a CAPTCHA-style image with no alternative, a timed session, and a "Print" link that needs the mouse.
- Most defects are errors and alerts, with keyboard defects on top.

### 10. Campus map: `/campus-map` (tier T)
- An SVG map with clickable buildings, a category filter, a building detail panel, and zoom and pan.
- Defects: buildings are `<path onclick>` with no role, name, or focus; zoom buttons are unnamed icons; the detail panel isn't announced; pan works only by drag; and parking colors appear with no legend text.
- Fixed: buildings get `role="button"` (or become links) with names and `tabindex`, a parallel accessible building list, arrow-key pan, and named buttons.

### 11. Homepage carousel and motion
- An auto-rotating hero carousel (6 s), an animated scrolling announcement ticker, and athletics score ticker animation.
- Defects: no pause control, controls not reachable by keyboard, slide changes that move focus, and animations that ignore `prefers-reduced-motion`.
- Fixed: pause and play buttons, reachable controls, no auto-rotation under reduced motion, and a paused ticker.

### 12. Common widgets used across pages
Mega menu, tabs, accordion, modal dialog, custom dropdown, date picker (visit scheduling), study-room booking grid (drag to select a time range), and toast notifications. Each widget has one defective and one fixed implementation, chosen by the scenario tied to that instance. Different pages can use different defect variants of the same widget.

## Implementation pattern

```
src/components/widgets/
  Tabs/            TabsFixed.tsx  TabsBrokenKeyboard.tsx  TabsNoRoles.tsx  index.tsx (chooses via useScenario)
  Modal/           ModalFixed.tsx ModalNoTrap.tsx ModalNoRestore.tsx
  MegaMenu/        DisclosureMegaMenu.tsx HoverMegaMenu.tsx
  ...
```

Keep the fixed versions to WAI-ARIA Authoring Practices patterns. The defective versions should each break **one or two specific things**, so every scenario tests something clear.

## Acceptance criteria

- Every feature works end to end with the mouse in the defective state, just as a real shipped site would.
- With the matching toggle ON, every feature can be fully operated by keyboard and screen reader.
- A reload restores every feature's initial state. Plan 09 includes a test that changes state, reloads, and asserts the reset.

## Implementation notes (2026-09-25)

- Widgets (#12) first: defect variants as props on `Tabs`, `Accordion`, `Modal`, plus `Dropdown`, `DatePicker`, `Toast` in `components/widgets.tsx` (ADR-032); helpers `latency`, `confirmationCode`, `createStore` in `~/lib/interactive`. Tested in `components/widgets.test.tsx`.
- Built by five parallel agents with split ownership:
  - #1 course search and #4 directories: `/academics/courses` (H, 12), `/faculty` (H, 13), `/employees/directory` (H, 12).
  - #2 registration (`/portal/registration`, T, 34) and #3 portal interactions (every portal page within tier).
  - #5 header search and `/search` (7), #6 event registration (6 open events), study-room booking grid (10), visit date picker + booking modal + toast (13).
  - #7 donate (T, 37), #8 apply (H, 15), #9 legacy aid form (T, 45).
  - #10 campus map (T, 37) and #11 homepage carousel + ticker and athletics ticker animation.
- Totals: **669 registered scenarios**, all verified by `npm run check:scenarios`; 127 unit/component tests.
- Verified in Chrome on 17 interactive pages: hydration with no console errors, Fix All clears every count.
- Homepage is at 19 page-level scenarios (build guide says 8–15 for H); plan 07 rebalances tiers once chrome defects land.
- Left for plan 07: `/academics/catalog` and `/athletics/schedule` (terrible pages), global chrome defects, and the unregistered-defect audit (stub/copy renderers, axe on all toggles OFF/ON).
