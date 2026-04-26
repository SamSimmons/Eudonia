# Color for dataviz — research

A focused research pass to inform the eudonia color/palette API.

## Goal

Make it stupid easy for a consumer to ship charts that respect the best practices from the dataviz canon (Tufte, Few, Cleveland, Bertin, Brewer, Crameri) **without having to know any of it**. A consumer should be able to:

1. Pass nothing → get fantastic-looking, color-blind-safe defaults.
2. Pass 1–2 brand anchors → get a full perceptually-uniform palette derived from their brand.
3. Pass raw colors → full control, no abstraction in the way.

The literature is firm on one principle (research/table/99): *the component must accept consumer-defined palettes; never bake in semantic colors.* But "accept" doesn't mean "require." Best-in-class means consumers shouldn't have to author 9 colors to get a great chart.

## Scope

- Color in dataviz literature (what makes a chart palette great)
- Perceptual constraints (uniformity, contrast, color-blind safety)
- Anchor-derivation patterns (how to generate palettes from 1–2 inputs)
- The OKLCH advantage for derivation
- Modern design-system color practices (what's been proven)
- Synthesis → eudonia API shape

## Out of scope

- Color theory primer (find a textbook).
- Brand color systems for eudonia itself.
- Specific hue/L/C values for the palettes — that's tuning, after API is settled.

## Docs

- [01-dataviz-canon.md](01-dataviz-canon.md) — Tufte, Few, Cleveland, Bertin, Brewer, Crameri on color in charts.
- [02-perceptual-constraints.md](02-perceptual-constraints.md) — OKLCH, perceptual uniformity, color-blind safety, WCAG.
- [03-derivation-patterns.md](03-derivation-patterns.md) — Radix Colors, Material Tonal, Apple HIG, Tailwind: how design systems generate palettes from anchors.
- [04-modern-libraries.md](04-modern-libraries.md) — d3-scale-chromatic, Observable Plot, Vega, Recharts, Tremor: how viz libs expose color.
- [99-synthesis.md](99-synthesis.md) — what eudonia should ship; API shape; defaults; open questions.

The synthesis (99) is the practical entry point.
