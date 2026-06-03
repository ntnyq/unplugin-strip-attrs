import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { stripAttrs } from '../src/core/transform'
import { registerOptionMatrixTests } from './helpers/option-matrix'

describe('jsx/tsx transform', () => {
  it('removes default testing attrs in jsx', () => {
    const options = resolveOptions({})
    const input = `<button data-testid="submit" className="btn" data-cy="btn-submit">Send</button>`
    const result = stripAttrs(input, 'Button.tsx', options)

    expect(result.code).toBe('<button className="btn">Send</button>')
  })

  it('handles fragment with expression values and comments', () => {
    const options = resolveOptions({})
    const input = `
export function View() {
  return (
    <>
      {/* keep comment */}
      <button data-testid={isProd ? 'prod' : 'dev'} disabled data-cy="cta" className="btn">Go</button>
      <input data-test-id={id} aria-label="n" />
    </>
  )
}
`

    const result = stripAttrs(input, 'View.jsx', options)

    expect(result.code).toContain('{/* keep comment */}')
    expect(result.code).toMatch(
      /<button\s+disabled\s+className="btn">Go<\/button>/u,
    )
    expect(result.code).toContain('<input data-test-id={id} aria-label="n" />')
    expect(result.code).not.toContain('data-testid=')
    expect(result.code).not.toContain('data-cy=')
  })

  registerOptionMatrixTests('jsx', 'jsx', {
    attrsInput:
      '<div data-qa="x" data-e2e-id="abc" data-testid="keep" data-cy="keep" />',
    keepAttrsInput: '<div data-testid="drop" data-cy="keep" data-qa="keep" />',
    keepValuesInput:
      '<a data-testid="keep-me"></a><b data-cy="stable:42"></b><c data-cy="drop"></c>',
    ignoreTagsInput:
      '<section data-testid="a"></section><UiCard data-cy="b"></UiCard><div data-testid="c"></div>',
    caseSensitiveInput: '<div DATA-CY="UP" data-cy="down"></div>',
  })
})
