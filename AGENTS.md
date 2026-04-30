# AGENTS

## Purpose

This repository is a multi-bundler unplugin library that strips test-related attributes (for example, `data-testid`, `data-cy`) from template-like source code during build transforms.

For plugin behavior, API usage, and examples, use [README.md](README.md) as the canonical reference.

## Fast Start Commands

Run these from repository root:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm vitest run`
- `pnpm build`

Release precheck is `pnpm run release:check`.

## Architecture Map

- Core plugin entry: [src/index.ts](src/index.ts)
- Option resolution and defaults: [src/core/options.ts](src/core/options.ts)
- Transform orchestration: [src/core/transform.ts](src/core/transform.ts)
- Pattern/tag/value parsing helpers:
  - [src/core/pattern.ts](src/core/pattern.ts)
  - [src/core/tag.ts](src/core/tag.ts)
  - [src/core/value.ts](src/core/value.ts)
- Public types: [src/types.ts](src/types.ts)
- Bundler adapters (`vite`, `rollup`, `webpack`, `rspack`, `esbuild`, `rolldown`, `farm`, `unloader`) live in [src/](src)

## Working Conventions

- Keep shared/public types centralized in [src/types.ts](src/types.ts).
- Keep transform behavior deterministic: return `undefined` in plugin handler when `changed === false`.
- Preserve parsing safety:
  - Do not strip inside HTML comments.
  - Do not strip inside raw text blocks (`script`/`style` content).
  - Preserve non-target attributes exactly.
- Respect option semantics in [src/types.ts](src/types.ts): `attrs`, `keepAttrs`, `keepValues`, `ignoreTagNames`, `caseSensitive`.

## Testing Conventions

- Test runner: Vitest.
- Language-specific tests:
  - [tests/jsx.test.ts](tests/jsx.test.ts)
  - [tests/vue.test.ts](tests/vue.test.ts)
  - [tests/svelte.test.ts](tests/svelte.test.ts)
  - [tests/html.test.ts](tests/html.test.ts)
- Option/default behavior tests: [tests/options.test.ts](tests/options.test.ts)
- Shared matrix helper for config-option behavior: [tests/helpers/option-matrix.ts](tests/helpers/option-matrix.ts)

When editing transform logic, update language tests and option tests together.

## Pitfalls To Avoid

- Forgetting attribute-name normalization for bound attrs (for example `:data-cy`, `v-bind:data-cy`, `bind:data-cy`).
- Changing defaults in code without updating tests and [README.md](README.md).
- Adding a new bundler adapter file without matching package export in [package.json](package.json).

## Pre-PR Checklist

- `pnpm lint`
- `pnpm typecheck`
- `pnpm vitest run`
- If behavior changed, ensure [README.md](README.md) and tests reflect the same defaults/options.
