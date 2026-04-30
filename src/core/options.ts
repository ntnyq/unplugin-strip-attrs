import process from 'node:process'
import type { Options, OptionsResolved } from '../types'

/**
 * Resolves user options to a fully-populated options object.
 *
 * @param options Raw plugin options from user configuration.
 * @returns Options object with defaults applied.
 */
export function resolveOptions(options: Options): OptionsResolved {
  return {
    include: options.include || [
      /\.(?:[cm]?[jt]sx|vue|svelte|html|astro|mdx)$/i,
    ],
    exclude: options.exclude || [/\.d\.ts$/],
    enforce: options.enforce || 'post',
    attrs: options.attrs || ['data-testid', 'data-cy'],
    keepAttrs: options.keepAttrs || [],
    keepValues: options.keepValues || [],
    ignoreTagNames: options.ignoreTagNames || ['template'],
    caseSensitive: options.caseSensitive || false,
    root: options.root || process.cwd(),
  }
}
