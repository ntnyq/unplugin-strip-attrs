import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../../src/core/options'
import { stripAttrs } from '../../src/core/transform'

export interface LanguageOptionMatrixTemplates {
  attrsInput: string
  keepAttrsInput: string
  keepValuesInput: string
  ignoreTagsInput: string
  caseSensitiveInput: string
}

export function registerOptionMatrixTests(
  language: string,
  ext: string,
  templates: LanguageOptionMatrixTemplates,
) {
  describe(`option matrix in ${language}`, () => {
    it('supports attrs with string and regex patterns', () => {
      const options = resolveOptions({
        attrs: ['data-qa', /^data-e2e-/],
      })

      const result = stripAttrs(templates.attrsInput, `Attrs.${ext}`, options)

      expect(result.code).toContain('data-testid="keep"')
      expect(result.code).toContain('data-cy="keep"')
      expect(result.code).not.toContain('data-qa=')
      expect(result.code).not.toContain('data-e2e-id=')
    })

    it('supports keepAttrs with string and regex rules', () => {
      const options = resolveOptions({
        attrs: ['data-testid', 'data-cy', 'data-qa'],
        keepAttrs: ['data-cy', /^data-q/],
      })

      const result = stripAttrs(
        templates.keepAttrsInput,
        `KeepAttrs.${ext}`,
        options,
      )

      expect(result.code).toContain('data-cy="keep"')
      expect(result.code).toContain('data-qa="keep"')
      expect(result.code).not.toContain('data-testid=')
    })

    it('supports keepValues with string and regex rules', () => {
      const options = resolveOptions({
        keepValues: ['keep-me', /^stable:/],
      })

      const result = stripAttrs(
        templates.keepValuesInput,
        `KeepValues.${ext}`,
        options,
      )

      expect(result.code).toContain('data-testid="keep-me"')
      expect(result.code).toContain('data-cy="stable:42"')
      expect(result.code).toContain('<c></c>')
    })

    it('supports ignoreTagNames with string and regex rules', () => {
      const options = resolveOptions({
        ignoreTagNames: ['section', /^Ui/],
      })

      const result = stripAttrs(
        templates.ignoreTagsInput,
        `IgnoreTags.${ext}`,
        options,
      )

      expect(result.code).toContain('<section data-testid="a"></section>')
      expect(result.code).toContain('<UiCard data-cy="b"></UiCard>')
      expect(result.code).toContain('<div></div>')
    })

    it('supports caseSensitive matching behavior', () => {
      const options = resolveOptions({
        attrs: ['data-cy'],
        caseSensitive: true,
      })

      const result = stripAttrs(
        templates.caseSensitiveInput,
        `CaseSensitive.${ext}`,
        options,
      )

      expect(result.code).toContain('DATA-CY="UP"')
      expect(result.code).not.toContain(' data-cy=')
    })
  })
}
