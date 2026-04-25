# Modern web-table design

The contemporary practice of designing tables for web applications. Less canonical than Tufte or Few — the references here are blog posts, design system docs, and the implicit conventions of well-regarded products (Stripe, Linear, Notion, Airtable, Vercel, Resend, Plaid). The body of work crystallized in the late 2010s and continues to evolve.

The two most-cited starting points: Andrew Coyle's "Design Better Data Tables" (Medium, 2018; widely referenced) and Alberta Soranzo & Dave Cooksey's "Designing The Perfect Data Table" (Smashing Magazine, 2019). Beyond those, the design system documentation from Material Design, Atlassian, IBM Carbon, Shopify Polaris, Salesforce Lightning, and Ant Design constitutes the de facto standard reference.

## The core position: tables are interfaces

Modern web tables are not just displays of data — they are interfaces through which users do work. This shifts the design priorities relative to print or static display:

- Hover states matter.
- Focus states matter.
- Interaction affordances (sort, filter, action) need to be discoverable but not overwhelming.
- Loading, empty, and error states are part of the design.
- Responsive behavior across viewport sizes is part of the design.
- Animation is part of the design (subtle, purposeful).

Tufte and Few wrote primarily about static tables on paper. The web-table writing is what fills the gap.

## Andrew Coyle, "Design Better Data Tables" (2018)

Coyle's piece consolidated a set of patterns that were already common but unnamed. The key claims:

### Style fundamentals
- **Choose a comfortable line height** — too tight is unreadable; too loose wastes space. A sweet spot around 1.5× type size.
- **Right-align numerical columns**, left-align text columns.
- **Use tabular figures.**
- **Limit color use** to status, action affordances, and accents.
- **Use subtle dividers** — typically light gray horizontal rules between rows, no vertical rules.

### Density and customization
- **Offer multiple density modes** — compact, comfortable, spacious. Let the user choose based on how much they want to see at once.
- **Allow column customization** — show/hide, reorder, resize.
- **Save user preferences** so the table opens the same way next time.

### Pagination vs infinite scroll vs load-more
- **Pagination** for predictable navigation, browsing.
- **Infinite scroll** for read-only consumption (less suitable for action-oriented tables).
- **Load more** as a hybrid; user controls the loading.
- **Virtualization** for very large datasets; renders only visible rows.

The piece didn't take strong stances on which to use; it laid out the trade-offs.

### Resizable columns
- **Allow horizontal resizing** when columns vary in width or content length is unpredictable.
- **Provide a sensible default width** so the table is usable before the user touches anything.
- **Persist column widths** across sessions.

### Filters and search
- **A search bar above the table** is the simplest entry point.
- **Per-column filters** for power users; usually accessed via a header dropdown.
- **Filter chips** showing what's currently applied, with one-click removal.

### Inline actions
- **Row hover reveals action buttons** (edit, delete, more).
- **Bulk actions appear when rows are selected**; appear in a sticky bar above the table.
- **Avoid putting actions in a separate column** unless they're always-visible critical actions.

### Sorting
- **Click header to sort.** Click again to reverse. Click a third time to clear sort (optional).
- **Indicate sort direction** with an arrow icon; indicate active sort column visually.
- **Show only one active sort by default**; multi-column sort is a power feature.

The Coyle piece is short on theory but high on convention-codification. It's now the lingua franca for modern data table interaction.

## Alberta Soranzo & Dave Cooksey, "Designing The Perfect Data Table" (2019)

The Smashing Magazine piece extends Coyle with deeper attention to use case and accessibility.

### Identifying the use case
The piece argues that table design must start from "what is the user doing here":
- **Reading and comparing** specific values (default).
- **Looking up** a single value.
- **Sorting and filtering** to surface a subset.
- **Bulk editing** values across many rows.
- **Acting on** individual rows.

Each use case shifts the design — column count, sort affordances, action placement, density.

### Hierarchy and visual cues
- **Establish hierarchy via type weight, color, and spacing** — not via heavy chrome.
- **Use subtle row hover** to reinforce the row as the unit of interaction.
- **Use a slightly stronger highlight on row selection.**
- **Reserve color for meaning** — status, alert, brand accent for action.

### Accessibility
- **Use proper semantic markup** — `<table>`, `<thead>`, `<tbody>`, `<th>` with `scope` attributes. (More specific than the canonical Tufte/Few literature, which is medium-agnostic.)
- **Sortable columns must announce their state** to assistive tech (`aria-sort` attribute).
- **Selection state must be announced** for bulk actions.
- **Keyboard navigation** — tab through actions, arrow keys for spreadsheet-like grids (when applicable).
- **Color cannot be the only encoding** — pair status color with text or icon.
- **Sufficient contrast** for all text and chrome.

### Mobile and responsive behavior
The piece is explicit about the choices:
- **Horizontal scroll** with sticky first column. Best for wide tables; preserves the table format.
- **Collapsed cards** — each row becomes a card with key fields. Best for action-heavy tables on mobile.
- **Truncated columns with expand-to-detail** — show only the most important columns; tap row to see all.
- **Different mobile layout entirely** — sometimes a list view replaces the table. Most pragmatic for very small screens.

The choice depends on the use case; there is no universal answer.

## Refactoring UI (Wathan & Schoger, 2018)

The Refactoring UI book has a section on data table design that synthesizes much of the modern web aesthetic:

- **De-emphasize what doesn't matter.** Headers can be lighter than body text — they're navigational, not informational.
- **Don't try to differentiate everything.** If most cells are equally important, treat them equally.
- **Use weight, color, and size for hierarchy** — not borders.
- **Right-align numbers.** Left-align text. (Echoes the universal stance.)
- **Avoid heavy zebra striping.** A subtle alternating row background is fine; high-contrast banding is visually noisy.
- **Use color sparingly for status and actions.**
- **Negative space carries information** — it tells the eye where one section ends and another begins.

Refactoring UI is design-system agnostic but the aesthetic is clearly the "Stripe-Linear-Notion" school: tasteful neutrals, restrained color, careful type, hover states that feel right.

## Vitaly Friedman / Smashing Magazine

Friedman has written extensively on table UX patterns. The recurring themes:

### Sticky elements
- **Sticky header** — mandatory for tables that scroll vertically beyond a screenful.
- **Sticky first column** — for wide tables that scroll horizontally.
- **Sticky filter bar / action bar** — keeps controls accessible during scroll.
- **Sticky footer** — for tables where the totals row matters as much as the body.

### Inline editing
- **Click cell to edit.** The cell becomes an input.
- **Tab to move to the next editable cell.** Enter to commit, Esc to cancel.
- **Visual feedback** that the cell is dirty (changed but not committed) and that the change saved.
- **Validation inline.** Errors appear next to the cell, not in a modal.

### Loading states
- **Skeleton rows** while loading. Match the row height and approximate the column structure.
- **Progressive loading** — show what arrives first, fill in the rest as it streams.
- **Spinner only as a last resort** — for fast loads, no spinner; for unknown loads, skeleton; for very slow operations, spinner with progress.

### Empty states
- **A default "no data" state** that explains why the table is empty and what to do.
- **A filter-empty state** distinguishes from "no data exists" — "no rows match your filter, clear filter to see all rows."
- **A first-use empty state** can include a call to action (add your first row, import from CSV).

### Error states
- **Per-row errors** — if loading data for some rows fails, show the rows that loaded with an error indicator on the failed ones.
- **Whole-table errors** — clear messaging plus a retry action.

## Design system table guidelines

The major design systems converge on a core set of conventions and diverge on details. Worth surveying:

### Material Design (Google)
- Clear separation between "data tables" (interactive) and "data grids" (heavier, spreadsheet-like).
- Density: standard, dense, very dense.
- Sortable columns marked with arrow icons.
- Row selection via checkboxes (left column).
- Bulk action bar appears on selection.
- Pagination at footer with rows-per-page control.
- Row hover state subtle.

### Atlassian Design System
- Tables sized to content, not stretched to fill container.
- Sortable columns with caret icons.
- Row hover state explicit.
- Inline actions in row-end column or via row hover.
- Truncation with tooltip on hover for over-long content.
- Empty state pattern with illustration and CTA.

### IBM Carbon
- Several table sizes (xs, sm, md, lg, xl).
- Heavy attention to accessibility — keyboard nav, aria attributes, color contrast.
- Toolbar above table for global actions and search.
- Filter as a separate panel or inline chips.
- Pagination with rows-per-page.
- Sticky header optional.
- Row expansion for nested detail.
- Selection via checkboxes; bulk action bar.

### Shopify Polaris
- Tables designed for merchant workflows (commerce-flavored).
- Image columns first-class (product thumbnails).
- Bulk actions and selection.
- Sortable, filterable.
- Loading states with skeleton rows.
- Empty states with merchant-relevant CTAs.
- Mobile: collapse to card list with key fields.

### Salesforce Lightning Design System (SLDS)
- Multiple table variants — basic, striped, bordered, no-row-borders.
- Inline edit support deeply integrated (CRM workflows demand it).
- Row actions in "Show more" menu and direct buttons.
- Resizable columns, reorderable.
- Sticky header.
- Heavy attention to keyboard navigation and accessibility.

### Ant Design
- Comprehensive table component with many features baked in.
- Sort, filter, group, expand all built-in.
- Inline edit, row selection, bulk actions.
- Pagination with several styles.
- Tree-data support.
- Expandable rows.
- Fixed columns (left and right).

### Mantine, Chakra, MUI
- Smaller in surface than Ant Design but cover the core patterns.
- MUI X Data Grid is the most full-featured commercial open-source option.
- Mantine and Chakra typically wrap a TanStack-style headless library or expose minimal styled primitives.

### Stripe and Linear (no public design system docs)
Neither publishes formal design system documentation but their products are widely studied:

**Stripe Dashboard tables:**
- Very restrained — minimal chrome, generous spacing.
- Right-aligned numerics; left-aligned text.
- Subtle row hover; no zebra striping.
- Status pills with low-saturation backgrounds.
- Sticky header on scroll.
- Filter bar above table; chips show active filters.
- Row click navigates; never has hover-reveal action buttons by default.
- Mobile: card list with key fields.

**Linear:**
- Even more restrained — almost no chrome.
- Issue list is the canonical "table-as-list."
- Hover reveals actions; keyboard shortcuts are first-class.
- Inline edit common.
- Status pill cells, assignee avatar cells, label cells.
- Saved views central.

**Vercel and Resend:**
- Modern aesthetic — narrow tables, plenty of white space.
- Status pill cells, action menus per row.
- Often paired with chart tiles in the same dashboard.
- Mobile: usually horizontal scroll with sticky first column.

## Cross-cutting modern conventions

The patterns that recur across nearly all of the above:

### Visual chrome — keep it light
- No vertical rules.
- Subtle horizontal rules between rows or none at all.
- Thin rule below header.
- Generous padding.
- White or near-white background.
- Dark mode support is expected.

### Hover and focus states
- **Row hover**: subtle background tint (a few percent of black or accent).
- **Row focus**: more pronounced, often a border or higher-saturation background.
- **Cell hover**: less common — usually action affordances appear at the row level.
- **Sortable header hover**: slight color or icon change.
- **Action button hover**: standard button hover.

### Selection
- **Checkbox column on the far left** for bulk selection.
- **Header checkbox** to select all visible.
- **Selection count** shown ("3 selected") with bulk action bar.
- **Click row body to select** (alternative to checkbox-only) — depends on whether row click should navigate or select.

### Action placement
- **Always-visible per-row actions**: a column at the right with icon buttons (edit, delete, more).
- **Hover-reveal per-row actions**: same buttons but only visible on row hover. Cleaner default state.
- **Row context menu**: right-click for power users.
- **Bulk action bar**: appears on selection, sticky above the table.
- **Keyboard shortcuts**: power-user feature, common in Linear, Notion, Stripe.

### Sort affordances
- **Sortable header marked subtly** — usually with a sort icon (caret, arrow).
- **Active sort column has a clear indicator** — direction arrow, color, weight.
- **Click to toggle**: ascending → descending → no sort (or just toggle).
- **Multi-column sort**: power feature; usually shift-click or via a dedicated "sort" menu.

### Filter affordances
- **Global search**: text input above the table.
- **Filter chips**: each active filter is a removable chip.
- **Per-column filters**: dropdown or popover from header.
- **Saved filters / saved views**: power feature, common in CRM and BI contexts.

### Density tiers
- **Compact**: tight rows, small type, minimal padding. For high-density inspection.
- **Comfortable** (default): moderate spacing, body type.
- **Spacious**: generous spacing, larger touch targets. Better for mobile/tablet.

### Loading
- **Skeleton rows** that match the column structure.
- **Skeleton matches row count** for tables with known size; flexible count for unknown.
- **Streaming load** for large data — show what's arrived.

### Empty
- **No-data state** with illustration or icon, message, CTA.
- **No-results-after-filter state** — distinct from no-data; offers "clear filter."
- **Loading vs empty distinction** — never let a slow load look like an empty table.

### Error
- **Per-row error indicators** — small icon in row.
- **Whole-table error** — message with retry.
- **Inline edit errors** — tooltip or message next to the offending cell.

### Mobile
- **Horizontal scroll with sticky first column** — preserves table-ness.
- **Card list collapse** — each row becomes a card with stacked key fields.
- **Hide-low-priority columns** — show only top 2-3 on mobile, expand for full.
- **Tap to expand row** — show all fields inline.

### Animation
- **Subtle row insertion / removal animations** when data updates.
- **Smooth sort transitions** — not always done; can be distracting.
- **Loading skeleton fades** on data arrival.
- **Hover state transitions** — quick (~150ms) ease-out.
- **Don't animate everything** — restraint is the rule.

## Status and badge conventions

A subtype of cell that's matured into convention:

- **Status pill** — text in a colored, rounded container. Color encodes status (green=ok, yellow=warning, red=error, blue=info, gray=neutral).
- **Background tint with darker text**, OR **outlined pill with colored text**, OR **solid colored pill with white text**. Choice depends on aesthetic; outlined is most restrained.
- **Icon + text** for emphasis (warning triangle + "Failed").
- **Icon only** for very compact contexts (status icon column).
- **Tooltip on hover** for additional context (when did this become this status, by whom).

## Avatar conventions

- **Single avatar with name** — most common identity column treatment.
- **Stacked avatars** for multi-owner cells (with overflow `+N` indicator).
- **Avatar only** in compact contexts.
- **Initials fallback** when no photo (colored background + monogram).
- **Clickable to user profile** — universal expectation.

## What modern tables get right that older designs got wrong

- **Better typography** — tabular figures by default, considered hierarchy, restraint with weight.
- **Subtle hover and focus states** that feel responsive without distracting.
- **Status as first-class** — pills, badges, color encodings designed in, not added.
- **Loading and empty states** taken seriously.
- **Mobile is designed for**, not retrofitted.
- **Accessibility is part of the spec**, not an audit afterthought.
- **Saved views and personalization** for user-owned workflows.
- **Restrained color** — encoding, not decoration.

## What modern tables still get wrong

- **Excessive features in default state** — Ant Design's table can do almost anything but the out-of-box look is busy.
- **Inconsistent dark mode** — many tables look great in light mode and broken in dark.
- **Mobile collapse choices** that lose information without warning.
- **Inline edit** that doesn't make commit/cancel obvious.
- **Bulk action bars** that scroll out of view, leaving users wondering what they selected.
- **Sticky elements** that compute position incorrectly on resize or zoom.
- **Performance** at large row counts — even virtualized tables often have visible jank.
- **Accessibility** that meets the letter but not the spirit (technically labeled but unusable with a screen reader).
- **Color systems** that work for the brand but not for status semantics (a pink primary brand color doesn't mean "error").

## Inferences for the eudonia table component

1. **Subtle hover state** on rows, fast transition (~150ms ease-out).
2. **Click row to navigate / drill** as the default; selection via explicit checkbox.
3. **Status pill cell** as a first-class cell type — outlined or background-tinted, with text + optional icon.
4. **Sort affordance** in the header; arrow icon, click-to-toggle.
5. **Sticky header** as an opt-in for tall tables.
6. **Sticky first column** as an opt-in for wide tables.
7. **Loading skeleton rows** that match the table's column structure.
8. **Empty state slot** with sensible defaults.
9. **Mobile collapse** — at minimum, horizontal scroll with sticky first column. Card collapse as a future enhancement.
10. **Density tier** as a token (compact / comfortable / spacious), default comfortable.
11. **Avatar + name** identity treatment is well-supported.
12. **Action column or hover-reveal actions** as available patterns; consumer chooses.
13. **Keyboard navigation** for accessibility (tab through interactive elements; arrow keys deferred to power-user contexts).
14. **Dark mode parity from day one.** Status colors must work in both.
15. **Don't bake in features that compete with TanStack** — sort, filter, group are TanStack's job; the table component renders the result.

## Bibliography

- Coyle, Andrew. "Design Better Data Tables." Medium, 2018.
- Soranzo, Alberta, and Dave Cooksey. "Designing The Perfect Data Table." Smashing Magazine, 2019.
- Wathan, Adam, and Steve Schoger. *Refactoring UI.* Self-published, 2018. Section on tables.
- Friedman, Vitaly. Various Smashing Magazine articles on data table UX, including "Data Tables Design Patterns" series.
- Material Design 3 Documentation. Data tables. m3.material.io.
- Atlassian Design System. Tables. atlassian.design.
- IBM Carbon Design System. Data table. carbondesignsystem.com.
- Shopify Polaris. Data table. polaris.shopify.com.
- Salesforce Lightning Design System. Data tables. lightningdesignsystem.com.
- Ant Design. Table. ant.design.
- Apple Human Interface Guidelines. Tables. developer.apple.com/design/human-interface-guidelines.
- Linear's product. linear.app — implicit reference.
- Stripe Dashboard. stripe.com/dashboard — implicit reference.
- Notion's database views. notion.so — implicit reference.
- Airtable. airtable.com — implicit reference.
- Plaid Dashboard, Resend, Vercel — additional implicit references for the modern aesthetic.
