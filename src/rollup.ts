/**
 * This entry file is for Rollup plugin.
 *
 * @module
 */

import { StripAttrs } from '.'

/**
 * Rollup plugin
 *
 * @example
 * ```ts
 * // rollup.config.js
 * import { defineConfig } from 'rollup'
 * import StripAttrs from 'unplugin-strip-attrs/rollup'
 *
 * export default defineConfig({
 *   plugins: [StripAttrs()],
 * })
 * ```
 */
const rollup = StripAttrs.rollup as typeof StripAttrs.rollup
export default rollup
export { rollup as 'module.exports' }
