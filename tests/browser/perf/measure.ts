/**
 * Frame timing measurement utility.
 *
 * Runs a requestAnimationFrame loop and records the timestamp of each frame.
 * Exposes results on window.__eudonia_perf so Playwright can read them.
 */

export interface PerfResults {
  frames: number[];
  deltas: number[];
  stats: {
    count: number;
    median: number;
    p95: number;
    max: number;
    droppedFrames: number;
    longFrames: number;
  };
}

declare global {
  interface Window {
    __eudonia_perf: {
      start: () => void;
      stop: () => PerfResults;
      running: boolean;
    };
  }
}

function computeStats(deltas: number[]): PerfResults["stats"] {
  if (deltas.length === 0) {
    return { count: 0, median: 0, p95: 0, max: 0, droppedFrames: 0, longFrames: 0 };
  }

  const sorted = [...deltas].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)]!;
  const p95 = sorted[Math.floor(sorted.length * 0.95)]!;
  const max = sorted[sorted.length - 1]!;
  const droppedFrames = deltas.filter((d) => d > 33.34).length;
  const longFrames = deltas.filter((d) => d > 16.67).length;

  return {
    count: deltas.length,
    median: Math.round(median * 100) / 100,
    p95: Math.round(p95 * 100) / 100,
    max: Math.round(max * 100) / 100,
    droppedFrames,
    longFrames,
  };
}

export function installPerfMeasurement(): void {
  let frames: number[] = [];
  let rafId: number | null = null;

  function loop(timestamp: number) {
    frames.push(timestamp);
    rafId = requestAnimationFrame(loop);
  }

  window.__eudonia_perf = {
    running: false,

    start() {
      frames = [];
      this.running = true;
      rafId = requestAnimationFrame(loop);
    },

    stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      this.running = false;

      const deltas: number[] = [];
      for (let i = 1; i < frames.length; i++) {
        deltas.push(frames[i]! - frames[i - 1]!);
      }

      return { frames, deltas, stats: computeStats(deltas) };
    },
  };
}
