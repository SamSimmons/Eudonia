// Built-in named palettes. Each entry is a structured `Palette` object;
// `resolvePalette` serializes it to CSS vars at the call site. Adding a
// palette = adding a key here. The PaletteName type union derives from
// `keyof typeof PALETTES`, so there's nowhere else to keep in sync.
//
// Sources of truth for the values:
// - Tableau 10 — Tableau Software
// - Okabe & Ito 2008 — gold-standard CB-safe set
// - Paul Tol — sron.nl/~pault/data/colourschemes.pdf
// - IBM Carbon Charts — carbondesignsystem.com
// - ColorBrewer 2.0 — Brewer & Harrower (colorbrewer2.org)
// - Coding themes from each project's official spec.

import { parseOklch } from "./oklch";
import type { Palette } from "./types";

// Single-hue lightness ramp from a brand anchor. Hue stays constant; the 8
// categorical slots walk L in an interleaved order (mid → dark → light → …)
// so adjacent series in a chart land on maximally-contrasting tones rather
// than a smooth gradient. Chroma is capped so endpoints stay in gamut.
//
// Positive/negative semantic hues stay independent of the anchor — green
// and red still need to read as "good" and "bad" regardless of brand.
export function monochrome(anchor: string): Palette {
  const { C, H } = parseOklch(anchor);
  const c = Math.min(C, 0.10).toFixed(3);
  const h = H.toFixed(1);
  const Ls = [0.50, 0.30, 0.70, 0.40, 0.80, 0.55, 0.35, 0.65];
  return {
    categorical: Ls.map((L) => `oklch(${L} ${c} ${h})`),
    positiveH: 150, positiveC: 0.06,
    negativeH: 25,  negativeC: 0.10,
  };
}

// `default` mirrors :root in theme.css so picking it explicitly is identical
// to picking nothing. Figma's UI preset / file-label colors.
const defaultPalette: Palette = {
  categorical: [
    "oklch(0.670 0.183 249.2)", // blue
    "oklch(0.796 0.163 68.8)",  // orange
    "oklch(0.868 0.169 89.8)",  // yellow
    "oklch(0.660 0.168 152.3)", // green
    "oklch(0.642 0.212 33.7)",  // red
    "oklch(0.598 0.254 298.0)", // violet
    "oklch(0.606 0.230 9.6)",   // pink
    "oklch(0.648 0.110 206.5)", // teal
  ],
  positiveH: 152, positiveC: 0.168,
  negativeH: 34,  negativeC: 0.212,
};

const monochromeStatic: Palette = {
  categorical: [
    "oklch(0.45 0.07 220)", "oklch(0.55 0.08 220)", "oklch(0.65 0.07 220)",
    "oklch(0.75 0.06 220)", "oklch(0.5 0.04 220)",  "oklch(0.6 0.05 220)",
    "oklch(0.7 0.04 220)",  "oklch(0.4 0.05 220)",
  ],
  positiveH: 200, positiveC: 0.05,
  negativeH: 30,  negativeC: 0.07,
};

const editorial: Palette = {
  categorical: [
    "oklch(0.55 0.14 230)",  "oklch(0.55 0.005 220)", "oklch(0.7 0.005 220)",
    "oklch(0.4 0.005 220)",  "oklch(0.8 0.005 220)",  "oklch(0.45 0.005 220)",
    "oklch(0.65 0.005 220)", "oklch(0.3 0.005 220)",
  ],
  positiveH: 150, positiveC: 0.08,
  negativeH: 25,  negativeC: 0.11,
};

const tableau10: Palette = {
  categorical: [
    "oklch(0.564 0.086 251.1)", "oklch(0.738 0.160 59.4)",
    "oklch(0.638 0.173 22.5)",  "oklch(0.734 0.067 189.6)",
    "oklch(0.642 0.137 141.3)", "oklch(0.844 0.148 93.1)",
    "oklch(0.647 0.085 337.2)", "oklch(0.798 0.117 13.5)",
  ],
  positiveH: 141, positiveC: 0.11,
  negativeH: 22,  negativeC: 0.14,
};

const okabeIto: Palette = {
  categorical: [
    "oklch(0.532 0.131 244.0)", "oklch(0.753 0.158 76.8)",
    "oklch(0.620 0.130 165.5)", "oklch(0.679 0.118 346.3)",
    "oklch(0.735 0.117 236.2)", "oklch(0.621 0.170 47.5)",
    "oklch(0.902 0.172 105.0)", "oklch(0.683 0.000 89.9)",
  ],
  positiveH: 165, positiveC: 0.11,
  negativeH: 47,  negativeC: 0.15,
};

const tolBright: Palette = {
  categorical: [
    "oklch(0.556 0.097 250.0)", "oklch(0.683 0.168 15.1)",
    "oklch(0.551 0.153 145.6)", "oklch(0.785 0.138 101.1)",
    "oklch(0.797 0.106 222.5)", "oklch(0.519 0.169 349.4)",
    "oklch(0.792 0.000 89.9)",  "oklch(0.000 0.000 89.9)",
  ],
  positiveH: 145, positiveC: 0.14,
  negativeH: 15,  negativeC: 0.17,
};

const tolMuted: Palette = {
  categorical: [
    "oklch(0.812 0.084 230.8)", "oklch(0.674 0.098 180.4)",
    "oklch(0.499 0.135 148.6)", "oklch(0.663 0.123 109.3)",
    "oklch(0.841 0.108 98.3)",  "oklch(0.635 0.130 11.0)",
    "oklch(0.432 0.145 354.5)", "oklch(0.553 0.167 334.6)",
  ],
  positiveH: 148, positiveC: 0.11,
  negativeH: 11,  negativeC: 0.13,
};

const ibmCarbon: Palette = {
  categorical: [
    "oklch(0.468 0.219 295.1)", "oklch(0.641 0.162 246.5)",
    "oklch(0.433 0.074 194.8)", "oklch(0.465 0.172 1.3)",
    "oklch(0.666 0.209 22.1)",  "oklch(0.527 0.141 148.3)",
    "oklch(0.645 0.132 85.2)",  "oklch(0.447 0.126 46.1)",
  ],
  positiveH: 148, positiveC: 0.12,
  negativeH: 22,  negativeC: 0.16,
};

const brewerSet1: Palette = {
  categorical: [
    "oklch(0.575 0.114 246.3)", "oklch(0.585 0.229 27.9)",
    "oklch(0.673 0.167 142.9)", "oklch(0.547 0.149 322.3)",
    "oklch(0.730 0.186 52.6)",  "oklch(0.541 0.121 47.9)",
    "oklch(0.753 0.159 348.8)", "oklch(0.683 0.000 89.9)",
  ],
  positiveH: 142, positiveC: 0.14,
  negativeH: 27,  negativeC: 0.18,
};

const brewerSet2: Palette = {
  categorical: [
    "oklch(0.749 0.099 170.8)", "oklch(0.755 0.147 41.5)",
    "oklch(0.707 0.067 266.1)", "oklch(0.748 0.132 343.3)",
    "oklch(0.821 0.169 127.3)", "oklch(0.892 0.173 95.2)",
    "oklch(0.837 0.073 76.8)",  "oklch(0.767 0.000 89.9)",
  ],
  positiveH: 127, positiveC: 0.10,
  negativeH: 343, negativeC: 0.11,
};

const brewerDark2: Palette = {
  categorical: [
    "oklch(0.623 0.122 166.7)", "oklch(0.629 0.173 47.0)",
    "oklch(0.578 0.102 286.2)", "oklch(0.619 0.232 356.2)",
    "oklch(0.657 0.173 132.5)", "oklch(0.775 0.159 83.5)",
    "oklch(0.600 0.115 77.5)",  "oklch(0.510 0.000 89.9)",
  ],
  positiveH: 132, positiveC: 0.13,
  negativeH: 47,  negativeC: 0.16,
};

const brewerPaired: Palette = {
  categorical: [
    "oklch(0.830 0.052 231.0)", "oklch(0.552 0.123 243.9)",
    "oklch(0.852 0.121 131.3)", "oklch(0.621 0.182 142.2)",
    "oklch(0.785 0.117 20.7)",  "oklch(0.583 0.228 27.9)",
    "oklch(0.845 0.121 72.0)",  "oklch(0.730 0.186 52.6)",
  ],
  positiveH: 142, positiveC: 0.14,
  negativeH: 27,  negativeC: 0.18,
};

const ft: Palette = {
  categorical: [
    "oklch(0.443 0.168 10.3)",  "oklch(0.445 0.130 253.5)",
    "oklch(0.518 0.086 205.5)", "oklch(0.420 0.103 149.4)",
    "oklch(0.551 0.116 74.8)",  "oklch(0.407 0.127 304.1)",
    "oklch(0.545 0.006 95.2)",  "oklch(0.285 0.018 266.3)",
  ],
  positiveH: 149, positiveC: 0.09,
  negativeH: 10,  negativeC: 0.12,
};

const bloomberg: Palette = {
  categorical: [
    "oklch(0.696 0.204 43.5)",  "oklch(0.865 0.177 90.4)",
    "oklch(0.713 0.149 233.7)", "oklch(0.740 0.197 151.4)",
    "oklch(0.656 0.235 13.3)",  "oklch(0.665 0.221 303.9)",
    "oklch(0.683 0.000 89.9)",  "oklch(1.000 0.000 89.9)",
  ],
  positiveH: 151, positiveC: 0.14,
  negativeH: 13,  negativeC: 0.17,
};

const nord: Palette = {
  categorical: [
    "oklch(0.594 0.077 254.0)", "oklch(0.697 0.059 248.7)",
    "oklch(0.775 0.062 217.5)", "oklch(0.763 0.048 194.5)",
    "oklch(0.606 0.121 15.3)",  "oklch(0.693 0.096 38.2)",
    "oklch(0.855 0.089 84.1)",  "oklch(0.768 0.075 131.1)",
  ],
  positiveH: 131, positiveC: 0.08,
  negativeH: 15,  negativeC: 0.11,
};

const monokai: Palette = {
  categorical: [
    "oklch(0.642 0.240 7.5)",   "oklch(0.827 0.108 212.0)",
    "oklch(0.841 0.204 127.3)", "oklch(0.767 0.168 62.4)",
    "oklch(0.701 0.181 298.1)", "oklch(0.879 0.125 103.2)",
    "oklch(0.977 0.008 106.5)", "oklch(0.547 0.029 97.4)",
  ],
  positiveH: 127, positiveC: 0.14,
  negativeH: 7,   negativeC: 0.17,
};

const rosePine: Palette = {
  categorical: [
    "oklch(0.629 0.066 210.1)", "oklch(0.696 0.106 23.0)",
    "oklch(0.755 0.146 69.7)",  "oklch(0.491 0.077 228.0)",
    "oklch(0.617 0.074 305.7)", "oklch(0.599 0.107 2.7)",
    "oklch(0.673 0.027 298.4)", "oklch(0.577 0.046 291.0)",
  ],
  positiveH: 200, positiveC: 0.07,
  negativeH: 23,  negativeC: 0.11,
};

const gruvbox: Palette = {
  categorical: [
    "oklch(0.576 0.066 199.5)", "oklch(0.765 0.158 110.8)",
    "oklch(0.832 0.159 83.0)",  "oklch(0.660 0.218 30.4)",
    "oklch(0.705 0.098 2.2)",   "oklch(0.756 0.108 137.7)",
    "oklch(0.731 0.182 51.7)",  "oklch(0.619 0.029 67.3)",
  ],
  positiveH: 110, positiveC: 0.13,
  negativeH: 30,  negativeC: 0.16,
};

const tokyoNight: Palette = {
  categorical: [
    "oklch(0.719 0.132 264.2)", "oklch(0.751 0.134 299.5)",
    "oklch(0.820 0.105 235.7)", "oklch(0.795 0.139 130.1)",
    "oklch(0.784 0.106 75.4)",  "oklch(0.723 0.159 10.3)",
    "oklch(0.787 0.137 50.6)",  "oklch(0.822 0.100 182.5)",
  ],
  positiveH: 130, positiveC: 0.11,
  negativeH: 10,  negativeC: 0.14,
};

const oneDark: Palette = {
  categorical: [
    "oklch(0.730 0.121 245.3)", "oklch(0.768 0.110 133.0)",
    "oklch(0.825 0.097 82.3)",  "oklch(0.671 0.145 17.0)",
    "oklch(0.694 0.164 318.2)", "oklch(0.723 0.092 206.3)",
    "oklch(0.727 0.095 63.8)",  "oklch(0.762 0.020 263.0)",
  ],
  positiveH: 133, positiveC: 0.10,
  negativeH: 17,  negativeC: 0.13,
};

const pastel: Palette = {
  categorical: [
    "oklch(0.854 0.056 222.9)", "oklch(0.716 0.099 297.3)",
    "oklch(0.856 0.082 354.5)", "oklch(0.989 0.058 107.4)",
    "oklch(0.895 0.060 170.9)", "oklch(0.913 0.053 56.0)",
    "oklch(0.935 0.051 124.3)", "oklch(0.855 0.040 274.4)",
  ],
  positiveH: 170, positiveC: 0.07,
  negativeH: 354, negativeC: 0.09,
};

const earth: Palette = {
  categorical: [
    "oklch(0.585 0.159 38.5)",  "oklch(0.797 0.088 63.8)",
    "oklch(0.676 0.077 150.9)", "oklch(0.559 0.066 75.6)",
    "oklch(0.451 0.022 75.1)",  "oklch(0.720 0.047 70.3)",
    "oklch(0.520 0.119 42.1)",  "oklch(0.386 0.027 130.5)",
  ],
  positiveH: 150, positiveC: 0.08,
  negativeH: 38,  negativeC: 0.14,
};

const jewel: Palette = {
  categorical: [
    "oklch(0.464 0.099 243.6)", "oklch(0.401 0.095 15.1)",
    "oklch(0.443 0.077 156.1)", "oklch(0.401 0.112 335.4)",
    "oklch(0.510 0.100 68.4)",  "oklch(0.459 0.081 169.3)",
    "oklch(0.360 0.077 356.4)", "oklch(0.344 0.109 293.3)",
  ],
  positiveH: 156, positiveC: 0.08,
  negativeH: 15,  negativeC: 0.11,
};

// Order here drives the order the example picker shows them in.
const PALETTE_REGISTRY = {
  default: defaultPalette,
  monochrome: monochromeStatic,
  editorial,
  "tableau-10": tableau10,
  "okabe-ito": okabeIto,
  "tol-bright": tolBright,
  "tol-muted": tolMuted,
  "ibm-carbon": ibmCarbon,
  "brewer-set1": brewerSet1,
  "brewer-set2": brewerSet2,
  "brewer-dark2": brewerDark2,
  "brewer-paired": brewerPaired,
  ft,
  bloomberg,
  nord,
  monokai,
  "rose-pine": rosePine,
  gruvbox,
  "tokyo-night": tokyoNight,
  "one-dark": oneDark,
  pastel,
  earth,
  jewel,
} as const;

// Public: registry typed as a partial record so `PALETTES[someString]`
// returns `Palette | undefined` without needing a type assertion at the
// call site. The literal-key type lives on `_PALETTE_REGISTRY` and drives
// the `PaletteName` union.
export const PALETTES: Readonly<Record<string, Palette>> = PALETTE_REGISTRY;

// Re-export the literal-typed registry under a private name so the
// `PaletteName` type in `types.ts` resolves to the literal union, not to
// `string`.
export { PALETTE_REGISTRY as _PALETTE_REGISTRY };

// Convenience export — the names in registration order. Useful for picker
// UIs and iteration. Filtered through a type predicate so it stays typed as
// the literal name union without a type assertion.
export const PALETTE_NAMES: readonly (keyof typeof PALETTE_REGISTRY)[] =
  Object.keys(PALETTE_REGISTRY).filter(isPaletteName);

function isPaletteName(name: string): name is keyof typeof PALETTE_REGISTRY {
  return name in PALETTE_REGISTRY;
}

// Serialize a structured Palette into the CSS var record components consume.
// Missing fields produce no entries (slots fall through to theme.css defaults).
// Diverging palettes also emit `div-low` / `div-mid` / `div-high` aliases so
// theme.css's `--eudonia-chart-div-low: var(--eudonia-chart-div-1)` style
// indirections keep resolving regardless of how many stops the consumer ships.
export function paletteToVars(palette: Palette): Record<string, string> {
  const vars: Record<string, string> = {};
  palette.categorical?.forEach((color, i) => {
    vars[`--eudonia-chart-cat-${i + 1}`] = color;
  });
  palette.sequential?.forEach((color, i) => {
    vars[`--eudonia-chart-seq-${i + 1}`] = color;
  });
  if (palette.diverging) {
    const stops = palette.diverging;
    stops.forEach((color, i) => {
      vars[`--eudonia-chart-div-${i + 1}`] = color;
    });
    if (stops.length >= 2) {
      vars["--eudonia-chart-div-low"] = stops[0]!;
      vars["--eudonia-chart-div-high"] = stops[stops.length - 1]!;
    }
    // Mid is only meaningful when there's an exact center.
    if (stops.length % 2 === 1 && stops.length >= 3) {
      const midIdx = (stops.length - 1) / 2;
      vars["--eudonia-chart-div-mid"] = stops[midIdx]!;
    }
  }
  if (palette.positiveH !== undefined) {
    vars["--eudonia-positive-h"] = String(palette.positiveH);
  }
  if (palette.positiveC !== undefined) {
    vars["--eudonia-positive-c"] = String(palette.positiveC);
  }
  if (palette.negativeH !== undefined) {
    vars["--eudonia-negative-h"] = String(palette.negativeH);
  }
  if (palette.negativeC !== undefined) {
    vars["--eudonia-negative-c"] = String(palette.negativeC);
  }
  return vars;
}
