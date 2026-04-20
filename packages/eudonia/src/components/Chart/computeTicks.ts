import { measureText } from "./measureText";
import type { XScale, XTickValue, YScale } from "./scales";

export type TickAnchor = "start" | "middle" | "end";

export type TickDensity = "low" | "medium" | "high";

// Which endpoint(s) of the axis are guaranteed to keep their label when the
// stride widens. `start` and `end` give regular intervals and let the other
// endpoint drop if stride doesn't land on it (Observable Plot / Highcharts
// style). `both` force-anchors both ends and accepts an irregular trailing
// gap (Recharts' `preserveStartEnd`).
export type TickPreserve = "start" | "end" | "both";

export interface Tick<V> {
  value: V;
  label: string;
  position: number;
  anchor: TickAnchor;
}

interface LaidOutTick<V> extends Tick<V> {
  leftExt: number;
  rightExt: number;
}

// Target pixel-spacing per tick. Controls how many candidates the scale is
// asked to produce (or how many band-categories are kept) before measurement
// decides whether they fit. Y defaults are tighter because y-labels are single
// lines with no horizontal spread.
const X_BUDGETS: Record<TickDensity, number> = { low: 120, medium: 80, high: 50 };
const Y_BUDGETS: Record<TickDensity, number> = { low: 80, medium: 50, high: 35 };

const MIN_LABEL_GAP_PX = 4;

// Approximations of --eudonia-chart-label-size (0.7rem) used for canvas
// measurement. If consumers override the CSS var, pruning may be off by a few
// pixels. Good enough for v1.
const LABEL_FONT = "11.2px system-ui, -apple-system, sans-serif";
const LABEL_FONT_SIZE_PX = 11.2;

export function computeXTicks(
  scale: XScale,
  innerWidth: number,
  density: TickDensity,
  preserve: TickPreserve,
  anchorLabelsToEdges: boolean,
  preferredTickCount: number | undefined,
  tickFormat: (v: XTickValue) => string,
): Tick<XTickValue>[] {
  const target =
    preferredTickCount ??
    Math.max(1, Math.floor(innerWidth / X_BUDGETS[density]));

  const candidates = xCandidates(scale, target);
  const ends = anchorLabelsToEdges ? domainEnds(scale) : null;
  const laidOut = candidates.map<LaidOutTick<XTickValue>>(({ value, position }) => {
    const label = tickFormat(value);
    const anchor = ends ? edgeAnchor(value, ends) : "middle";
    const width = measureText(label, LABEL_FONT);
    return {
      value,
      label,
      position,
      anchor,
      leftExt: anchor === "middle" ? width / 2 : anchor === "end" ? width : 0,
      rightExt: anchor === "middle" ? width / 2 : anchor === "start" ? width : 0,
    };
  });

  return pruneToFit(laidOut, preserve, target).map(stripLayout);
}

export function computeYTicks(
  scale: YScale,
  innerHeight: number,
  density: TickDensity,
  preferredTickCount: number | undefined,
  tickFormat: (v: number) => string,
): Tick<number>[] {
  const target =
    preferredTickCount ??
    Math.max(1, Math.floor(innerHeight / Y_BUDGETS[density]));

  // Y-labels are all right-aligned to the axis; size-along-axis is line height.
  const half = LABEL_FONT_SIZE_PX / 2;
  const laidOut = scale.ticks(target).map<LaidOutTick<number>>((value) => ({
    value,
    label: tickFormat(value),
    position: scale(value) ?? NaN,
    anchor: "end",
    leftExt: half,
    rightExt: half,
  }));

  // Y force-preserves both endpoints: top/bottom ticks communicate the data
  // range, and Y doesn't have X's calendar-style directional preference.
  return pruneToFit(laidOut, "both", target).map(stripLayout);
}

function stripLayout<V>(t: LaidOutTick<V>): Tick<V> {
  return { value: t.value, label: t.label, position: t.position, anchor: t.anchor };
}

interface XCandidate {
  value: XTickValue;
  position: number;
}

function xCandidates(scale: XScale, target: number): XCandidate[] {
  switch (scale.kind) {
    case "band": {
      const half = scale.scale.bandwidth() / 2;
      return scale.scale.domain().map((value) => ({
        value,
        position: (scale.scale(value) ?? NaN) + half,
      }));
    }
    case "point":
      return scale.scale.domain().map((value) => ({
        value,
        position: scale.scale(value) ?? NaN,
      }));
    case "time":
      return scale.scale.ticks(target).map((value) => ({
        value,
        position: scale.scale(value) ?? NaN,
      }));
    case "linear":
      return scale.scale.ticks(target).map((value) => ({
        value,
        position: scale.scale(value) ?? NaN,
      }));
  }
}

interface DomainEnds {
  first: XTickValue | undefined;
  last: XTickValue | undefined;
}

function domainEnds(scale: XScale): DomainEnds {
  switch (scale.kind) {
    case "band":
    case "point": {
      const d = scale.scale.domain();
      return { first: d[0], last: d[d.length - 1] };
    }
    case "time": {
      const d = scale.scale.domain();
      return { first: d[0], last: d[d.length - 1] };
    }
    case "linear": {
      const d = scale.scale.domain();
      return { first: d[0], last: d[d.length - 1] };
    }
  }
}

// Flush anchors (`start`/`end`) only fire when a tick sits at the literal
// domain edge — Vega-Lite's `labelFlush` semantics. For band scales that means
// the first/last category; for time/linear it means the tick value equals the
// scale domain's min/max, which is rare unless the domain is authored that way.
function edgeAnchor(value: XTickValue, ends: DomainEnds): TickAnchor {
  if (ends.first !== undefined && sameValue(value, ends.first)) return "start";
  if (ends.last !== undefined && sameValue(value, ends.last)) return "end";
  return "middle";
}

function sameValue(a: XTickValue, b: XTickValue): boolean {
  if (a instanceof Date && b instanceof Date) return a.valueOf() === b.valueOf();
  return a === b;
}

// Picks a subset of ticks that doesn't overlap on screen by "striding" —
// keeping every nth tick and dropping the rest. We want the smallest stride
// that fits (subject to the target-count floor), so we show as many labels
// as possible without exceeding the requested count.
//
// The `target` parameter becomes a ceiling on tick count: stride is floored
// at `ceil(n / target)`. This is what lets `preferredTickCount` actually cap
// categorical axes where every domain value is a candidate.
//
// Naive approach: try stride 1, 2, 3, ... until one fits. For 500 categories
// that's up to 500 trials, each walking through its picks — O(n log n) total.
//
// Smarter approach (what this does): find the answer in two quick phases.
//
//   Phase 1 — exponential probe. Try strides minStride, 2*minStride, ...
//   Each failing trial doubles the stride, so we reach a fitting stride in
//   about log(n) steps. At that point the answer is in the interval
//   (lastFailedStride, firstFittingStride].
//
//   Phase 2 — binary search. Narrow that interval down to the smallest stride
//   that still fits. About another log(n) trials.
//
// Because the pick size shrinks as stride grows (n/stride items to check),
// the total work across all trials is O(n), not O(n log n).
//
// If no stride fits at all — labels wider than the entire chart — we fall
// back to showing just the endpoint(s) dictated by `preserve`. Better than
// nothing.
function pruneToFit<V>(
  ticks: readonly LaidOutTick<V>[],
  preserve: TickPreserve,
  target: number,
): LaidOutTick<V>[] {
  if (ticks.length <= 1) return [...ticks];

  const n = ticks.length;
  const minStride = Math.max(1, Math.ceil(n / Math.max(1, target)));
  // Seed lastFail so phase-2 binary search can't pick a stride below minStride.
  let lastFail = minStride - 1;
  let firstFit = 0;

  // Phase 1: double the stride until something fits, or we run out of ticks.
  for (let s = minStride; s <= n; ) {
    if (fitsAtStride(ticks, s, preserve)) {
      firstFit = s;
      break;
    }
    lastFail = s;
    if (s === n) break;
    // Cap at n so the loop always gets to test the biggest possible stride.
    s = Math.min(s * 2, n);
  }

  if (firstFit === 0) {
    // Even the widest stride overlapped — render endpoint(s) only.
    const first = ticks[0];
    const last = ticks[n - 1];
    switch (preserve) {
      case "start":
        return first ? [first] : [];
      case "end":
        return last ? [last] : [];
      case "both":
        if (!first || !last) return [];
        return first === last ? [first] : [first, last];
    }
  }

  // Phase 2: binary-search (lastFail, firstFit] for the tightest stride that
  // still fits. Invariant: `lo - 1` is known to fail; `hi` is known to fit.
  // Loop ends when lo === hi, which is the answer.
  let lo = lastFail + 1;
  let hi = firstFit;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (fitsAtStride(ticks, mid, preserve)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return stridedPick(ticks, lo, preserve);
}

function fitsAtStride<V>(
  ticks: readonly LaidOutTick<V>[],
  stride: number,
  preserve: TickPreserve,
): boolean {
  return fitsWithoutOverlap(stridedPick(ticks, stride, preserve));
}

function fitsWithoutOverlap<V>(ticks: readonly LaidOutTick<V>[]): boolean {
  let prev: LaidOutTick<V> | undefined;
  for (const curr of ticks) {
    if (prev) {
      const gap = Math.abs(curr.position - prev.position) - prev.rightExt - curr.leftExt;
      if (gap < MIN_LABEL_GAP_PX) return false;
    }
    prev = curr;
  }
  return true;
}

function stridedPick<V>(
  ticks: readonly LaidOutTick<V>[],
  stride: number,
  preserve: TickPreserve,
): LaidOutTick<V>[] {
  const n = ticks.length;
  const offset = preserve === "end" ? (n - 1) % stride : 0;
  const picked: LaidOutTick<V>[] = [];
  for (let i = offset; i < n; i += stride) {
    const t = ticks[i];
    if (t) picked.push(t);
  }
  if (preserve === "both") {
    const last = ticks[n - 1];
    if (last && picked[picked.length - 1] !== last) picked.push(last);
  }
  return picked;
}
