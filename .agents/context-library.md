# Library Context

Use this context when the session is about the library in `packages/`.

## Scope

- Work only in `packages/`.
- Editing `examples/` is blocked.

## Goal

Build Eudonia as a library/framework for analytical layout and charting work.

## Export classes

The library exports two kinds of React components:

- **Primitives** — headless, unstyled. The caller provides visual styling.
- **Components** — polished, styled, still-composable pieces built from primitives.

Both are first-class. Styling inside a component is expected; styling inside a primitive is not.

## Rules

- Keep a high bar for code quality, API design, performance, and testing.
- Favor durable, reusable exports over task-specific shortcuts.
- Do not add example-specific chrome or dashboard-specific behavior to the library. Styling is acceptable inside components, not inside primitives, and never as a one-off for a single example.
- Treat public API changes as consequential.

## Focus

- package structure
- public exports
- primitive and component design
- internal implementation quality
- tests
- performance characteristics

## Blocked

- `examples/`
- example-only helper APIs
- changes made only to make one example easier
