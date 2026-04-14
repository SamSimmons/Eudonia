# Library Context

Use this context when the session is about the library in `packages/`.

## Scope

- Work only in `packages/`.
- Editing `examples/` is blocked.

## Goal

Build Eudonia as a library/framework for analytical layout and charting work.

## Rules

- Keep a high bar for code quality.
- Keep a high bar for API design.
- Keep a high bar for performance.
- Keep a high bar for testing.
- Favor durable primitives over task-specific shortcuts.
- Do not add example-specific chrome, styling helpers, or dashboard-specific behavior to the library.
- Treat public API changes as consequential.

## Focus

- package structure
- public exports
- primitive design
- internal implementation quality
- tests
- performance characteristics

## Blocked

- `examples/`
- example-only styling work
- example-only helper APIs
- changes made only to make one example easier
