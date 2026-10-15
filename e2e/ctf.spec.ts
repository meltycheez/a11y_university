import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Plan 11: the Pope Tech Accessibility Lab widget's assistive technology CTFs, on the static build.
const widget = (page: Page) => page.getByRole("button", { name: "Pope Tech Accessibility Lab" });
const panel = (page: Page) => page.locator("#a11y-control-panel");
const bar = (page: Page) => page.locator(".ctf-banner");

// These tests finish real runs. A build made with .env's VITE_LEADERBOARD_URL would post them to the live event
// sheet, so block the sheet: finishes stay in this browser's localStorage.
test.beforeEach(async ({ context }) => { await context.route(/script\.google(usercontent)?\.com/, (route) => route.abort()); });

/** Starts a run from the challenge bar on the page: Start Challenge, type a name, press Enter, Start the Challenge. */
async function start(page: Page, handle: string) {
  const open = bar(page).getByRole("button", { name: "Start Challenge", exact: true });
  if (await open.isVisible()) {
    await open.click();
    await bar(page).getByLabel("Your name").fill(handle);
    await bar(page).getByLabel("Your name").press("Enter");
  }
  await bar(page).getByRole("button", { name: "Start the Challenge" }).click();
  await expect(bar(page).getByRole("heading", { name: "Challenge running" })).toBeFocused();
}

/** Axe on the widget (or a dialog it opened) only: the pages around it are defective on purpose. */
async function widgetViolations(page: Page, selector = ".a11y-control") {
  const results = await new AxeBuilder({ page }).include(selector).analyze();
  return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

test("apply CTF: completed with the keyboard and screen-reader-style activation, it reveals the flag", async ({ page }) => {
  await page.goto("/admissions/apply");
  await start(page, "e2e-sr");

  const next = async () => { await page.locator('.apply-nav button[type="submit"]').focus(); await page.keyboard.press("Enter"); };
  const step = (n: number) => expect(page.locator(".apply-step-title")).toContainText(`Step ${n} of 2`);
  // The instructions stay pinned to the side of the screen during the run.
  await expect(page.getByRole("region", { name: "Application for Admission Instructions" })).toBeVisible();
  expect(await widgetViolations(page, ".ctf-dock"), "instructions dock").toEqual([]);
  for (const [id, v] of [["first", "Casey"], ["last", "Rivera"], ["dob-m", "6"], ["dob-d", "15"], ["dob-y", "2008"], ["email", "casey@example.com"],
    ["city", "Arcadia Falls"]]) await page.locator(`#${id}`).fill(v);
  await page.locator("#citizenship").focus();
  await page.keyboard.press("Space");
  await next();
  await step(2);
  await page.locator("#gpa").fill("3.5");
  await page.locator("#term").focus();
  await page.keyboard.press("Space");
  // The major menu ignores the keyboard (apply-major-dropdown-001); a screen reader's browse mode clicks it.
  await page.locator(".fake-select-value").click();
  await page.locator(".fake-select-option", { hasText: "Undeclared (exploring)" }).click();
  await page.locator("#essay1").fill("The redwoods.");
  await page.locator("#certify").focus();
  await page.keyboard.press("Space");
  await next();
  await step(2); // the referral code is required during a run
  await page.locator("#referral").fill("RSU-7Q4K");
  await next();

  // Finishing completes the run: the page congratulates (and takes focus), the bar shows the score.
  await expect(page.getByRole("heading", { name: "Challenge complete" })).toBeFocused();
  const flag = page.locator(".ctf-results .ctf-flag");
  await expect(flag).toHaveText(/^RSU\{apply-sr-[0-9a-f]{8}\}$/);
  await expect(bar(page).getByRole("heading", { name: "Challenge complete" })).toBeVisible();
  await expect(bar(page).locator(".ctf-flag")).toHaveText((await flag.textContent())!);

  // The comparison run: every fix on, the application starts over, focus goes to the challenge bar.
  await page.getByRole("button", { name: "Try again with all issues fixed" }).click();
  await expect(bar(page).locator(".ctf-banner-title")).toBeFocused();
  await expect(bar(page).getByText("Comparison run:")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Step 1 of 2: About you" })).toBeVisible(); // fixed: a real h2
  // Starting it keeps every fix on and is free, and the form hides again like the first run.
  await bar(page).getByRole("button", { name: "Start comparison run" }).click(); // the bar is still at its ready stage
  await expect(bar(page).getByRole("heading", { name: "Comparison run" })).toBeFocused();
  await expect(page.getByRole("heading", { name: "Step 1 of 2: About you" })).toBeAttached();
  await expect(page.locator(".ctf-blind")).toHaveCount(1, { timeout: 3000 });
  await expect(bar(page).getByRole("button", { name: "Get a hint", exact: true })).toBeVisible();
  await bar(page).getByRole("button", { name: "Show the form", exact: true }).click(); // free: no price, no confirmation
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".ctf-blind")).toHaveCount(0);
  await expect(bar(page).getByRole("switch", { name: "Fix Errors" })).toHaveAttribute("aria-checked", "true");
});

test("a Fix switch mid-run costs points; the leaderboard survives a reload while every fix resets", async ({ page }) => {
  await page.goto("/campus-map");
  await start(page, "e2e-eyes");
  await expect(bar(page).getByText("Score: 500 points")).toBeVisible();
  await widget(page).click();
  await panel(page).getByRole("switch", { name: "Fix Errors" }).click();
  await expect(bar(page).getByText("Score: 350 points")).toBeVisible();

  await page.locator("#cmap-checkin-code").fill("7731");
  await page.getByRole("button", { name: "Check in" }).click();
  await expect(page.locator(".ctf-results .ctf-flag")).toContainText("RSU{map-eyes-");
  await expect(bar(page).getByRole("heading", { name: "Challenge complete" })).toBeFocused();
  expect(await widgetViolations(page, ".ctf-banner"), "results").toEqual([]);
  // The challenge source opens from the results (it's hidden before and during a run).
  await bar(page).getByRole("button", { name: "View challenge source" }).click();
  const source = page.getByRole("dialog", { name: "Challenge source: Campus Map" });
  await expect(source.locator("pre").first()).toContainText("campus-map");
  expect(await widgetViolations(page, "dialog[open]"), "source modal").toEqual([]);
  await page.keyboard.press("Escape");
  // The leaderboard opens in place from the results, no page change.
  await page.locator(".ctf-results").getByRole("button", { name: "View leaderboard" }).click();
  await expect(page.getByRole("dialog", { name: "Pope Tech Challenges leaderboard" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/campus-map$/);

  await page.reload();
  await widget(page).click();
  for (const name of ["Fix Errors", "Fix Alerts", "Fix Manual Testing Issues"])
    await expect(panel(page).getByRole("switch", { name })).toHaveAttribute("aria-checked", "false");
  await panel(page).getByRole("tab", { name: "Challenges" }).click();
  await panel(page).getByRole("button", { name: "View leaderboard" }).click();
  const dialog = page.getByRole("dialog", { name: "Pope Tech Challenges leaderboard" });
  await expect(dialog.getByRole("rowheader", { name: "e2e-eyes" })).toBeVisible();
});

test("the widget, the challenge bar and their modals have no axe violations", async ({ page }) => {
  await page.goto("/");
  await widget(page).click();
  expect(await widgetViolations(page), "Fixes tab").toEqual([]);
  await panel(page).getByRole("tab", { name: "Challenges" }).click();
  expect(await widgetViolations(page), "challenge list").toEqual([]);
  await panel(page).getByRole("button", { name: "View leaderboard" }).click();
  expect(await widgetViolations(page, "dialog[open]"), "leaderboard modal").toEqual([]);
  await page.keyboard.press("Escape");
  await expect(panel(page)).toBeVisible(); // Esc closed only the modal

  for (const path of ["/admissions/request-info", "/admissions/apply", "/portal/registration", "/campus-map"]) {
    await page.goto(path);
    expect(await widgetViolations(page, ".ctf-banner"), `${path} collapsed`).toEqual([]);
    await bar(page).getByRole("button", { name: "Start Challenge", exact: true }).click();
    expect(await widgetViolations(page, ".ctf-banner"), `${path} name step`).toEqual([]);
  }
  await page.goto("/admissions/apply");
  await bar(page).getByRole("button", { name: "Start Challenge", exact: true }).click();
  await bar(page).getByRole("button", { name: "Continue" }).click();
  expect(await widgetViolations(page, ".ctf-banner"), "name step error").toEqual([]);
  await bar(page).getByLabel("Your name").fill("e2e-axe");
  await bar(page).getByRole("button", { name: "Continue" }).click();
  expect(await widgetViolations(page, ".ctf-banner"), "ready to start").toEqual([]);

  await start(page, "e2e-axe");
  await bar(page).getByText("More about what's allowed and what isn't").click();
  expect(await widgetViolations(page, ".ctf-banner"), "running, rules expanded").toEqual([]);

  // Confirmations are site modals, never the browser's own dialogs.
  page.on("dialog", (d) => { throw new Error(`unexpected browser dialog: ${d.message()}`); });
  await bar(page).getByRole("button", { name: "Get a hint (−50)" }).click();
  const confirm = page.getByRole("dialog", { name: "Reveal hint 1 of 3?" });
  await expect(confirm).toBeVisible();
  expect(await widgetViolations(page, "dialog[open]"), "confirm modal").toEqual([]);
  await confirm.getByRole("button", { name: "Reveal hint (−50)" }).click();
  await expect(bar(page).getByText("Score: 450 points")).toBeVisible();
});

// WAVE also reports hidden markup (closed <dialog>s included), which axe skips: with every fix on, the
// widget, the challenge bar and their modals must not leave a single unnamed button anywhere in the DOM.
test("with Fix All on, no button anywhere in the DOM is unnamed (what WAVE checks)", async ({ page }) => {
  for (const path of ["/", "/admissions/request-info", "/admissions/apply", "/portal/registration", "/campus-map"]) {
    await page.goto(path);
    await widget(page).click();
    await panel(page).getByRole("button", { name: "Fix All" }).click();
    await widget(page).click();
    const unnamed = await page.evaluate(() => [...document.querySelectorAll("button, [role=button], input[type=button], input[type=submit]")]
      .filter((el) => !(el.textContent ?? "").trim() && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.getAttribute("title")
        && ![...el.querySelectorAll("img[alt]")].some((i) => (i as HTMLImageElement).alt.trim()))
      .map((el) => el.outerHTML.slice(0, 120)));
    expect(unnamed, path).toEqual([]);
  }
});
