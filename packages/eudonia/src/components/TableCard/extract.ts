const PLACEHOLDERS = new Set(["", "-", "--", "—", "–", "N/A", "n/a", "NA", "?"]);

const NUMERIC_PATTERN = /^[$€£¥]?\s?-?\d[\d,]*(\.\d+)?\s?%?$/;

export function isPlaceholder(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return PLACEHOLDERS.has(value.trim());
  return false;
}

export function looksNumeric(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "string") return false;
  return NUMERIC_PATTERN.test(value.trim());
}

export function extractNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (PLACEHOLDERS.has(trimmed)) return null;
  if (!NUMERIC_PATTERN.test(trimmed)) return null;
  const stripped = trimmed.replace(/[$€£¥%,\s]/g, "");
  const n = Number.parseFloat(stripped);
  return Number.isFinite(n) ? n : null;
}

export function sniffNumericColumn(values: readonly unknown[]): boolean {
  for (const v of values) {
    if (isPlaceholder(v)) continue;
    return looksNumeric(v);
  }
  return false;
}
