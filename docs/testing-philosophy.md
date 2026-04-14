# Testing Philosophy

This project needs a very high bar for testing, but the testing strategy should stay grounded in real framework use cases rather than synthetic coverage.

## Core direction

Eudonia should be tested through realistic examples of how the framework is meant to be used.

The goal is not to accumulate shallow tests. The goal is to build confidence that the framework works for real charting and dashboard use cases, stays performant under stress, and remains stable as the API evolves.

Performance tracking should be part of the project from day 1, not something added after the framework is already complex.

## Current principles

- Prefer full-featured example surfaces over toy fixtures.
- Use real-world dashboard and chart use cases as acceptance coverage.
- Keep mocks to a minimum.
- Do not write tests for behavior already guaranteed by the type system unless there is a runtime contract worth protecting.
- Prefer simple, high-confidence tests over noisy or overly-coupled tests.
- Build quality checks into the project early rather than bolting them on later.

## What the test suite should eventually cover

- real use case examples built with the framework
- implementation and contract tests for primitives where appropriate
- end-to-end or equivalent use-case coverage for full analytical screens
- performance checks such as frame rate, render frequency, and other regression signals
- accessibility checks
- stress tests for dense layouts, resizing, and interaction-heavy surfaces

## Performance and quality

Performance should be treated as a first-class concern.

The project should include ways to observe and track performance from the beginning so regressions are visible early.

The project should make it easy to detect:

- unnecessary re-renders
- degraded frame rate
- layout instability under resize
- regressions caused by abstraction or convenience features

## Status

This document is intentionally incomplete.

The exact testing stack, performance tooling, and use-case fixtures should be filled in as the framework takes shape and the first serious examples are built.
