import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { stripAttrs } from '../src/core/transform'
import { registerOptionMatrixTests } from './helpers/option-matrix'

describe('svelte transform', () => {
  it('supports keepAttrs callback for precise retention', () => {
    const options = resolveOptions({
      keepAttrs: [ctx => ctx.attrName === 'data-cy'],
    })

    const input = '<div data-cy="keep" data-testid="remove" />'
    const result = stripAttrs(input, 'Row.svelte', options)

    expect(result.code).toBe('<div data-cy="keep" />')
  })

  it('handles shorthand and unquoted values', () => {
    const options = resolveOptions({
      attrs: ['data-testid', 'data-cy', 'data-e2e'],
    })

    const input = `
<script lang="ts">
  const id = 1
</script>

<div data-testid={id} data-e2e=card class:active={id > 0} data-cy>
  content
</div>
`

    const result = stripAttrs(input, 'Card.svelte', options)

    expect(result.code).toContain('<div class:active={id > 0}>')
    expect(result.code).not.toContain('data-testid=')
    expect(result.code).not.toContain('data-e2e=')
    expect(result.code).not.toContain('data-cy')
  })

  registerOptionMatrixTests('svelte', 'svelte', {
    attrsInput:
      '<div data-qa="x" data-e2e-id="abc" data-testid="keep" data-cy="keep"></div>',
    keepAttrsInput:
      '<div data-testid="drop" data-cy="keep" data-qa="keep"></div>',
    keepValuesInput:
      '<a data-testid="keep-me"></a><b data-cy="stable:42"></b><c data-cy="drop"></c>',
    ignoreTagsInput:
      '<section data-testid="a"></section><UiCard data-cy="b"></UiCard><div data-testid="c"></div>',
    caseSensitiveInput: '<div DATA-CY="UP" data-cy="down"></div>',
  })
})
