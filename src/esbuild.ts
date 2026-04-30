/**
 * This entry file is for esbuild plugin. Requires esbuild >= 0.15
 *
 * @module
 */

import { StripAttrs } from '.'

/**
 * Esbuild plugin
 *
 * @example
 * ```ts
 * // esbuild.config.js
 * import { build } from 'esbuild'
 *
 * build({
 *   plugins: [require('unplugin-strip-attrs/esbuild')()],
 * })
 * ```
 */
const esbuild = StripAttrs.esbuild as typeof StripAttrs.esbuild
export default esbuild
export { esbuild as 'module.exports' }
