import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Plan 14 §6: with every fix on, a failed submit shows an error summary at the top of the form. It takes focus, lists
// each bad field as "Name: reason", and each link moves focus into its field.
const widget = (page: Page) => page.getByRole("button", { name: "Pope Tech Accessibility Lab" });
const panel = (page: Page) => page.locator("#a11y-control-panel");

/** Fix All, then go to `path` in the app (fix state lasts across in-app navigation; challenge pages have no widget). */
async function fixAllAt(page: Page, path: string) {
  await page.goto("/");
  await widget(page).click();
  await panel(page).getByRole("button", { name: "Fix All" }).click();
  await panel(page).getByRole("tab", { name: "Challenges" }).click();
  if (path === "/admissions/request-info") await panel(page).locator(`a[href$="${path}"]`).click();
  else { await widget(page).click(); await page.evaluate((to) => { history.pushState({}, "", `${location.pathname.replace(/\/$/, "")}${to}`); dispatchEvent(new PopStateEvent("popstate")); }, path); }
  await expect(page).toHaveURL(new RegExp(`${path}$`));
}

for (const [path, form, send, first] of [
  ["/admissions/request-info", "form.adm-form", "Send me information", "First name: Enter your first name."],
  ["/contact", "form.contact-form", "Send message", "Your name: Enter your name."],
] as const) {
  test(`error summary on ${path}`, async ({ page }) => {
    await fixAllAt(page, path);
    await page.locator(form).getByRole("button", { name: send }).click();
    const summary = page.locator(`${form} .error-summary`);
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("heading")).toHaveText(/^Form errors \(\d+\): Select a link to go to the field with the error\.$/);
    await expect(summary.locator("li").first()).toHaveText(first);
    const link = summary.getByRole("link").first();
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator((await link.getAttribute("href"))!)).toBeFocused();
    await expect(page.locator((await link.getAttribute("href"))!)).toHaveAttribute("aria-invalid", "true");
    const axe = await new AxeBuilder({ page }).include(form).analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
  });
}

// With no fixes on, the same forms still validate, only inaccessibly (color only): an empty submit never "succeeds".
for (const [path, form, send, success, prep] of [
  ["/admissions/request-info", "form.adm-form", "Send me information", ".adm-form-thanks", null],
  ["/portal/profile", "form.pt-form", "Save preferences", ".pt-saved", ["#pf-email", "#pf-emergency"]],
] as const) {
  test(`defective ${path}: an empty submit shows the red fields, not success`, async ({ page }) => {
    await page.goto(path);
    for (const id of prep ?? []) await page.locator(id).fill("");
    await page.locator(form).getByRole("button", { name: send }).click();
    await expect(page.locator(`${form} :is(.adm-form-error, .pt-form-error)`)).toHaveText("Please fill in the fields in red.");
    expect(await page.locator(`${form} [data-error]`).count()).toBeGreaterThan(0);
    await expect(page.locator(success).filter({ hasText: /\S/ })).toHaveCount(0); // no success message
  });
}
