// Playwright snippet for the Playwright MCP `browser_run_code_unsafe` tool.
// Build a runnable copy with ITEMS filled in (see docs/plans/flow-runbook.md), then run it via `filename`.
// Requires the browser to be on a Flow project page (flow.google.com/project/...).
async (page) => {
  const ITEMS = /*ITEMS*/[];
  const OUT = 'E:/Dev/a11y_university/assets-src/flow/';
  const STYLE = ' Documentary photography, natural light, Northern California campus, redwood and fern landscaping, realistic, no text, no watermarks, no real logos.';
  const TILE = "Tile displaying a user's image";

  // The media grid is virtualized and newest-first, so compare the top tile rather than the set of tiles.
  const scrollGridTop = () => page.evaluate(() => document.querySelectorAll('*').forEach(el => {
    if (el.scrollHeight > el.clientHeight + 50 && el.scrollTop > 0) el.scrollTop = 0;
  }));
  const topSrc = async () => {
    await scrollGridTop();
    const img = page.getByAltText(TILE).first();
    return (await img.count()) ? (await img.getAttribute('src')).split('?')[0] : null;
  };
  const idle = async () => (await page.getByRole('button', { name: 'Start generation' }).count()) > 0;

  const results = [];
  for (const item of ITEMS) {
    const started = Date.now();
    const before = await topSrc();
    const box = page.locator('[contenteditable="true"]').last();
    await box.click();
    await page.keyboard.type(`Generate one ${item.aspect} image: ${item.prompt}${item.text ? '' : STYLE}`);
    await page.getByRole('button', { name: 'Start generation' }).click();

    let src = null;
    for (let i = 0; i < 90; i++) {
      await page.waitForTimeout(2000);
      if (!(await idle())) continue;              // agent still working (stop button shown)
      const top = await topSrc();
      if (top && top !== before) { src = top; break; }
    }
    if (!src) { results.push({ id: item.id, error: 'timeout or no image (check the agent chat panel)' }); continue; }
    await page.waitForTimeout(1500);

    const img = page.locator(`img[src^="${src}"]`).first();
    const dims = await img.evaluate(i => `${i.naturalWidth}x${i.naturalHeight}`);
    const tile = img.locator('xpath=ancestor::*[.//button[@aria-label="More options"]][1]');
    await img.hover();
    await tile.getByRole('button', { name: 'More options' }).click();
    await page.getByRole('menuitem', { name: /Download/ }).click();
    const [dl] = await Promise.all([
      page.waitForEvent('download', { timeout: 60000 }),
      page.getByRole('menuitem', { name: /Original size/ }).click(),
    ]);
    const ext = dl.suggestedFilename().split('.').pop();
    await dl.saveAs(`${OUT}${item.id}.${ext}`);
    await page.keyboard.press('Escape');
    results.push({ id: item.id, file: `${item.id}.${ext}`, dims, flowName: dl.suggestedFilename(), seconds: Math.round((Date.now() - started) / 1000) });
  }
  return results;
}
