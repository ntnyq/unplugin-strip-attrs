import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { stripAttrs } from '../src/core/transform'
import { registerOptionMatrixTests } from './helpers/option-matrix'

describe('vue transform', () => {
  it('removes attrs in vue templates', () => {
    const options = resolveOptions({})
    const input = `
<template>
  <div data-testid="card" data-qa="user-card" class="card">hi</div>
</template>
<main data-cy="landing"></main>
`

    const result = stripAttrs(input, 'App.vue', options)

    expect(result.code).toContain(
      '<div data-qa="user-card" class="card">hi</div>',
    )
    expect(result.code).toContain('<main></main>')
    expect(result.code).not.toContain('data-testid=')
    expect(result.code).not.toContain('data-cy=')
  })

  it('handles dynamic bindings and keepValues', () => {
    const options = resolveOptions({
      keepValues: [/^keep:/],
    })

    const input = `
<template>
  <li
    v-for="item in list"
    :key="item.id"
    data-testid="remove:item"
    :data-cy="item.cy"
    data-test="keep:stable"
    class="row"
  >
    {{ item.name }}
  </li>
</template>
`

    const result = stripAttrs(input, 'List.vue', options)

    expect(result.code).toContain('data-test="keep:stable"')
    expect(result.code).toContain('class="row"')
    expect(result.code).not.toContain('data-testid="remove:item"')
    expect(result.code).not.toContain(':data-cy=')
  })

  it('can ignore specific tag names', () => {
    const options = resolveOptions({
      ignoreTagNames: ['template'],
    })

    const input =
      '<template data-testid="keep-root"><div data-testid="drop-inner"></div></template>'
    const result = stripAttrs(input, 'App.vue', options)

    expect(result.code).toBe(
      '<template data-testid="keep-root"><div></div></template>',
    )
  })

  registerOptionMatrixTests('vue', 'vue', {
    attrsInput:
      '<div data-qa="x" :data-e2e-id="id" data-testid="keep" data-cy="keep"></div>',
    keepAttrsInput:
      '<div data-testid="drop" :data-cy="keep" data-qa="keep"></div>',
    keepValuesInput:
      '<a data-testid="keep-me"></a><b data-cy="stable:42"></b><c data-cy="drop"></c>',
    ignoreTagsInput:
      '<section data-testid="a"></section><UiCard data-cy="b"></UiCard><div data-testid="c"></div>',
    caseSensitiveInput: '<div DATA-CY="UP" data-cy="down"></div>',
  })
})
