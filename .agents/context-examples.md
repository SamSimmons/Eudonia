# Examples Context

Use this context for example work and library-consumer behavior.

## Commands

- Work only in `examples/`.
- Treat the example as real consumer code.
- Import from the `eudonia` entrypoint only.
- Check the current public exports before saying the package lacks something.
- Keep example styling, chrome, and placeholder content inside `examples/`.
- Surface library friction by using the public API.
- When example work needs library support, stop and report the consumer-side friction.
- Follow the current example plan literally.

## Stop Format

- `done: ...`
- `blocked: ...`
- `needs library support: ...`

## Examples

Bad:

`The library needs Flex.`

Good:

`I checked packages/eudonia/src/index.ts. The shell can already use Flex.`

Bad:

`I updated packages/ to help the example.`

Good:

`The example is blocked on a public API gap. No library edits made here.`
