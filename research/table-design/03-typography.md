# Typography for tables

A table is type with structure. Most table-design failures are typography failures: misaligned numbers, indistinguishable digits, headers that don't read as headers, decimals that wander, a footer that looks like a body row. This doc collects the typographic principles and conventions that make a table read well, drawing primarily from Robert Bringhurst's *Elements of Typographic Style*, Erik Spiekermann's *Stop Stealing Sheep*, and the contemporary practice of typeface designers who explicitly design for tabular composition (Matthew Carter, Christian Schwartz, Klim Type Foundry, Hoefler & Co., Commercial Type, Berton Hasebe).

## Tabular figures vs proportional figures

The single most consequential typographic decision for a table.

**Proportional figures** have variable widths optimized for prose — a `1` is narrower than an `8`. They look better in body text. They are catastrophic in a column of numbers, because vertical alignment fails: `111` is narrower than `888`, so the digits don't line up in adjacent rows.

**Tabular figures** have a uniform fixed width (each digit takes the same horizontal space). They look slightly worse in prose but make column alignment automatic.

Modern OpenType fonts often ship both, switchable via the CSS `font-variant-numeric: tabular-nums` property. Some fonts (especially older system fonts) ship only proportional; some monospace fonts are by definition tabular but trade typographic refinement for the alignment guarantee.

For a table component, **tabular figures must be the default for numeric cells**. Without them, decimal alignment is essentially impossible without manual padding tricks.

The eudonia codebase already enables tabular figures via the established CSS conventions; the table component should inherit this without exception in numeric columns.

## Lining vs old-style figures

A second numeric variant.

**Lining figures** sit on the baseline at uniform height, like uppercase letters. They are formal, technical, suit data and tables.

**Old-style figures** have ascenders and descenders, like lowercase letters (compare `1234567890` to its old-style equivalent where the `3, 4, 5, 7, 9` drop below the baseline and the `6, 8` rise above). They flow with prose and look less obtrusive in body text.

For tables: **lining figures are correct.** Old-style figures fight the alignment grid and the formal feel of tabular data. Use them in surrounding prose if the brand calls for it; not in the table.

The combination "tabular lining figures" is the table-typography default.

## Decimal alignment

Tabular figures get column alignment for free, but **decimal alignment** — making the decimal points line up vertically across rows of varying magnitudes — requires extra work.

`1,234.56`
`   12.34`
`    0.05`

The technical approaches:
- **CSS `font-variant-numeric: tabular-nums` plus right-alignment** works when all rows have the same number of decimal places.
- **Custom decimal alignment** requires either splitting the cell into integer / decimal halves, padding values to a uniform decimal width, or using browser features like `text-align: ".";` (still poorly supported).
- **Per-column decimal place enforcement** simplifies the problem: if every row in a column shows two decimals, simple right-alignment with tabular figures suffices.

The pragmatic stance: **enforce per-column decimal place consistency at format time.** That removes most of the decimal-alignment problem without exotic CSS. The table component should make this easy and signal when a value's underlying precision differs from the displayed precision.

## Operator characters

Numeric tables use a small set of non-digit characters that must look right:

- **Minus sign (−, U+2212)** — mathematical minus, slightly wider than a hyphen, the correct character for negative numbers. Most fonts ship it; many web layouts use a hyphen-minus (`-`) instead, which looks too short and breaks the visual rhythm of a number column.
- **Hyphen (-, U+002D)** — punctuation, should not appear in numeric cells unless it's a date separator or range indicator.
- **En dash (–, U+2013)** — used for ranges (`5–10`) and as a "no value" placeholder in some conventions.
- **Em dash (—, U+2014)** — narrative punctuation, rarely appears in tables.
- **Plus sign (+)** — sometimes prefixed to positive deltas (`+5.2%`). Should be the same width as the minus.
- **Percent sign (%)** — commonly attached to the value (`5%`) or set with a thin space (`5 %` is European convention).
- **Currency symbols ($, €, £, ¥)** — by convention placed before the number in some locales, after in others.
- **Multiplication (×, U+00D7)** — for "multi-stat" cells like `3×4` (matrix dimensions, ratios). Not the letter `x`.
- **Slash (/)** — fractions and ratios. Some fonts ship a true fraction slash (⁄, U+2044) that uses the font's fraction features.

The table component cannot control all consumer-supplied content but should default to using correct characters when it formats values itself (negative signs, percents, deltas).

## Header treatment

Headers must read as headers — clearly distinct from body data — without becoming visually heavy or chrome-laden.

Common approaches, ranked by typographic restraint:

1. **Slightly smaller, slightly bolder, slightly lighter color (gray instead of black).** The lightest-touch header. Reads as supporting metadata. Often combined with a thin rule below.
2. **Small caps with positive tracking.** A typographer's classical move. `REVENUE` set in small caps with letter-spacing reads as a header without visual weight. Requires a font that ships true small caps; CSS `font-variant: small-caps` is a fallback that synthesizes them less well.
3. **Uppercase with positive tracking.** Common on the web; works without small caps support. `REVENUE` with 0.05em tracking. Slightly more aggressive than small caps.
4. **Different (typically lighter) color, same case.** Used in modern web tables (Stripe, Linear). Subtle.
5. **Bolder weight than body.** Common but heavy. Use sparingly.

Avoid:
- Header backgrounds in saturated color.
- Headers in a different typeface (almost always a mistake).
- Headers in italic for body data (italic is for footnotes and emphasis).
- All-caps headers in body type size — too aggressive.
- Headers that look like body rows — readability fails.

The ideal: the eye reads the header once at the top, then ignores it while scanning body rows, then can return to it instantly when needed. A well-designed header receeds; a poor one competes.

## Header alignment

Headers should align with their column content:

- **Numeric column → right-aligned header.** "Revenue" sits at the right edge.
- **Text column → left-aligned header.** "Customer" sits at the left edge.

Designers sometimes resist this, wanting all headers centered for visual neatness. But alignment carries information; the header's edge position helps the reader scan to the column. Few makes this case explicitly; most modern design systems agree.

## Type color

"Color" here in the typographic sense — the perceived gray value of type on the page.

A well-designed table uses several values of gray (or several weights) to encode hierarchy without using hue:

- **Body data: dark, full strength** (typically near-black, e.g. `#1a1a1a`).
- **Header text: medium gray** (e.g. `#666`). Reads as supporting.
- **Footnote text: lighter gray** (e.g. `#888`). Even lighter; tertiary.
- **Disabled or null cells: very light gray** (e.g. `#bbb`). Almost invisible.
- **Total / footer text: same darkness as body, perhaps bolder.** Equal weight, structural distinction.

This palette — three or four levels of gray — does most of the hierarchy work in a well-designed table. Hue is reserved for encoding (status, threshold), not for differentiating layers of the same content.

## Vertical rhythm and row height

Rows should breathe. The recommended ratio:

- **Row height ≥ 1.4× type size** for compact tables.
- **Row height ~1.6× type size** for default / comfortable tables.
- **Row height ≥ 2× type size** for spacious / "luxury" tables (rare; suits low-density display contexts).

Type size for table body is typically 12–14px on screen, 9–11pt in print.

The vertical rhythm should be consistent across rows. Mixing row heights (because some rows have wrapped text) breaks scanning. Either:
- Truncate cells that would wrap (with hover-to-reveal).
- Allow wrapping but accept the broken rhythm (suitable for low-density tables with rich content).
- Set a fixed row height and overflow-hidden the cells (fast but lossy).

The choice depends on density priority. The eudonia table component should default to fixed row height with truncation (preserving rhythm) and make wrapping an explicit per-column option.

## Column padding and column width

- **Column padding: at least 1ch on each side** (about the width of a `0` digit). More is fine; less crowds.
- **Column width should fit the widest value comfortably**, not minimally. A column sized to the widest header but narrower than the widest cell forces truncation on every visit.
- **Numeric columns need only enough width for the format** — `$1,234,567.89` plus padding. Wider wastes space.
- **Identity columns (names, titles) tend to want more space** — these are prose-like and benefit from breathing room.
- **Auto-fit vs fixed widths.** Browsers' default `auto` table layout makes column widths data-dependent, which means column widths can shift between renders. `table-layout: fixed` makes columns predictable but requires explicit sizing.

For a dashboard table component, **predictable column widths** matter more than auto-fit cleverness. Consumers should be able to specify either explicit widths or relative weights (like CSS grid `1fr`, `2fr`).

## Font choice for tables

Not every otherwise-good typeface works in a table. The criteria:

- **Strong tabular figures** (designed, not synthesized).
- **Clear digit shapes** — `1` distinguishable from `7` and `l`; `0` distinguishable from `O`; `6` and `9` not too closed; `5` not confusable with `S`.
- **Slashed or dotted zero** option for contexts where `0` and `O` could be confused (financial, monospaced contexts especially).
- **Adequate contrast at small sizes** — table body type may be 11–13px on screen.
- **A weight range** so headers and totals can have weight differentiation without changing typeface.
- **Hinted screen rendering** — many display typefaces look soft at 12px; a typeface meant for tables holds up.

Modern typefaces with strong table credentials:

- **Inter** (free, popular default; tabular figures available).
- **IBM Plex Sans** (free, IBM corporate, excellent tabular features).
- **Söhne** (Klim Type Foundry — premium, used widely in modern dashboards; tabular and old-style both).
- **Tiempos** (Klim, serif — for editorial tables).
- **Equity** (MB Type, premium — designed for legal documents, exceptional table support).
- **Roobert**, **Sohne Mono**, **JetBrains Mono**, **IBM Plex Mono** — monospace options when monospaced columns are wanted.
- **Apple System (San Francisco)** — Apple's system font has strong tabular figures via OpenType features.

The table component should not bake in a typeface but should expect tabular figures to be enabled (via `font-variant-numeric: tabular-nums` in the component's stylesheet).

## Disambiguation features

In safety-critical or precision-critical contexts (finance, healthcare, scientific), digit confusion is an error mode worth designing against.

- **Slashed zero** (`0` with diagonal line through it) — distinguishes from uppercase `O`. Standard in code editors and financial applications. Available as OpenType `zero` feature in many fonts.
- **One with a serif top** (`1` with foot/flag) — distinguishes from lowercase `l`. Built into most well-designed typefaces.
- **Dotted zero** — alternative to slashed zero, common in some contexts (Asian fonts especially).
- **Stylistic alternates** in some fonts (like Inter) provide alternative shapes for ambiguous characters.

For a general-purpose table component, the slashed-zero and serif-1 are reasonable defaults to enable when the consumer's typeface supports them.

## Bringhurst's specific guidance

From Robert Bringhurst's *Elements of Typographic Style*, the chapter on tabular composition (extensively in the 2nd and 3rd editions):

- "**Tables should be set with the same care as text**, but with the additional discipline that vertical alignment requires."
- "**Avoid the use of rules** in tables wherever possible. Vertical rules should never be used. Horizontal rules, used at the top and bottom of a table and to separate body from totals, give it a clean appearance."
- "**Use tabular figures throughout**, including in headers."
- "**Set the figures so they align on the decimal**, even when the decimal is invisible (in integer columns, the implicit decimal aligns at the right edge)."
- "**Use small caps for table headings**, with positive tracking. Lowercase italic also works."
- "**Set units in italic** when they appear inline; in a header or column subhead, set them in roman lowercase."
- "**Don't repeat the same currency symbol on every row**; place it once at the top of the column."
- "**Distinguish totals through space, not necessarily through weight.** A blank row above a total often suffices."

Bringhurst's stance is consistent with Tufte's and Few's: minimal chrome, type-driven hierarchy, alignment as discipline.

## Spiekermann's guidance

From Erik Spiekermann's *Stop Stealing Sheep & Find Out How Type Works* and his work at MetaDesign / Edenspiekermann:

- "**Numbers must be set as numbers**, with tabular figures, on a baseline grid that they share with neighboring numbers."
- "**The most expensive part of a table is usually the white space**; spend it carefully."
- "**Headers should look like instructions**, not labels."
- Emphasis on the **role of the typeface**: a font designed for tables (FF Meta, FF Unit, the Spiekermann families) reads better than a generic sans-serif.
- "**Test your table at the size your reader will actually see it.**" Designing at 200% zoom on a Retina display deceives.

## Numeric readability research

Selected findings from the research literature on numeric perception (cited in Few and others):

- **Decimal-aligned columns are read 30-40% faster** than non-aligned columns of the same data (Few, citing his own studies and earlier perception work).
- **Tabular figures eliminate alignment errors** in scanning (multiple studies; Cleveland's perception research).
- **Magnitude estimation degrades** when numbers above a column threshold are abbreviated inconsistently (e.g. some rows show `1.2M` and others show `1,200,000`).
- **Color-coded magnitude** (heatmap) is read less precisely than position/length but faster for ordinal comparisons (Cleveland's graphical perception ranking).
- **Right-aligned numeric columns** are scanned top-to-bottom with the eye anchored on the rightmost digit; the eye uses this anchor to spot outliers in magnitude.
- **Negative numbers in red** are read more slowly than negative numbers with parentheses or minus signs, but the visual encoding is faster to spot. Trade-off: speed of *finding* a negative vs speed of *reading* one.

## Print vs screen

Tables on print and tables on screen have meaningfully different typographic constraints:

**Print:**
- Higher resolution; fine detail (hairline rules, small caps, italic) reads cleanly.
- Static; column widths and row heights are settled.
- Page-break aware; headers must repeat on each page.
- Typically larger format — full page tables can pack more.

**Screen:**
- Lower resolution; hairlines may disappear or blur.
- Variable size — desktop, tablet, phone; the same table may render at very different sizes.
- Zoom and accessibility scaling change relationships.
- Dynamic content and interaction overlay typographic concerns.

A table component for the web must be primarily designed for screen but should produce print-quality output when needed. Some refinements (small caps, hairline rules) work on print and approximately on screen; the component should not block them.

## Common typographic mistakes in dashboard tables

A short catalog of errors that show up repeatedly:

1. Using proportional figures in numeric columns. Decimals don't align; eye cannot scan.
2. Centering everything for "neatness." Loses alignment information.
3. Using a hyphen-minus for negative numbers. Looks too short.
4. Mixing precision within a column. Some rows show 2 decimals, some 0.
5. Tiny type to fit more rows. Loses readability for marginal density gain.
6. Bolding everything for emphasis. Loses emphasis.
7. Heavy header background fill. Looks like a 1995 spreadsheet.
8. All-caps headers in body text size. Aggressive and hard to scan.
9. Inconsistent currency formatting. Some rows show `$`, some don't.
10. Ambiguous abbreviations. `1.2M` (million? thousand-million? mega-?).
11. Tracking and spacing inconsistencies between header and body.
12. Overuse of italics. Italic reserved for emphasis; not headers, not body data.
13. Soft contrast (gray-on-gray) that fails at standard zoom or in low light.
14. Text wrapping that breaks row rhythm without consistency.
15. Truncation without indication (the cell looks full but isn't).

Most of these are invisible to the table's author and visible to its reader.

## Inferences for the eudonia table component

1. **Tabular figures enabled by default** in numeric cells. Non-negotiable.
2. **Lining figures** (not old-style) for body data.
3. **Per-column consistent precision** — the formatter enforces it.
4. **True minus sign** (U+2212) for negative numbers from the formatter.
5. **Right-align numbers; decimal-align via consistent precision; left-align text.**
6. **Header treatment via lighter gray + slight weight differentiation** by default; small caps as an opt-in.
7. **Header alignment matches column content alignment.**
8. **Three or four gray values for hierarchy** (header, body, footer, footnotes) — no hue to encode layer.
9. **Generous row height** (1.6× type by default; configurable).
10. **Fixed-width columns** with explicit or relative sizing; predictable layout.
11. **No vertical rules.** Horizontal rules only at structural boundaries.
12. **Slashed zero and serif 1** enabled when the typeface supports them.
13. **Truncation with hover-reveal** as default for over-wide content; wrapping as opt-in.
14. **The component does not bake in a typeface** but assumes the consumer has loaded one with proper tabular features.

## Bibliography

- Bringhurst, Robert. *The Elements of Typographic Style.* 4th ed. Hartley & Marks, 2013. Especially the chapter on tabular composition.
- Spiekermann, Erik, and E.M. Ginger. *Stop Stealing Sheep & Find Out How Type Works.* 3rd ed. Adobe Press, 2014.
- Cheng, Karen. *Designing Type.* 2nd ed. Yale University Press, 2020. On figure design and tabular features.
- Klim Type Foundry. *Söhne specimen and design notes.* klim.co.nz. On modern tabular figure design.
- Hoefler & Co. "Numbers" essay. typography.com. On lining vs old-style and tabular vs proportional.
- Schwartz, Christian, and Berton Hasebe. Various Commercial Type specimens and articles on typeface design for editorial / data contexts.
- W3C CSS Fonts Module Level 4. `font-variant-numeric` specification. The standard interface for tabular and lining figures.
- Strizver, Ilene. *Type Rules! The Designer's Guide to Professional Typography.* 4th ed. Wiley, 2013. On typographic conventions including tabular work.
- Microsoft Typography articles on OpenType features for tables.
