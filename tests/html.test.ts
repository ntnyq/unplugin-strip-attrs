import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { stripAttrs } from '../src/core/transform'
import { registerOptionMatrixTests } from './helpers/option-matrix'

describe('html transform', () => {
  it('keeps comments and script text untouched', () => {
    const options = resolveOptions({})
    const input = `
<!-- <div data-testid="in-comment"></div> -->
<main data-testid="root">
  <div data-cy="hero" class="hero">Hello</div>
  <script>
    const tpl = '<div data-testid="inside-string">x</div>'
  </script>
</main>
`

    const result = stripAttrs(input, 'index.html', options)

    expect(result.code).toContain(
      '<!-- <div data-testid="in-comment"></div> -->',
    )
    expect(result.code).toContain(
      'const tpl = \'<div data-testid="inside-string">x</div>\'',
    )
    expect(result.code).toContain('<div class="hero">Hello</div>')
    expect(result.code).not.toContain('data-testid="root"')
    expect(result.code).not.toContain('data-cy="hero"')
  })

  registerOptionMatrixTests('html', 'html', {
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
