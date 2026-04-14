# Eudonia First Draft

## Working idea

Eudonia is a React chart library with the ambition of also functioning as a data visualization framework.

The core problem it addresses is familiar from real product work: teams can build strong dashboards and analytical screens with tools like `d3`, `visx`, and app-level layout code, but doing it well still takes too much bespoke effort. Layout, resizing, synchronized interactions, state coordination, annotations, indicators, and chart polish are often rebuilt per product.

This project aims to make that process dramatically easier without flattening everything into a generic chart-builder API.

## Product shape

The library should provide:

- Great low-level primitives that compose well.
- Higher-level polished components built from those primitives.
- Layout primitives focused on full-screen composition, bounded regions, flow layout, layered overlap, resizing, docking, and common analytical screen patterns.
- Chart primitives broad enough to eventually cover the practical surface area of `d3`.
- Support for maps, indicators, alerts, overlays, and drawing tools over time.
- Data adapter hooks so users can connect data from APIs, files, S3, Google Sheets, or their own systems.

The goal is not to force a single app architecture. It should work inside normal React applications and make custom analytical interfaces easier to build well.

## Positioning

This is not a publishing platform, embed platform, or Canva-style product.

Those ideas may exist later as products that are unlocked by this work, but they are out of scope here. This project is the engine and framework layer.

It is also not just "a set of chart types." The value should come from combining:

- Chart primitives
- Layout primitives
- Interaction primitives
- Annotation and drawing systems
- Indicators and analytical overlays
- Realtime and streaming-friendly behavior
- Strong visual defaults informed by serious data visualization and dashboard design literature

## Product philosophy

The library should make it easy for developers to stay in code while still producing interfaces that feel as thoughtful as specialist dataviz work.

The system should prefer composition over giant configuration objects, but it also needs enough polish and built-in behavior that teams do not have to rebuild the hard parts every time.

Escape hatches are essential. If a team needs to go custom, the system should help rather than fight them.

## Initial layout plan

The initial layout layer should stay concrete and small. Rather than starting from a large abstract layout system, the first exported primitives should cover the recurring layout needs that appear across the reference dashboards.

The initial layout primitives should be:

- `Screen` for full-viewport analytical screens with constrained overflow
- `Box` for a bounded rectangular region
- `Flex` for simplified flexbox-style flow layouts
- `Grid` for simplified grid-based dashboard and board layouts
- `Layer` for overlap and z-order composition
- `Split` for nested resizable panes in either direction
- `Dock` for user-driven layout reorganization, resizing, maximize behavior, and tabbed workspace patterns

These primitives should be enough to cover the ten dashboard reference variants without immediately introducing a larger pattern library.

They should stay close to browser layout behavior internally, but expose a simpler framework API rather than a full surface area of raw CSS props.

Two layout boundaries matter from the beginning:

- `Split` is authored pane layout
- `Dock` is runtime workspace behavior such as rearranging, swapping, maximizing, and tabbing

That distinction should help the layout system stay clear as it grows.

## Core categories

At the highest level, the system can be thought about in three broad categories:

- `Data`
- `Layout`
- `Scene`

These are broad planning categories, not a claim that each category should collapse into a single implementation unit.

### Data

This includes:

- source definitions
- fetched or loaded data
- canonical chart data
- transformed or normalized data
- derived data such as indicators, overlays, sampled windows, or alternative representations like Heikin Ashi

Examples from existing libraries:

- `Matplotlib` usually expects already-prepared vectors, arrays, or labeled columns passed into plotting calls.
- `Seaborn` works more semantically with dataset-shaped inputs and derives grouped or aggregated plotting data from them.
- `Plotly Express` takes dataset-shaped input and turns it into traces and figure state.
- `D3` usually leaves data shaping to the user and works with arrays, objects, joins, and explicit transforms.

### Layout

This includes:

- full-screen screen composition
- bounded layout regions
- flow and grid arrangement
- layered overlap and z-order
- pane sizing and resizing
- docked and reorganizable workspace structure
- chart bounding boxes
- drawable inner regions
- subplot or pane relationships
- space available to guides, legends, and axes

Examples from existing libraries:

- `Matplotlib` has a strong `Figure` and `Axes` model, including subplot layouts and grids.
- `Plotly` has explicit figure `layout`, subplot domains, and non-data spatial structure.
- `D3` usually leaves layout to the user, who defines margins, chart area, group transforms, and SVG regions directly.
- `Seaborn` often delegates final spatial structure to Matplotlib, especially for faceting and subplot arrangement.

### Scene

This is the composed analytical view that consumes data and layout and decides what actually appears and how it behaves.

This includes:

- domains and scales
- axes, guides, grids, legends, and labels
- marks and series rendering
- overlays and annotations
- hover, zoom, brush, crosshair, and other interaction behavior
- higher-level compositions like a price pane, indicator pane, or comparison view

Examples from existing libraries:

- `D3` splits scene concerns across scales, axes, shapes, and behaviors like zoom and brush.
- `Matplotlib` expresses scene-level composition through `Axes`, `Axis`, and `Artist` objects.
- `Seaborn` is useful here because its objects API breaks scene construction into `Plot`, `Mark`, `Stat`, and `Scale`.
- `Plotly` composes scenes from traces plus layout-managed guides, annotations, legends, and interaction settings.

## Common implementation abstractions

The recurring implementation problem in this space is not just rendering charts. Teams repeatedly end up building internal abstractions for composing, hosting, coordinating, and persisting analytical UI.

Common abstractions that Eudonia will likely need to think about:

- A panel runtime with stable identity, serializable config, lifecycle, and clear ownership of internal state.
- A host shell that can provide chrome, menus, badges, loading and error states, fullscreen behavior, and inspector-style affordances around hosted content.
- A layout model or pane tree so layout can exist as data rather than only as nested JSX.
- A query and transform runtime that is separate from visualization rendering.
- A variable and filter graph with scoping, dependencies, interpolation, and synchronization.
- An interaction bus for clicks, range selection, hover, drilldowns, linked views, and cross-component coordination.
- Serialization and migrations so saved analytical surfaces remain durable over time.
- Authoring helpers for insertion, replacement, resizing, reordering, and other edit-mode behavior.
- A registry model for panel types, layouts, or other extensible runtime pieces.
- Derived state and selector-style utilities for visible panels, active tabs, effective filters, time ranges, and loading states.

## State and data ideas

Early instincts worth exploring:

- `zustand` for library-managed interaction and coordination state
- `@tanstack/react-query` as an optional integration rather than a required data model
- adapter hooks for plugging in arbitrary data sources

The core should understand analytical UI concerns like transforms, updates, coordination, and stateful interaction without forcing a single backend or fetching strategy.

## Long-term ambition

The long-term ambition is depth, not just breadth.

The library should be capable of supporting:

- normal product dashboards
- advanced paneled charting experiences
- dense monitoring and operational screens
- newsroom or analytical storytelling patterns inside apps
- map-linked analytical views
- serious custom visualization work inside React products

## Companion docs

- [Dashboard Reference Variants](./dashboard-reference-variants.md) captures ten concrete dashboard and chart-layout patterns that should act as requirements for the layout system and future implementation fixtures.

## Open questions

- What are the right boundaries between charting, layout, and framework concerns?
- Which layout concepts should come from the browser, and which should become first-class library primitives?
- What interaction models deserve to be foundational from the beginning?
- Which existing open source projects are best reused directly, and where do we need our own abstractions?
