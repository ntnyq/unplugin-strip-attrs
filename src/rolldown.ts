/**
 * This entry file is for Rolldown plugin.
 *
 * @module
 */

import { StripAttrs } from '.'

/**
 * Rolldown plugin
 *
 * @example
 * ```ts
 * // rolldown.config.ts/tsdown.config.ts
 * import { defineConfig } from 'rolldown'
 * import StripAttrs from 'unplugin-strip-attrs/rolldown'
 *
 * export default defineConfig({
 *   plugins: [StripAttrs()],
 * })
 * ```
 */
const rolldown = StripAttrs.rolldown as typeof StripAttrs.rolldown
export default rolldown
export { rolldown as 'module.exports' }
