// Playwright snippet: an async (page) function whose ITEMS placeholder is filled in by run-flow.mjs
// (or next-batch.mjs for the MCP `browser_run_code_unsafe` tool). Requires the browser to be on a Flow project page.
async (page) => {
  const ITEMS = /*ITEMS*/[];
  const OUT = 'E:/Dev/a11y_university/assets-src/flow/';
  const STYLE = ' Documentary photography, natural light, Northern California campus, redwood and fern landscaping, realistic, no text, no watermarks, no real logos.';
  // Without this the agent starts filing images into collections on its own (seen 2026-09-24).
  const NO_COLLECTIONS = ' Do not create or add to any collection.';

  // Each generated image appears in the agent chat as img[alt^="Option"]; the newest is last in the DOM.
  // (The media grid is unreliable: it is virtualized, older tiles resurface at the top, and collections reorder it.)
  const chatImgs = page.locator('img[alt^="Option"]');
  const idle = async () => (await page.getByRole('button', { name: 'Start generation' }).count()) > 0;

  // Fresh agent session per batch keeps its context short.
  const fresh = page.getByRole('button', { name: 'Start new session' });
  if (await fresh.count()) { await fresh.first().click(); await page.waitForTimeout(1500); }

  const results = [];
  const seen = new Set();
  for (const item of ITEMS) {
    const started = Date.now();
    const before = await chatImgs.count();
    const failed = page.getByText('Something went wrong');
    const failsBefore = await failed.count();
    const box = page.locator('[contenteditable="true"]').last();
    await box.click();
    await page.keyboard.type(`Generate one ${item.aspect} image: ${item.prompt}${item.text || item.plain ? '' : STYLE}${NO_COLLECTIONS}`);
    await page.getByRole('button', { name: 'Start generation' }).click();

    let img = null;
    for (let i = 0; i < 90; i++) {
      await page.waitForTimeout(2000);
      if (!(await idle())) continue;              // agent still working (stop button shown)
      if ((await chatImgs.count()) > before) {
        const last = chatImgs.last();
        const s = await last.getAttribute('src');
        if (s && !seen.has(s)) { img = last; seen.add(s); break; }
      }
      if ((await failed.count()) > failsBefore && (await chatImgs.count()) === before) break;   // agent reported a failure
      if (await page.getByText('reached your usage limit').count()) { results.push({ id: item.id, error: 'USAGE LIMIT reached' }); return results; }
    }
    if (!img) { results.push({ id: item.id, error: 'no new image in the agent chat (failed or timed out)' }); continue; }
    await img.scrollIntoViewIfNeeded();
    await page.waitForFunction((el) => el.complete && el.naturalWidth > 0, await img.elementHandle(), { timeout: 20000 }).catch(() => {});
    const dims = await img.evaluate((i) => `${i.naturalWidth}x${i.naturalHeight}`);

    // `=s0` asks for the original-size JPEG instead of the resized WebP thumbnail.
    const res = await page.context().request.get((await img.getAttribute('src')).replace(/=s\d+(-[a-z]+)*$/, '=s0'));
    if (!res.ok()) { results.push({ id: item.id, error: `image fetch ${res.status()}` }); continue; }
    const type = res.headers()['content-type'] ?? '';
    const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpeg';
    const { writeFileSync } = await import('node:fs');
    writeFileSync(`${OUT}${item.id}.${ext}`, await res.body());
    results.push({ id: item.id, file: `${item.id}.${ext}`, dims, type, seconds: Math.round((Date.now() - started) / 1000) });
  }
  return results;
}
