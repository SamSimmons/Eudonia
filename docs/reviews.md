# Review Standard

Use this prompt when asking for a code review:

```text
Review my current changes. Do not edit code.
Read every changed file. Run typecheck, tests, lint, and any relevant browser tests.
Review in passes: correctness, consistency, maintainability, public API, accessibility, layout/responsive behavior, test coverage, docs, dependency/build impact, and example validity.
Do not stop after low-hanging failures.
Return at least 15 findings unless there truly are fewer, with file:line, severity, impact, and fix direction.
Call out false confidence from existing tests.
```
