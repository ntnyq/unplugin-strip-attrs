/**
 * This entry file is for Farm plugin.
 *
 * @module
 */

import { StripAttrs } from '.'

/**
 * Farm plugin
 *
 * @example
 * ```ts
 * // farm.config.ts
 * import { defineConfig } from '@farmfe/core'
 * import StripAttrs from 'unplugin-strip-attrs/farm'
 *
 * export default defineConfig({
 *   plugins: [StripAttrs()],
 * })
 * ```
 */
const farm = StripAttrs.farm as typeof StripAttrs.farm
export default farm
export { farm as 'module.exports' }
