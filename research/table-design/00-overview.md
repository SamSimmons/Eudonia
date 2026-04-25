# Table design literature

A complement to the per-domain product research in `research/table/`. That work asked *what tables exist and what they need to do*; this work asks *what makes a table excellent from a design point of view*.

Goal: capture the design principles, conventions, and craft expectations that a well-made table component should respect, drawn from canonical dataviz literature, typography, and contemporary web-table design writing.

## Scope

Six docs:

- [Edward Tufte](01-tufte.md) — data-ink, sparklines, supertable, layering, the shrink principle, the table-vs-graphic stance.
- [Stephen Few](02-few.md) — *Show Me the Numbers* and *Information Dashboard Design* on table structure, alignment, when-to-table-vs-chart, summary hierarchies.
- [Typography for tables](03-typography.md) — Bringhurst, Spiekermann, tabular figures, decimal alignment, operator characters, header treatment, numeric readability.
- [Modern web-table design](04-modern-web-tables.md) — Coyle, Soranzo & Cooksey, Refactoring UI, Friedman, design system table guidelines (Material, Atlassian, Carbon, Polaris, Salesforce, Ant).
- [Best practices synthesis](99-best-practices.md) — what makes a table excellent. Folds in Bertin's matrix theory and Cleveland's perception research as cited sections rather than separate docs.

## Out of scope

- Engineering / implementation. This is a design lens.
- Component decomposition or API design.
- Domain-specific concerns already covered in `research/table/`.
- Choosing a specific design language for eudonia — that's a separate decision.

## Use

The synthesis (99) is the practical entry point. The four source docs are reference material backing the synthesis claims. Tufte and Few are deliberately quoted/paraphrased in detail because their specific positions on tables are often misremembered or reduced to slogans.
