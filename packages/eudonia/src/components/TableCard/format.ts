export type FormatKind = "number" | "currency" | "currency-compact" | "percent" | "compact";

export type Formatter = (value: number) => string;

// Intl.NumberFormatOptions plus an optional locale tag — pass this shape when
// the built-in `FormatKind` presets are too narrow (different currency, custom
// fraction digits, alternate locale).
export interface FormatOptions extends Intl.NumberFormatOptions {
  locale?: string | string[];
}

// `percent` formats percentage-point values: pass `12.5` to get "12.5%". This
// matches how analytical data is usually reported (already converted), not the
// ratio convention Intl uses with `style: "percent"`. Pass an explicit
// `FormatOptions` if you need the ratio behavior.
export type FormatSpec = FormatKind | Formatter | FormatOptions;

const numberFmt = new Intl.NumberFormat();
const currencyFmt = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});
const currencyCompactFmt = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const percentFmt = new Intl.NumberFormat(undefined, {
  style: "decimal",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const compactFmt = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

export function resolveFormatter(spec: FormatSpec | undefined): Formatter | null {
  if (spec === undefined) return null;
  if (typeof spec === "function") return spec;
  if (typeof spec === "string") {
    switch (spec) {
      case "number":
        return (v) => numberFmt.format(v);
      case "currency":
        return (v) => currencyFmt.format(v);
      case "currency-compact":
        return (v) => currencyCompactFmt.format(v);
      case "percent":
        return (v) => `${percentFmt.format(v)}%`;
      case "compact":
        return (v) => compactFmt.format(v);
    }
  }
  const { locale, ...options } = spec;
  const fmt = new Intl.NumberFormat(locale, options);
  return (v) => fmt.format(v);
}
