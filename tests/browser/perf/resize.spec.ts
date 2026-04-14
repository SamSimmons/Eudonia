import { test, expect } from "@playwright/test";
import type { PerfResults } from "./measure";

test.describe("Resize performance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/kitchen-sink");
    await page.waitForSelector("[data-testid='kitchen-sink']");
  });

  test("no excessive frame drops during resize sequence", async ({ page }) => {
    // Wait for initial render to fully settle
    await page.waitForTimeout(500);

    // Start measurement
    await page.evaluate(() => window.__eudonia_perf.start());

    // Scripted resize sequence: 20 resizes over ~2 seconds
    const sizes = Array.from({ length: 20 }, (_, i) => ({
      width: 800 + Math.round(Math.sin(i * 0.5) * 400),
      height: 600 + Math.round(Math.cos(i * 0.5) * 200),
    }));

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(100);
    }

    // Let final layout settle
    await page.waitForTimeout(200);

    // Stop and collect results
    const results: PerfResults = await page.evaluate(() =>
      window.__eudonia_perf.stop(),
    );

    // Report
    console.log("\n--- Resize Performance ---");
    console.log(`  Frames recorded: ${results.stats.count}`);
    console.log(`  Median frame time: ${results.stats.median}ms`);
    console.log(`  P95 frame time: ${results.stats.p95}ms`);
    console.log(`  Max frame time: ${results.stats.max}ms`);
    console.log(
      `  Frames > 16.67ms (missed 60fps): ${results.stats.longFrames}`,
    );
    console.log(
      `  Frames > 33.34ms (dropped frame): ${results.stats.droppedFrames}`,
    );
    console.log("---\n");

    // Soft assertions — these report rather than gate.
    // The test only fails on catastrophic jank (any frame over 100ms).
    // Tighten this threshold as the framework matures.
    expect(
      results.stats.max,
      `Worst frame was ${results.stats.max}ms — indicates severe jank`,
    ).toBeLessThan(100);
  });
});
