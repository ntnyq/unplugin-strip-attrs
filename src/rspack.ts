/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import { StripAttrs } from '.'

/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.ts
 * import { defineConfig } from '@rspack/cli'
 * import StripAttrs from 'unplugin-strip-attrs/rspack'
 *
 * export default defineConfig({
 *   plugins: [StripAttrs()],
 * })
 * ```
 */
const rspack = StripAttrs.rspack as typeof StripAttrs.rspack
export default rspack
export { rspack as 'module.exports' }
