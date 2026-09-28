import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { scenarios } from "../src/a11y/registry";

test("accessibility lab: no axe violations, and the scenario table lists every registered scenario", async ({ page }) => {
  await page.goto("/accessibility-lab");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);

  const rows = page.locator("#lab-tabpanel table tbody tr");
  await expect(rows).toHaveCount(scenarios.size);
});
