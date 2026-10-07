import { expect, test, type Page } from "@playwright/test";

// Plan 09: nothing persists. Each flow does one real interaction, then a reload proves it's back to its
// initial defective/empty state, and no browser storage was touched along the way.

// The Add-to-plan button is a "button-empty" error scenario: it has no accessible name while defective, so it
// can only be found by class here (this file never toggles Fix Errors).
const addFirstCourse = (page: Page) => page.locator(".course-add").first().click();

// The application's step titles are bold text and its Next button an unnamed arrow (apply-fake-heading-001,
// apply-next-name-001), so these are located by class rather than role.
const stepTitle = (page: Page, name: RegExp) => page.locator(".apply-step-title").filter({ hasText: name });
const nextButton = (page: Page) => page.locator('.apply-nav button[type="submit"]');

async function fillApplyStepOne(page: Page) {
  await page.locator("#first").fill("Casey");
  await page.locator("#last").fill("Rivera");
  await page.locator("#dob-m").fill("6");
  await page.locator("#dob-d").fill("15");
  await page.locator("#dob-y").fill("2008");
  await page.locator("#email").fill("casey.rivera@example.com");
  await page.locator("#street").fill("100 Redwood Way");
  await page.locator("#city").fill("Arcadia Falls");
  await page.locator("#zip").fill("95521");
  await page.locator("#citizenship").check(); // U.S. citizen (apply-citizenship-radios-001: radios named by codes)
}

test("course plan resets on reload (/academics/courses)", async ({ page }) => {
  await page.goto("/academics/courses");
  await addFirstCourse(page);
  await expect(page.getByText("No courses yet.")).toHaveCount(0);

  await page.reload();
  await expect(page.getByText("No courses yet. Use the + button on a course to add it.")).toBeVisible();
});

test("application step resets on reload (/admissions/apply)", async ({ page }) => {
  await page.goto("/admissions/apply");
  await expect(stepTitle(page, /Step 1 of 3/)).toBeVisible();
  await fillApplyStepOne(page);
  await nextButton(page).click();
  await expect(stepTitle(page, /Step 2 of 3/)).toBeVisible();

  await page.reload();
  await expect(stepTitle(page, /Step 1 of 3/)).toBeVisible();
});

test("event registration resets on reload (/events/research-symposium-2026)", async ({ page }) => {
  await page.goto("/events/research-symposium-2026");
  await page.getByLabel("Full name").fill("Casey Rivera");
  await page.getByLabel(/^Email/).fill("casey.rivera@example.com");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByText(/You're registered for/)).toBeVisible();

  await page.reload();
  await expect(page.getByText(/You're registered for/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
});

test("portal to-do check-off resets on reload (/portal/todo)", async ({ page }) => {
  await page.goto("/portal/todo");
  const first = page.locator('input[type="checkbox"]').first();
  await first.check();
  await expect(first).toBeChecked();

  await page.reload();
  await expect(page.locator('input[type="checkbox"]').first()).not.toBeChecked();
});

test("search filter selection resets on reload (/search)", async ({ page }) => {
  // The query itself is a permalink read from the URL (by design, like the visit scheduler's ?date=), so it's
  // expected to survive a reload; the *filter* selection is local component state and should not.
  await page.goto("/search?q=computer+science");
  await page.locator(".search-facets").waitFor();
  const courses = page.getByRole("button", { name: /^Courses/ });
  await courses.click();
  await expect(courses).toHaveClass(/is-active/);

  await page.reload();
  await page.locator(".search-facets").waitFor();
  await expect(page.getByRole("button", { name: /^All/ })).toHaveClass(/is-active/);
  await expect(page.getByRole("button", { name: /^Courses/ })).not.toHaveClass(/is-active/);
});

test("no persistence: none of the above interactions touch storage or cookies", async ({ page, context }) => {
  await page.goto("/academics/courses");
  await addFirstCourse(page);
  await page.goto("/admissions/apply");
  await fillApplyStepOne(page);
  await nextButton(page).click();
  await page.goto("/portal/todo");
  await page.locator('input[type="checkbox"]').first().check();

  // react-router-scroll-positions is React Router's own scroll-restoration feature, not app state: it holds
  // no scenario/form data, and it's gone as soon as the tab closes — a reload is exactly what it's for. It
  // isn't the persistence plan 02 bans (src/a11y/state.ts: "Never persist this anywhere"). Every other key
  // in either store is the app's to answer for.
  const storage = await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage).filter((k) => k !== "react-router-scroll-positions"),
  }));
  expect(storage).toEqual({ local: [], session: [] });
  expect(await context.cookies()).toEqual([]);

  const dbs = await page.evaluate(async () => (await indexedDB.databases?.()) ?? []);
  expect(dbs).toEqual([]);
});
