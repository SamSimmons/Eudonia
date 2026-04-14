import { test, expect } from "@playwright/test";

test.describe("Screen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/screen-fill");
    await page.waitForSelector("[data-testid='screen']");
  });

  test("fills the viewport on initial render", async ({ page }) => {
    const viewport = page.viewportSize()!;
    const bounds = await page
      .locator("[data-testid='screen']")
      .boundingBox();

    expect(bounds).not.toBeNull();
    expect(bounds!.width).toBe(viewport.width);
    expect(bounds!.height).toBe(viewport.height);
    expect(bounds!.x).toBe(0);
    expect(bounds!.y).toBe(0);
  });

  test("maintains full viewport coverage after resize", async ({ page }) => {
    const sizes = [
      { width: 1920, height: 1080 },
      { width: 1024, height: 768 },
      { width: 800, height: 600 },
      { width: 1440, height: 900 },
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);

      // Let layout settle
      await page.waitForFunction(() => {
        return new Promise((resolve) => requestAnimationFrame(resolve));
      });

      const bounds = await page
        .locator("[data-testid='screen']")
        .boundingBox();

      expect(bounds, `failed at ${size.width}x${size.height}`).not.toBeNull();
      expect(bounds!.width).toBe(size.width);
      expect(bounds!.height).toBe(size.height);
    }
  });

  test("does not overflow the viewport", async ({ page }) => {
    const viewport = page.viewportSize()!;

    const overflow = await page.evaluate(() => {
      const el = document.querySelector("[data-testid='screen']")!;
      return {
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        elOverflowX: el.scrollWidth > el.clientWidth,
        elOverflowY: el.scrollHeight > el.clientHeight,
      };
    });

    expect(overflow.scrollWidth).toBeLessThanOrEqual(viewport.width);
    expect(overflow.scrollHeight).toBeLessThanOrEqual(viewport.height);
  });
});
