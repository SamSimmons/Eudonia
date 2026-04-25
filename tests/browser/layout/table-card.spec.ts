import { test, expect, type Page } from "@playwright/test";
import { converter, parse } from "culori";

const ROUTE = "/#/table-card";
const toOklch = converter("oklch");

function lightness(value: string): number {
  const parsed = parse(value);
  if (!parsed) throw new Error(`unparseable color: ${value}`);
  return toOklch(parsed).l;
}

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t;
  }, theme);
}

test.describe("TableCard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTE);
    await page.waitForSelector("[data-testid='table-card-page']");
  });

  test("active and preview sort carets share the same bounding rect", async ({ page }) => {
    // The default-sorted column ("growth") renders both icons stacked.
    const sortedHeader = page.locator('[role="columnheader"][aria-sort="descending"]');
    const current = sortedHeader.locator('[data-sort-icon="current"]');
    const preview = sortedHeader.locator('[data-sort-icon="preview"]');

    const [currentBox, previewBox] = await Promise.all([
      current.boundingBox(),
      preview.boundingBox(),
    ]);

    expect(currentBox).not.toBeNull();
    expect(previewBox).not.toBeNull();

    // Stacked at the same grid-area; rects should be pixel-identical.
    expect(Math.abs(currentBox!.x - previewBox!.x)).toBeLessThan(0.5);
    expect(Math.abs(currentBox!.y - previewBox!.y)).toBeLessThan(0.5);
    expect(Math.abs(currentBox!.width - previewBox!.width)).toBeLessThan(0.5);
    expect(Math.abs(currentBox!.height - previewBox!.height)).toBeLessThan(0.5);
  });

  test("positive signal cell takes positive-fg color, not the inherited card fg", async ({
    page,
  }) => {
    await setTheme(page, "light");

    const positiveCell = page.locator('[data-signal="positive"]').first();
    const cellColor = await positiveCell.evaluate((el) => getComputedStyle(el).color);
    const cardColor = await page
      .locator("[data-testid='card']")
      .evaluate((el) => getComputedStyle(el).color);

    expect(cellColor).not.toBe(cardColor);

    // Light-mode positive-fg is dark green: low lightness.
    expect(lightness(cellColor)).toBeLessThan(0.5);
  });

  test("signal cell color flips with explicit data-theme override", async ({ page }) => {
    const positiveCell = page.locator('[data-signal="positive"]').first();

    await setTheme(page, "light");
    const lightColor = await positiveCell.evaluate((el) => getComputedStyle(el).color);

    await setTheme(page, "dark");
    const darkColor = await positiveCell.evaluate((el) => getComputedStyle(el).color);

    expect(lightColor).not.toBe(darkColor);

    // Light-mode fg is dark green; dark-mode fg is light green.
    expect(lightness(lightColor)).toBeLessThan(0.5);
    expect(lightness(darkColor)).toBeGreaterThan(0.7);
  });
});
