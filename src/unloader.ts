/**
 * This entry file is for unloader plugin.
 *
 * @module
 */

import { StripAttrs } from '.'

/**
 * unloader plugin
 *
 * @example
 * ```ts
 * // unloader.config.ts
 * import { defineConfig } from 'unloader'
 * import StripAttrs from 'unplugin-strip-attrs/unloader'
 *
 * export default defineConfig({
 *   plugins: [StripAttrs()],
 * })
 * ```
 */
const unloader = StripAttrs.unloader as typeof StripAttrs.unloader
export default unloader
export { unloader as 'module.exports' }
