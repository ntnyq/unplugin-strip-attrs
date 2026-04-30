# unplugin-strip-attrs

[![CI](https://github.com/ntnyq/unplugin-strip-attrs/workflows/CI/badge.svg)](https://github.com/ntnyq/unplugin-strip-attrs/actions)
[![NPM VERSION](https://img.shields.io/npm/v/unplugin-strip-attrs.svg)](https://www.npmjs.com/package/unplugin-strip-attrs)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/unplugin-strip-attrs.svg)](https://www.npmjs.com/package/unplugin-strip-attrs)
[![LICENSE](https://img.shields.io/github/license/ntnyq/unplugin-strip-attrs.svg)](https://github.com/ntnyq/unplugin-strip-attrs/blob/main/LICENSE)

Remove testing-related attributes (such as `data-testid` and `data-cy`) from templates during build.

It supports JSX/TSX, Vue, Svelte, HTML, and also Astro/MDX by default.

## Install

```shell
npm i unplugin-strip-attrs -D
```

```shell
yarn add unplugin-strip-attrs -D
```

```shell
pnpm add unplugin-strip-attrs -D
```

## Usage

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import StripAttrs from 'unplugin-strip-attrs/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [StripAttrs()],
})
```

<br></details>

<details>
<summary>unloader</summary><br>

```ts
// unloader.config.ts
import { defineConfig } from 'unloader'
import StripAttrs from 'unplugin-strip-attrs/unloader'

export default defineConfig({
  plugins: [StripAttrs()],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import { defineConfig } from 'rollup'
import StripAttrs from 'unplugin-strip-attrs/rollup'

export default defineConfig({
  plugins: [StripAttrs()],
})
```

<br></details>

<details>
<summary>Rolldown/TsDown</summary><br>

```ts
// rolldown.config.ts/tsdown.config.ts
import { defineConfig } from 'rolldown'
// import { defineConfig } from 'tsdown'
import StripAttrs from 'unplugin-strip-attrs/rolldown'

export default defineConfig({
  plugins: [StripAttrs()],
})
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'

build({
  plugins: [require('unplugin-strip-attrs/esbuild')()],
})
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  plugins: [require('unplugin-strip-attrs/webpack')()],
}
```

<br></details>

<details>
<summary>Rspack</summary><br>

```ts
// rspack.config.ts
import { defineConfig } from '@rspack/cli'
import StripAttrs from 'unplugin-strip-attrs/rspack'

export default defineConfig({
  plugins: [StripAttrs()],
})
```

<br></details>

<details>
<summary>Farm</summary><br>

```ts
// farm.config.ts
import { defineConfig } from '@farmfe/core'
import StripAttrs from 'unplugin-strip-attrs/farm'

export default defineConfig({
  plugins: [StripAttrs()],
})
```

<br></details>

## What It Does

- Removes common testing attributes: `data-testid` and `data-cy`.
- Processes these file types by default: `jsx`, `tsx`, `vue`, `svelte`, `html`, `astro`, `mdx`
- Supports extending removable attributes via `attrs` (string or RegExp)
- Supports preserving attributes by value pattern via `keepValues`
- Supports advanced keep rules via `keepAttrs` (string, RegExp, or callback)
- Supports skipping specific tags via `ignoreTagNames` (default includes `template`)

## Options

```ts
export interface Options {
  enforce?: 'post' | 'pre'
  include?: FilterPattern
  exclude?: FilterPattern

  // Attributes to remove
  attrs?: Array<string | RegExp>

  // Keep attributes even when they match attrs
  keepAttrs?: Array<
    | string
    | RegExp
    | ((ctx: {
        id: string
        attrName: string
        attrValue: string | undefined
      }) => boolean)
  >

  // Keep attributes when value matches one of these patterns
  keepValues?: Array<string | RegExp>

  // Skip stripping in specific tag names
  ignoreTagNames?: Array<string | RegExp>

  // Whether attribute matching is case-sensitive
  caseSensitive?: boolean

  root?: string
}
```

## Default Options

```ts
{
  enforce: 'post',
  include: [/\.(?:[cm]?[jt]sx|vue|svelte|html|astro|mdx)$/i],
  exclude: [/\.d\.ts$/],
  attrs: [
    'data-testid',
    'data-cy',
  ],
  keepAttrs: [],
  keepValues: [],
  ignoreTagNames: ['template'],
  caseSensitive: false,
}
```

## Examples

### Extend removable attributes

```ts
import StripAttrs from 'unplugin-strip-attrs/vite'

export default {
  plugins: [
    StripAttrs({
      attrs: ['data-testid', 'data-cy', /^data-e2e-/],
    }),
  ],
}
```

### Keep attributes by value pattern

```ts
import StripAttrs from 'unplugin-strip-attrs/vite'

export default {
  plugins: [
    StripAttrs({
      keepValues: [/^keep:/],
    }),
  ],
}
```

Input:

```html
<button
  data-testid="keep:primary"
  data-cy="remove-me"
>
  Save
</button>
```

Output:

```html
<button data-testid="keep:primary">Save</button>
```

### Keep attributes with callback rules

```ts
import StripAttrs from 'unplugin-strip-attrs/vite'

export default {
  plugins: [
    StripAttrs({
      keepAttrs: [ctx => ctx.attrName === 'data-cy'],
      ignoreTagNames: ['template'],
    }),
  ],
}
```

### Extend supported template file types

```ts
import StripAttrs from 'unplugin-strip-attrs/vite'

export default {
  plugins: [
    StripAttrs({
      include: [/\.(?:[cm]?[jt]sx|vue|svelte|html|astro|mdx|hbs|handlebars)$/i],
    }),
  ],
}
```

## License

[MIT](./LICENSE) License © 2026-PRESENT [ntnyq](https://github.com/ntnyq)
