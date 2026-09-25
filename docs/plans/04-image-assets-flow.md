# Plan 04 — Image Assets via Google Flow (Nano Banana)

## Goal

Generate every photographic and illustrative asset with **Nano Banana in your Google Flow account** (flow.google.com, PRO tier). Claude drives Flow through the Playwright MCP browser, which is already signed in. The raw images are then optimized into responsive WebP files and indexed in an asset manifest. That manifest is also what feeds the image-related accessibility scenarios.

> Constraints recap: Flow is driven through the browser UI, so it's slower than an API and can break when Google changes the page. Google's consumer terms may limit automated use. Generation happens in supervised batches in your signed-in session. The `nano-banana` API MCP server is still installed as a fallback if Flow becomes impractical.

## What is *not* generated

- **Logo, wordmark, seal, and athletics mark** are hand-built SVG in `src/assets/brand/`. AI image models render lettering unreliably. SVG also gives exact control over `<title>` and `role`, which several SVG scenarios need.
- **Icons** come from an inline SVG icon set (for example Lucide, copied in as components).
- **The campus map base** is hand-built SVG, because it needs clickable regions. A Flow-generated aerial illustration can serve as a decorative backdrop.

## Asset manifest (`src/data/images.json`)

Each entry defines the prompt and the accessibility metadata together:

```json
{
  "id": "home-hero-quad",
  "prompt": "Wide photo of a university central quad in autumn, redwood trees, brick and timber buildings, students walking, golden hour, documentary style, no text, no logos",
  "aspect": "16:9",
  "usedOn": ["/"],
  "alt": "Students cross the central quad beneath redwood trees on an autumn afternoon",
  "altSuspicious": "IMG_4471.jpg",
  "altLong": "…a deliberately overlong 300+ character description…",
  "decorative": false,
  "credit": "Generated with Nano Banana in Google Flow"
}
```

`alt` is used when fixed. `altSuspicious` and `altLong` feed alert scenarios. The `<Img>` helper (plan 02) picks the variant based on scenario state.

## Asset list (~110 images)

Flow returns several variations per prompt. Pick the best one and keep an alternate where the page needs more than one.

| Group | Count | Aspect | Notes |
|---|---|---|---|
| Section heroes (home, about, admissions ×3, academics, library, students, news, events, giving, employees, portal banner, alumni, parents, visitors) | ~16 | 16:9 (2K upscale for full-width) | Consistent style: documentary photo, Pacific Northwest–style campus, redwoods |
| Home carousel slides | 4 | 16:9 | The carousel is a motion scenario (plan 06) |
| College heroes | 6 | 16:9 | Engineering lab, business atrium, arts studio, science lab, classroom, nursing sim lab |
| Department and program cards | 12 | 4:3 | |
| News article leads | 15 | 16:9 | Match each article's topic |
| Event cards | 10 | 4:3 | |
| Athletics (team action and venues) | 8 | 16:9 | Redwood Owls uniforms in maroon and green, no real team marks |
| Faculty and leadership headshots | ~36 | 1:1 | Neutral backdrop, varied ages and ethnicities, professional attire. **Fictional people only.** |
| Athlete profile photos | 8 | 3:4 | |
| Campus life (housing, dining, rec center, library interior, health center, parking, and so on) | 12 | 4:3 | |
| "Image of text" flyers | 3 | 3:4 | Event flyer, dining hours sign, and "Apply by Jan 15" graphic with real rendered text. These are **manual-test scenarios** (text in images). Nano Banana handles text reasonably. Check spelling. |
| Mascot illustration | 2 | 1:1 | Rowan the Owl, flat illustration style |
| Aerial campus illustration | 1 | 16:9 | Decorative backdrop for the map |

**Shared style suffix** appended to every photo prompt, for consistency:
`documentary photography, natural light, Northern California campus, redwood and fern landscaping, realistic, no text, no watermarks, no real logos`

## Flow generation workflow

**Step 0: pilot and runbook. Done on 2026-09-24; see [flow-runbook.md](flow-runbook.md).**
1. Open Flow in Playwright, create a project named `RSU Assets`, and switch to image generation. Select the **Nano Banana** model and the aspect ratio.
2. Generate one test image. Record the exact UI steps, element roles and labels, how to set the variation count, how long generation takes, and how downloads work.
3. Write the findings to `docs/plans/flow-runbook.md`. Later batches follow that runbook.

**Step 1: batch loop** (per manifest group, about 10 prompts per session):
1. Enter the prompt with the style suffix and set the aspect ratio.
2. Generate, then wait for the results using `browser_wait_for` or a snapshot poll.
3. Take a screenshot of the variations and pick the best one. Claude picks by default, and you can review.
4. Download the full-resolution image. Save it or move it to `assets-src/flow/<id>.png` so the name matches the manifest ID.
5. Mark the manifest entry `generated: true` and record which variation was used.

**Step 2: human review gate.** A contact-sheet page (`scripts/contact-sheet.ts` writes a local HTML grid) shows every image next to its ID and alt text, so you can approve or reject them. Rejected IDs go back into the batch loop.

**Resumability:** the loop only processes entries without `generated: true`, so an interrupted session continues where it stopped.

## Optimization pipeline (`scripts/optimize-images.mjs`, sharp)

- Input is `assets-src/flow/*.jpeg` (Flow downloads JPEG). Output is `public/images/<id>-{480,960,1376}.webp` (heroes: add a 2K-upscaled `-1920` variant), plus a JPEG fallback for heroes.
- Strip metadata, target quality 78, and write `width` and `height` into the manifest so layout doesn't shift.
- The `<Img>` component renders `srcset` and `sizes`.
- **Git:** commit the optimized `public/images` and the manifest. Keep the raw `assets-src/flow/` out of git (it's large), but back it up locally. Generated images can't be reproduced, so the committed WebP files are the source of truth.

## Placeholders while generating

Until an image exists, `<Img>` renders a tinted SVG placeholder of the correct aspect ratio with the same alt-text scenario behavior. Page work in plan 05 is never blocked on images.

## Tasks

1. Build the SVG brand kit: logo, wordmark, seal, athletics mark, and favicon.
2. Write the manifest with prompts and alt variants for all ~110 images.
3. Run the pilot and write `flow-runbook.md`.
4. Generate in batches: heroes, colleges, and campus life first, then news and events, then headshots, then athletics and flyers.
5. Review with the contact sheet and regenerate rejects.
6. Optimize, commit, and remove the placeholders.

## Acceptance criteria

- Every manifest entry has an optimized image, dimensions, a good `alt`, and bad alt variants where a scenario uses them.
- No generated image contains real logos, real people, or accidental garbled text. The deliberate flyers have legible, correctly spelled text.
- The visual style is consistent across the site.
- Total `public/images` size is under about 40 MB.

## Implementation notes (2026-09-25)

- Manifest: `src/data/images.json`, 131 entries (ids per ADR-017). Brand marks are in `src/components/Logo.tsx` (ADR-020); the seal was checked in Chrome.
- Generated 126/131 with `scripts/flow/run-flow.mjs` (ADR-022). Waiting on Flow's usage limit: `flyer-dining-hours`, `flyer-apply-jan15`, `mascot-rowan`, `mascot-rowan-cheer`, `map-aerial-illustration`. Rerun the runner to finish; it only processes missing files.
- Reviewed on contact sheets: consistent style, headshots match their descriptors, no real logos or garbled text. Removed one duplicate (wildfire), one misfiled image (art exhibition) and one near-duplicate (dining-hours flyer).
- `public/images` is 26.2 MB (budget 40 MB). Section heroes now use the dedicated hero images.
