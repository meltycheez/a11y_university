import { expect, test } from "@playwright/test";

const openControl = async (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Accessibility Test Controls" }).click();

test.describe("mega menu keyboard disclosure", () => {
  test("defective: hover-only, no keyboard-reachable trigger", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("button.mega-trigger")).toHaveCount(0);
    await expect(page.locator("a.mega-trigger").first()).toBeVisible();
  });

  test("fixed: Enter opens the panel, Escape closes it and returns focus", async ({ page }) => {
    await page.goto("/");
    await openControl(page);
    await page.getByRole("switch", { name: "Fix Manual Testing Issues" }).click();
    const trigger = page.locator("button.mega-trigger").first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });
});

test.describe("modal focus restore (/admissions/visit)", () => {
  const nav = "/admissions/visit?date=2026-10-06&time=10:00%20a.m.";

  test("defective: closing drops focus instead of restoring it to the trigger", async ({ page }) => {
    await page.goto(nav);
    const reserve = page.getByRole("button", { name: "Reserve this tour" });
    await reserve.click();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(reserve).not.toBeFocused();
  });

  test("fixed: closing returns focus to the trigger", async ({ page }) => {
    await page.goto(nav);
    await openControl(page);
    await page.getByRole("switch", { name: "Fix Manual Testing Issues" }).click();
    const reserve = page.getByRole("button", { name: "Reserve this tour" });
    await reserve.click();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(reserve).toBeFocused();
  });
});

test.describe("positive tabindex order (/library/study-rooms)", () => {
  test("defective: the date select jumps ahead of the skip link in tab order", async ({ page }) => {
    await page.goto("/library/study-rooms");
    await page.locator("body").evaluate((b) => b.focus());
    await page.keyboard.press("Tab");
    await expect(page.locator("#room-date")).toBeFocused();
  });

  test("fixed: the date select sits in its natural document order", async ({ page }) => {
    await page.goto("/library/study-rooms");
    await openControl(page);
    await page.getByRole("switch", { name: "Fix Manual Testing Issues" }).click();
    await page.locator("body").evaluate((b) => b.focus());
    await page.keyboard.press("Tab");
    await expect(page.locator("#room-date")).not.toBeFocused();
  });
});

test.describe("carousel pause control (/)", () => {
  test("defective: no pause control reachable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".carousel-pause")).toHaveCount(0);
  });

  test("fixed: pause control present and toggles play/pause", async ({ page }) => {
    await page.goto("/");
    await openControl(page);
    await page.getByRole("switch", { name: "Fix Manual Testing Issues" }).click();
    const pause = page.locator(".carousel-pause");
    await expect(pause).toContainText("Pause");
    await pause.click();
    await expect(pause).toContainText("Play");
  });
});

test.describe("contrast (/about)", () => {
  const luminance = ([r, g, b]: number[]) => {
    const c = [r, g, b].map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const rgb = (s: string) => s.match(/\d+(\.\d+)?/g)!.slice(0, 3).map(Number);
  const ratio = (fg: string, bg: string) => {
    const [l1, l2] = [luminance(rgb(fg)), luminance(rgb(bg))].sort((a, b) => b - a);
    return (l1 + 0.05) / (l2 + 0.05);
  };

  // .stat-label has no background of its own; the color comes from the .stats-band ancestor
  // (src/styles/sections/flagship.css: "~3.3:1 on #1f4128" defective, "~4.6:1" fixed).
  const contrastRatio = (page: import("@playwright/test").Page) =>
    page.locator(".about-stats .stat-label").first().evaluate((label) => {
      const color = getComputedStyle(label).color;
      const band = label.closest(".stats-band") as HTMLElement;
      return { color, bg: getComputedStyle(band).backgroundColor };
    }).then(({ color, bg }) => ratio(color, bg));

  test("defective: stat labels fail the 4.5:1 text contrast minimum", async ({ page }) => {
    await page.goto("/about");
    expect(await contrastRatio(page)).toBeLessThan(4.5);
  });

  test("fixed: stat labels meet the 4.5:1 text contrast minimum", async ({ page }) => {
    await page.goto("/about");
    await openControl(page);
    await page.getByRole("switch", { name: "Fix Errors" }).click();
    expect(await contrastRatio(page)).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("reflow at 320px (/library/study-rooms)", () => {
  test.use({ viewport: { width: 320, height: 800 } });

  test("defective: the availability table forces the page to scroll sideways", async ({ page }) => {
    await page.goto("/library/study-rooms");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeGreaterThan(clientWidth);
  });

  test("fixed: only the table's own region scrolls, not the page", async ({ page }) => {
    await page.goto("/library/study-rooms");
    await openControl(page);
    await page.getByRole("switch", { name: "Fix Manual Testing Issues" }).click();
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    const region = page.getByRole("region", { name: "Room availability" });
    await expect(region).toHaveAttribute("tabindex", "0");
  });
});
