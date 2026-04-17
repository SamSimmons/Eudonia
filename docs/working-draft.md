# Eudonia Working Draft

## Working idea

Eudonia is a React chart library with the ambition of also functioning as a data visualization framework.

The core problem it addresses is familiar from real product work: teams can build strong dashboards and analytical screens with tools like `d3`, `visx`, and app-level layout code, but doing it well still takes too much bespoke effort. Layout, resizing, synchronized interactions, state coordination, annotations, indicators, and chart polish are often rebuilt per product.

This project aims to make that process dramatically easier without flattening everything into a generic chart-builder API.

## Positioning

This is not a publishing platform, embed platform, or Canva-style product. Those ideas may exist later as products unlocked by this work, but they are out of scope here. This project is the engine and framework layer.

It is also not just "a set of chart types." The value should come from combining chart primitives, layout primitives, interaction primitives, annotation and drawing systems, indicators and analytical overlays, realtime and streaming-friendly behavior, and strong visual defaults informed by serious data visualization literature.

## Export classes

The library has two classes of React exports:

- **Primitives** — headless, unstyled building blocks. Similar in spirit to headless component libraries. The caller is expected to provide visual styling.
- **Components** — polished, styled, still-composable higher-level pieces built from primitives. Similar in spirit to shadcn components.

Both are first-class. Primitives give teams full control when they need it; components let teams move fast without rebuilding the hard parts.

## Core categories

At the highest level, the system is organized into three broad categories. These are planning categories, not a claim that each collapses into a single implementation unit.

### Data

Source definitions, fetched or loaded data, canonical chart data, transformed or normalized data, and derived data such as indicators, overlays, sampled windows, or alternative representations like Heikin Ashi.

### Layout

Full-screen composition, bounded regions, flow and grid arrangement, layered overlap, pane sizing and resizing, docked and reorganizable workspace structure, chart bounding boxes, drawable inner regions, subplot or pane relationships, and space available to guides, legends, and axes.

### Scene

The composed analytical view that consumes data and layout and decides what appears and how it behaves: domains and scales, axes, guides, grids, legends, labels, marks and series rendering, overlays and annotations, hover, zoom, brush, crosshair, and higher-level compositions like a price pane, indicator pane, or comparison view.

## Layout primitives

### Today

- `Screen` — full-viewport analytical screens with constrained overflow
- `Flex` / `FlexItem` — simplified flexbox-style flow layouts
- `Grid` / `GridItem` — simplified grid-based dashboard and board layouts

These stay close to browser layout behavior internally but expose a simpler framework API rather than the full surface area of raw CSS props.

### Future ideas

- `Box` — bounded rectangular region
- `Layer` — overlap and z-order composition
- `Split` — authored, nested resizable panes in either direction
- `Dock` — runtime workspace behavior: rearranging, resizing, maximizing, tabbing
- `Canvas` — alternative to `Screen` that works like a Figma or tldraw canvas, letting users organize workspaces/dashboards and freely move, arrange, and zoom things around inside an unbounded spatial surface

`Split` and `Dock` sit on opposite sides of a boundary worth preserving: `Split` is authored pane layout, `Dock` is runtime user-driven workspace behavior.

`Canvas` is similarly a peer to `Screen`: `Screen` is a constrained full-viewport composition, while `Canvas` is a pannable, zoomable spatial surface where the user — not the author — decides the arrangement.

## Product philosophy

The library should make it easy for developers to stay in code while still producing interfaces that feel as thoughtful as specialist dataviz work.

The system should prefer composition over giant configuration objects, but it also needs enough polish and built-in behavior that teams do not have to rebuild the hard parts every time.

Escape hatches are essential. If a team needs to go custom, the system should help rather than fight them.

## Long-term ambition

The long-term ambition is depth, not just breadth. The library should be capable of supporting normal product dashboards, advanced paneled charting experiences, dense monitoring and operational screens, newsroom or analytical storytelling patterns inside apps, map-linked analytical views, and serious custom visualization work inside React products.

Ten concrete reference patterns are captured in [Dashboard Reference Variants](./dashboard-reference-variants.md) and act as requirements for the layout system and future implementation fixtures.
