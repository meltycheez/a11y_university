import { expect, test } from "@playwright/test";
import { inventory } from "../src/routes/inventory";

// Plan 09: every inventory path returns 200, renders <main>, and logs no console errors.
for (const entry of inventory) {
  test(`route smoke: ${entry.path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(entry.path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}
