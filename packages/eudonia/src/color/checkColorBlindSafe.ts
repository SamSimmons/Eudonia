import { differenceEuclidean, oklch as toOklch, parse, rgb as toRgb } from "culori";

// Pairwise threshold below which two simulated colors are considered
// confusable. Tuned against the canonical red/green pair under deuteranopia
// (which sims to ~0.05 ΔE in OKLab with the Machado 2009 matrices).
const DELTA_E_THRESHOLD = 0.06;

// Machado, Oliveira, Fernandes (2009) CVD simulation matrices at severity 1.0.
// Applied to sRGB values (gamma-corrected, NOT linear) — that is the form the
// authors derived. Source: "A Physiologically-based Model for Simulation of
// Color Vision Deficiency", IEEE TVCG 2009.
const CVD_MATRICES: Record<ColorVisionDeficiency, number[][]> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.011820, 0.042940, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.303900],
  ],
};

export type ColorVisionDeficiency = "protanopia" | "deuteranopia" | "tritanopia";

export interface ColorBlindConflict {
  // Indexes into the input palette array.
  a: number;
  b: number;
  // Which CVD simulation produced the collision.
  type: ColorVisionDeficiency;
  // OKLab ΔE between the two simulated colors. Lower = more confusable.
  deltaE: number;
}

export interface ColorBlindCheckResult {
  safe: boolean;
  conflicts: ColorBlindConflict[];
}

const oklabDistance = differenceEuclidean("oklab");


// Check a categorical palette for color-blind safety across the three common
// dichromacies. Returns conflicting pairs (if any) along with the simulation
// that produced the collision. Intended to be called from the consumer's test
// suite — eudonia does not warn at runtime.
//
// Example:
//   const result = checkColorBlindSafe(myPalette);
//   expect(result.safe).toBe(true);
export function checkColorBlindSafe(
  palette: readonly string[],
): ColorBlindCheckResult {
  const conflicts: ColorBlindConflict[] = [];
  const types: ColorVisionDeficiency[] = [
    "protanopia",
    "deuteranopia",
    "tritanopia",
  ];

  for (const type of types) {
    const simulated = palette.map((color) => simulate(color, type));
    for (let i = 0; i < simulated.length; i++) {
      for (let j = i + 1; j < simulated.length; j++) {
        const deltaE = oklabDistance(simulated[i]!, simulated[j]!);
        if (deltaE < DELTA_E_THRESHOLD) {
          conflicts.push({ a: i, b: j, type, deltaE });
        }
      }
    }
  }

  return { safe: conflicts.length === 0, conflicts };
}

interface OklchColor {
  mode: "oklch";
  l: number;
  c: number;
  h: number;
}

function simulate(input: string, type: ColorVisionDeficiency): OklchColor {
  const parsed = parse(input);
  if (!parsed) {
    throw new TypeError(`Invalid color: ${input}`);
  }
  // culori's `rgb()` produces gamma-encoded sRGB (the form Machado matrices
  // operate on). Out-of-gamut OKLCH colors can produce r/g/b outside [0,1];
  // clamp before and after the matrix.
  const srgb = toRgb(parsed);
  const r = clamp01(srgb.r);
  const g = clamp01(srgb.g);
  const b = clamp01(srgb.b);

  const m = CVD_MATRICES[type];
  const tr = clamp01(m[0]![0]! * r + m[0]![1]! * g + m[0]![2]! * b);
  const tg = clamp01(m[1]![0]! * r + m[1]![1]! * g + m[1]![2]! * b);
  const tb = clamp01(m[2]![0]! * r + m[2]![1]! * g + m[2]![2]! * b);

  const back = toOklch({ mode: "rgb", r: tr, g: tg, b: tb });
  return {
    mode: "oklch",
    l: back.l,
    c: back.c ?? 0,
    h: Number.isNaN(back.h ?? Number.NaN) ? 0 : (back.h ?? 0),
  };
}

function clamp01(c: number): number {
  return c < 0 ? 0 : c > 1 ? 1 : c;
}
