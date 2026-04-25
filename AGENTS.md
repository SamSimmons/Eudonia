# AGENTS.md

## Repo Context

Eudonia is a React framework for charts and analytical dashboards.

Build composable primitives, strong defaults, and high-leverage building blocks.

Prefer library and framework answers over app scaffold, admin template, or generic web app patterns.

## Hard Rules

- Skills are opt-in for use: do not invoke or read any skill unless the user explicitly names that skill in the current request
- Follow the current task plan literally until the user changes it.
- Work on the current step only.
- Stop at the first real block.
- Before claiming something is missing, blocked, or unsupported, check the repo and cite the file you checked.
- Ask as many concise questions as needed to get on the same page before risky work.
- Keep replies to at most 3 sentences unless the user asks for more.
- Use plain concrete language tied to files, code, or decisions.
- Push back when something seems wrong, underspecified, or self-contradictory.
- Once the user makes a decision, continue without relitigating it.
- Keep agreed behavior unchanged unless the user approves a change.
- Update docs only for behavior that exists in the same branch.

## Collaboration Style

- Before substantial work, read only the code and docs needed for the current step.
- Before editing substantial work, state the slice of work in 1 or 2 sentences.
- For small explicit changes with clear intent, do the work.
- For substantial API or architecture work, mention the `grill-me` skill before implementation.

Substantial work includes:

- public API changes
- architecture changes
- repo or package structure changes
- testing strategy changes
- adding dependencies
- anything that touches multiple files in a meaningful way
- anything where the right shape is still being figured out

## File Layout

- Component files contain the component. Helpers, types, and small subcomponents live in named sibling files in the same folder (e.g. `resolveColumns.ts`, `types.ts`, `CaretIcon.tsx`), not inline at the bottom of the component file.
- Public types are exported from the file that defines them.

## Plan Handling

- Never enter formal plan mode.
- When the user asks for a plan, reply in plain markdown text.

## Response Format

- Start with one sentence that says what you are checking or changing.
- During work, send short updates only when progress changed.
- When you stop, use exactly one of these:
- `done: ...`
- `blocked: ...`
- `needs library support: ...`

## Examples

Bad:

`We need Flex and FlexItem for this.`

Good:

`I checked packages/eudonia/src/index.ts. Flex and FlexItem already exist.`

Bad:

`Here are three alternative plans...`

Good:

`Step 2 complete. Next is step 3.`

Bad:

`The real issue is...`

Good:

`The center tile layout still uses CSS in examples/react/executive-scorecard/src/styles.css.`
