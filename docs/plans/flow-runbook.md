# Google Flow Runbook (from the 2026-09-24 trial)

These are the verified steps for generating RSU images with Nano Banana in Google Flow through the Playwright MCP browser. The trial produced 11 images, and none were rejected.

## Setup (once)

- The Playwright MCP browser profile is persistent and already signed in (PRO tier). If Google signs it out, sign in again by hand in the Playwright window.
- The project is **RSU Assets**: `https://flow.google.com/project/6c0f8de2-e914-4113-b453-346d676da347`.
- Configure agent settings with the **tune** icon next to the prompt box, then **Save**:
  - Image model: **🍌 Nano Banana 2** (the default).
  - Output count: **x1**. The default was x2. Use x2 only when you want alternatives to choose from.
  - "Confirm before generating: Always" was left on. Direct "Generate one … image" prompts still ran without asking for confirmation.

## How Flow behaves

- The prompt box is an **Agent chat** (`[contenteditable]`, submitted with the **Start generation** button). The agent keeps conversation context between prompts, and it sometimes adds a chatty follow-up message. That's harmless.
- Aspect ratio is honored when it's stated in the prompt text ("Generate one 1:1 image: …"). The available ratios are **16:9, 4:3, 1:1, 3:4, 9:16**. There's no 4:5 or 21:9, so crop those from 16:9.
- Generation takes **about 25–50 s per image**.
- While it runs, a **stop** button replaces **Start generation**. When **Start generation** comes back, the agent is idle.
- The media grid is **newest-first** and **virtualized**: off-screen tiles are removed from the DOM. That means detecting new images by the set of tiles breaks. Compare the **top tile's** `src` after scrolling to the top instead.
- Tiles are `img[alt="Tile displaying a user's image"]`. The `src` is `https://flow-content.google/image/<uuid>?<signed params>`.

## Download

Hover the tile, open **More options** (the tile's own button), then choose **Download** and one of:

- **1K · Original size**: 16:9 is 1376×768, 4:3 is 1200×896, 1:1 is 1024×1024, 3:4 is 896×1200. JPEG files are about 0.7–1.2 MB.
- **2K / 4K · Upscaled**: use these for full-width heroes. Not tested yet; they may take longer or cost more.

Save with Playwright's `download.saveAs()` to `assets-src/flow/<manifest-id>.jpeg`. The MCP also keeps a copy in `E:\Dev\.playwright-mcp\`, which can be deleted.

## Batch procedure

1. Put the items in a JSON list (`scripts/flow/batch-*.json`) with `{id, aspect, prompt, text?}`. Set `text: true` to skip the photo style suffix, for flyers and other images of text.
2. Create a run file from the template with the items filled in:
   ```bash
   cd a11y_university/scripts/flow
   node -e 'const fs=require("fs");const items=JSON.parse(fs.readFileSync("batch-X.json"));fs.writeFileSync("run.js",fs.readFileSync("generate.js","utf8").replace("/*ITEMS*/[]",JSON.stringify(items)))'
   ```
3. Run it with the Playwright MCP tool `browser_run_code_unsafe` and `filename: .../scripts/flow/run.js`. Use **3–5 items per call** so each call finishes before the tool times out.
4. Check the returned `flowName`, which is Flow's own caption, against the intended subject. It's a cheap check for mix-ups.
5. Review a contact sheet (a quick HTML grid, screenshotted) and regenerate any rejects.

## Trial results

| id | aspect | dims | seconds |
|---|---|---|---|
| home-hero-quad | 16:9 | 1376×768 | ~30 |
| admissions-hero-tour | 16:9 | 1376×768 | 37 |
| college-engineering-lab | 16:9 | 1376×768 | 31 |
| college-health-nursing-sim | 16:9 | 1376×768 | 33 |
| campus-library-interior | 4:3 | 1200×896 | 26 |
| campus-dining-hall | 4:3 | 1200×896 | 35 |
| news-coastal-research | 16:9 | 1376×768 | 48 |
| athletics-soccer-action | 16:9 | 1376×768 | 29 |
| faculty-headshot-01 | 1:1 | 1024×1024 | 28 |
| faculty-headshot-02 | 1:1 | 1024×1024 | 31 |
| flyer-fall-festival | 3:4 | 896×1200 | ~60 (text) |

Text rendering was excellent: the flyer's three lines of exact copy came out spelled correctly. Uniforms came out with no logos, as requested.

**Trial bug, now fixed:** the first version of `generate.js` detected new images by comparing sets of tiles. Virtualization made an old tile look new, so the flyer step saved a duplicate of an older photo. The current script compares the top tile after the agent goes idle, and it was verified on `faculty-headshot-02`.

## Throughput estimate

About 35 s per image plus about 5 s to download. At x1, the full ~110-image manifest takes roughly **75 minutes** of generation, spread across 25–35 tool calls.
