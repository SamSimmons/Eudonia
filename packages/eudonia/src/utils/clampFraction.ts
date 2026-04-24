// Clamps a number into the unit interval [0, 1]. Non-finite or negative inputs
// collapse to 0; values above 1 collapse to 1. Used wherever an author-supplied
// fraction (sub-bandwidth size, padding fraction, etc.) needs to be made safe
// before being fed to scale math.
export function clampFraction(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value > 1 ? 1 : value;
}
