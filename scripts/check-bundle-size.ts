/**
 * Bundle size check.
 *
 * Builds the library, measures the gzipped output size, and compares
 * against a checked-in baseline. Fails if the size exceeds the baseline
 * by more than the allowed threshold.
 *
 * Usage:
 *   bun run scripts/check-bundle-size.ts          # check against baseline
 *   bun run scripts/check-bundle-size.ts --update  # update the baseline
 */

import { $, Glob } from "bun";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname!, "..");
const LIBRARY_DIR = `${ROOT}/packages/eudonia`;
const DIST_DIR = `${LIBRARY_DIR}/dist`;
const BASELINE_FILE = `${ROOT}/tests/bundle-size-baseline.json`;
const THRESHOLD_BYTES = 1024; // 1KB allowed growth

// Build the library
await $`bun run build`.cwd(LIBRARY_DIR).quiet();

// Rollup with `preserveModules: true` emits one file per source module under
// dist/, so the published surface is the sum of every .js file rather than a
// single entry. Sum raw and gzipped bytes across the whole tree.
const glob = new Glob("**/*.js");
let rawSize = 0;
let gzipSize = 0;
for await (const relPath of glob.scan(DIST_DIR)) {
  const buf = await Bun.file(`${DIST_DIR}/${relPath}`).arrayBuffer();
  rawSize += buf.byteLength;
  gzipSize += Bun.gzipSync(new Uint8Array(buf)).byteLength;
}

// Update mode
if (Bun.argv.includes("--update")) {
  const baseline = { raw: rawSize, gzip: gzipSize };
  await Bun.write(BASELINE_FILE, JSON.stringify(baseline, null, 2) + "\n");
  console.log(`Baseline updated: ${rawSize} bytes (${gzipSize} bytes gzipped)`);
  process.exit(0);
}

// Check mode
console.log(`Current: ${rawSize} bytes raw, ${gzipSize} bytes gzipped`);

const baselineFile = Bun.file(BASELINE_FILE);

if (!(await baselineFile.exists())) {
  console.log("No baseline found. Run with --update to create one.");
  process.exit(1);
}

const baseline = (await baselineFile.json()) as { raw: number; gzip: number };

console.log(`Baseline: ${baseline.raw} bytes raw, ${baseline.gzip} bytes gzipped`);

const delta = gzipSize - baseline.gzip;
const sign = delta >= 0 ? "+" : "";
console.log(`Delta: ${sign}${delta} bytes gzipped`);

if (delta > THRESHOLD_BYTES) {
  console.error(
    `\nBundle size increased by ${delta} bytes (threshold: ${THRESHOLD_BYTES} bytes). ` +
    `Run with --update if this increase is intentional.`,
  );
  process.exit(1);
}

console.log("Bundle size check passed.");
