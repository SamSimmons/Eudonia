# Layout Phase 1 Implementation Brief

This document captures the decisions from the April 13, 2026 design session for the first layout/example implementation slice.

It is a planning and handoff document, not user-facing product documentation.

## Context

Relevant source docs:

- [first-draft.md](./first-draft.md)
- [dashboard-reference-variants.md](./dashboard-reference-variants.md)
- [testing-philosophy.md](./testing-philosophy.md)

This slice is driven by the first dashboard reference:

- `Executive Scorecard Board`

The goal is to build a real example that pressures the layout primitives, not to design a broad layout system in the abstract.

## Goal

Establish the first serious layout surface for Eudonia by:

- converting the repo into a Bun workspace
- moving the library into `packages/eudonia`
- adding a real example app at `examples/react/executive-scorecard`
- making that example consume only the built `eudonia` package artifact
- implementing the minimum layout primitives needed to express the scorecard cleanly

## Success Criteria

This slice is successful when all of the following are true:

- The repo is a Bun workspace.
- The library lives in `packages/eudonia`.
- The example app lives in `examples/react/executive-scorecard`.
- The example imports `eudonia` through the real package entrypoint only.
- The library package is set up properly from day 1 with real package metadata and `exports`.
- The first layout primitives exist as top-level exports from `eudonia`.
- The executive scorecard is a believable analytical screen, not just empty boxes.
- The example uses static local data and a real charting library.
- The library remains layout-focused and does not absorb dashboard-specific chrome/helpers.

## Repo Shape

Target high-level structure:

```text
docs/
packages/
  eudonia/
examples/
  react/
    executive-scorecard/
```

Docs remain at the repo root. They describe the project/repo, not just one package.

## Package Boundary

The example must behave like a real consumer.

Rules:

- The example must never import from the library source directly.
- The example must consume only the built library package.
- The library package should be set up properly from day 1.
- Top-level imports should work like:

```ts
import { Screen, Grid, GridItem, Flex, FlexItem, Box } from "eudonia";
```

Package structure should be correct from the start:

- real package directory
- real build output in `dist/`
- real `exports`
- real `types`

Do not add extra bundler tooling unless Bun is insufficient. The default assumption is Bun-only build tooling.

## Example Shape

Example path:

- `examples/react/executive-scorecard`

Example stack:

- React
- Vite
- plain CSS

Do not use Tailwind for the first example.

The example should be realistic:

- believable KPI and tile density
- believable chart embedding
- static local data
- real charts via `recharts`

`recharts` belongs only in the example app. It must not be pulled into the library package.

The first example is desktop-first. Do not spend this slice inventing a mobile/responsive system. Basic resilience is fine, but the target is an analytical desktop screen.

## Primitive Scope

First-pass library primitives:

- `Screen`
- `Grid`
- `GridItem`
- `Flex`
- `FlexItem`
- `Box`

Not in scope for this slice:

- `Layer`
- `Split`
- `Dock`

### General Primitive Constraints

- Layout primitives are spatial only.
- Do not move dashboard chrome/styling abstractions into the library.
- Keep the API minimal and consistent across components.
- Support only the minimum needed for the executive scorecard.
- Do not build a larger token system.
- Do not expose raw CSS-shaped layout APIs just because CSS supports them.
- Numeric layout values default to pixels in the first pass.
- Components are `div`-based only.
- No `as` prop in this slice.
- No runtime measurement or resize-observer behavior in this slice.

### `Screen`

Role:

- full-viewport analytical screen root

Constraints:

- zero-config full-viewport root
- spatial only
- no built-in visual chrome

### `Box`

Role:

- bounded rectangular region

Constraints:

- stays separate from grid/flex placement semantics
- should not become the grid/flex child API
- remains a plain spatial region primitive

### `Grid`

Role:

- simplified grid layout primitive

Constraints:

- build a small semantic API, not a thin raw-CSS wrapper
- only support the minimum needed for the scorecard
- do not start with CSS track-string APIs

The exact minimal prop set should be chosen during implementation based on the real scorecard composition, not guessed in advance beyond what the example proves necessary.

### `GridItem`

Role:

- grid-specific child placement primitive

Constraints:

- exists because `Box` is not the placement API
- only used when explicit grid-child behavior is needed
- first pass should stay minimal, initially span-oriented rather than a full placement surface

### `Flex`

Role:

- simplified flex layout primitive

Constraints:

- one primitive for rows and columns
- covers vertical stacks with `direction="column"`
- should stay small and consistent with the rest of the layout surface

### `FlexItem`

Role:

- flex-specific child sizing primitive

Constraints:

- exists because parent-specific sizing should not leak into `Box`
- only used when explicit flex-child sizing behavior is needed
- first pass only needs enough for fixed rails and a fluid center

For the scorecard shell, the intended model is:

- left rail: fixed basis
- center: fluid/growing
- right rail: fixed basis

## Example Composition Guidance

The executive scorecard should be expressible by composing:

- `Screen`
- `Flex`
- `FlexItem`
- `Grid`
- `GridItem`
- `Box`

Do not add dashboard-specific library helpers such as:

- `Board`
- `Rail`
- `TileGroup`

If repeated tile chrome is needed, that belongs in example-local components, not the library.

The example should function as the first acceptance target for the primitive API. If the scorecard is awkward to express, that is a signal to refine the primitive API rather than forcing the example into an unnatural shape.

## Testing Scope

Testing in this slice stays narrow.

In scope:

- small library contract tests for primitives where there is real runtime behavior

Out of scope:

- automated example-app tests
- browser E2E
- visual regression
- larger composition tests that duplicate the example

The example is still important as a manual acceptance surface even if it is not yet part of automated coverage.

## Non-Goals

Do not expand this slice into any of the following:

- Tailwind support in the first example
- shared example infrastructure for future examples
- styling system work
- dashboard widget kits
- charting abstractions in the library
- additional layout primitives beyond what the scorecard needs
- mobile-first layout work
- measurement/observer infrastructure
- separate opinionated wrappers like `Stack`

## Implementation Order

Recommended order of work:

1. Convert the repo into a Bun workspace.
2. Move the library into `packages/eudonia`.
3. Set up the library package properly with build output and `exports`.
4. Scaffold `examples/react/executive-scorecard` as a Vite React app.
5. Wire the example to consume only the built `eudonia` package artifact.
6. Implement `Screen`, `Grid`, `GridItem`, `Flex`, and `FlexItem`, preserving `Box`.
7. Build the scorecard example and let the real composition drive any API refinements.
8. Add or update small primitive tests where the runtime contract warrants them.

## Decision Summary

These points were explicitly settled:

- Bun workspace
- library moved to `packages/eudonia`
- separate small example apps
- first example at `examples/react/executive-scorecard`
- example consumes built package only
- plain CSS for first example
- `recharts` only in example
- top-level library exports
- minimal, consistent layout APIs
- spatial-only library primitives
- `Box` is not a grid/flex child primitive
- `GridItem` and `FlexItem` own parent-specific child behavior
- desktop-first for the first example
- realistic example content with static local data
- example-level automated testing out of scope for this slice

## Handoff Note

If implementation starts in a new session, the starting point should be:

1. read this document
2. read `docs/first-draft.md`
3. read the `Executive Scorecard Board` section in `docs/dashboard-reference-variants.md`

Then begin implementation from the package/workspace restructuring step.
