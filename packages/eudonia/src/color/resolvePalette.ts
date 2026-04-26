import { PALETTES, paletteToVars } from "./palettes";
import type {
  DerivedPalette,
  Palette,
  PalettePartial,
  PaletteProp,
} from "./types";

export interface ResolvedPalette {
  // CSS variable assignments to merge into the host's `style`. Named palettes,
  // structured Palette objects, derived palettes (`defineXxx`), raw arrays,
  // and partial overrides all funnel through this single field.
  style?: Record<string, string>;
}

type PaletteKind = "categorical" | "sequential" | "diverging";

const KIND_PREFIX: Record<PaletteKind, "cat" | "seq" | "div"> = {
  categorical: "cat",
  sequential: "seq",
  diverging: "div",
};

// Turn a `palette=` prop into the inline-style object the host component
// should apply. Components compose this once and spread the result onto
// their root element.
export function resolvePalette(
  palette: PaletteProp | undefined,
): ResolvedPalette {
  if (palette == null) return {};

  if (typeof palette === "string") {
    return { style: paletteToVars(lookupNamedPalette(palette)) };
  }

  if (isReadonlyStringArray(palette)) {
    return { style: rawArrayVars(palette, "cat") };
  }

  if (isDerivedPalette(palette)) {
    return { style: { ...palette.vars } };
  }

  // PalettePartial vs structured Palette: a partial has at least one kind
  // field whose value is a string (PaletteName) or a DerivedPalette object.
  // A structured Palette's kind fields are flat string arrays.
  if (isPalettePartial(palette)) {
    return { style: resolvePartial(palette) };
  }

  return { style: paletteToVars(palette) };
}

function resolvePartial(palette: PalettePartial): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const kind of ["categorical", "sequential", "diverging"] as const) {
    const sub = palette[kind];
    if (sub === undefined) continue;
    if (typeof sub === "string") {
      const named = lookupNamedPalette(sub, kind);
      const colors = named[kind];
      if (colors === undefined) {
        throw new TypeError(
          `Palette "${sub}" does not define a ${kind} ramp.`,
        );
      }
      Object.assign(merged, rawArrayVars(colors, KIND_PREFIX[kind]));
    } else if (Array.isArray(sub)) {
      Object.assign(merged, rawArrayVars(sub, KIND_PREFIX[kind]));
    } else if (isDerivedPalette(sub)) {
      Object.assign(merged, sub.vars);
    }
  }
  return merged;
}

function lookupNamedPalette(name: string, kind?: PaletteKind): Palette {
  const named = PALETTES[name];
  if (!named) {
    const where = kind === undefined ? "" : ` in palette.${kind}`;
    throw new TypeError(
      `Unknown palette name: "${name}"${where}. Use one of: ${Object.keys(PALETTES).join(", ")}.`,
    );
  }
  return named;
}

function rawArrayVars(
  colors: readonly string[],
  prefix: "cat" | "seq" | "div",
): Record<string, string> {
  const vars: Record<string, string> = {};
  colors.forEach((color, i) => {
    vars[`--eudonia-chart-${prefix}-${i + 1}`] = color;
  });
  if (prefix === "div" && colors.length >= 2) {
    vars["--eudonia-chart-div-low"] = colors[0]!;
    vars["--eudonia-chart-div-high"] = colors[colors.length - 1]!;
    if (colors.length % 2 === 1 && colors.length >= 3) {
      vars["--eudonia-chart-div-mid"] = colors[(colors.length - 1) / 2]!;
    }
  }
  return vars;
}

function isDerivedPalette(value: object): value is DerivedPalette {
  if (!("vars" in value)) return false;
  const v = value.vars;
  return typeof v === "object" && v !== null;
}

// A PalettePartial has at least one kind field that is *not* a flat string
// array — i.e. a PaletteName string or a DerivedPalette. If every kind field
// is either absent or a flat array, the value is a structured Palette.
function isPalettePartial(value: object): value is PalettePartial {
  for (const kind of ["categorical", "sequential", "diverging"] as const) {
    if (!hasKey(value, kind)) continue;
    const sub = value[kind];
    if (typeof sub === "string") return true;
    if (sub !== null && typeof sub === "object" && !Array.isArray(sub)) {
      return true;
    }
  }
  return false;
}

// Type-predicate `in` check that narrows the value to expose the field as
// `unknown`. Lets us read polymorphic shapes without using `as` assertions.
function hasKey<K extends string>(
  obj: object,
  key: K,
): obj is object & Record<K, unknown> {
  return key in obj;
}

// Custom predicate so `readonly string[]` is narrowed *out* in the negative
// branch — `Array.isArray` returns `value is any[]`, which doesn't subtract
// readonly arrays from a wider union and forces a type assertion downstream.
function isReadonlyStringArray(value: unknown): value is readonly string[] {
  return Array.isArray(value);
}
