import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../src/core/options'
import { stripAttrs } from '../src/core/transform'

describe('options behavior', () => {
  it('uses default attrs of data-testid and data-cy only', () => {
    const options = resolveOptions({})

    expect(options.attrs).toEqual(['data-testid', 'data-cy'])
  })

  it('resolves include/exclude/enforce/root defaults', () => {
    const options = resolveOptions({})

    expect(options.enforce).toBe('post')
    expect(options.include).toEqual([
      /\.(?:[cm]?[jt]sx|vue|svelte|html|astro|mdx)$/i,
    ])
    expect(options.exclude).toEqual([/\.d\.ts$/])
    expect(options.root.length).toBeGreaterThan(0)
  })

  it('respects include/exclude/enforce/root overrides', () => {
    const include = [/\.foo$/]
    const exclude = [/\.bar$/]
    const options = resolveOptions({
      include,
      exclude,
      enforce: 'pre',
      root: '/tmp/project',
    })

    expect(options.include).toEqual(include)
    expect(options.exclude).toEqual(exclude)
    expect(options.enforce).toBe('pre')
    expect(options.root).toBe('/tmp/project')
  })

  it('keeps attrs whose values match keepValues', () => {
    const options = resolveOptions({
      keepValues: [/^keep:/],
    })

    const input = '<div data-testid="keep:stable" data-cy="drop-me" />'
    const result = stripAttrs(input, 'Comp.tsx', options)

    expect(result.code).toBe('<div data-testid="keep:stable" />')
  })

  it('supports custom attrs via strings and regex', () => {
    const options = resolveOptions({
      attrs: ['data-test', /^data-e2e-/],
    })

    const input =
      '<section data-test="smoke" data-e2e-id="abc" data-testid="keep-default-not-enabled" />'
    const result = stripAttrs(input, 'Comp.tsx', options)

    expect(result.code).toBe(
      '<section data-testid="keep-default-not-enabled" />',
    )
  })

  it('supports keepAttrs string and regex patterns', () => {
    const options = resolveOptions({
      attrs: ['data-testid', 'data-cy', 'data-qa'],
      keepAttrs: ['data-cy', /^data-q/],
    })

    const input = '<div data-testid="drop" data-cy="keep" data-qa="keep"></div>'
    const result = stripAttrs(input, 'KeepAttrs.tsx', options)

    expect(result.code).toContain('data-cy="keep"')
    expect(result.code).toContain('data-qa="keep"')
    expect(result.code).not.toContain('data-testid=')
  })

  it('supports ignoreTagNames string and regex patterns', () => {
    const options = resolveOptions({
      ignoreTagNames: ['section', /^Custom/],
    })

    const input =
      '<section data-testid="a"></section><CustomBox data-cy="b"></CustomBox><div data-testid="c"></div>'
    const result = stripAttrs(input, 'IgnoreTags.tsx', options)

    expect(result.code).toContain('<section data-testid="a"></section>')
    expect(result.code).toContain('<CustomBox data-cy="b"></CustomBox>')
    expect(result.code).toContain('<div></div>')
  })

  it('supports caseSensitive positive and negative behavior', () => {
    const strict = resolveOptions({
      attrs: ['data-testid'],
      caseSensitive: true,
    })
    const loose = resolveOptions({
      attrs: ['data-testid'],
      caseSensitive: false,
    })

    const input = '<div DATA-TESTID="up" data-testid="down"></div>'
    const strictResult = stripAttrs(input, 'CaseStrict.tsx', strict)
    const looseResult = stripAttrs(input, 'CaseLoose.tsx', loose)

    expect(strictResult.code).toContain('DATA-TESTID="up"')
    expect(strictResult.code).not.toContain(' data-testid=')
    expect(looseResult.code).toBe('<div></div>')
  })
})
