/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import { StripAttrs } from '.'

/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import StripAttrs from 'unplugin-strip-attrs/vite'
 *
 * export default defineConfig({
 *   plugins: [StripAttrs()],
 * })
 * ```
 */
const vite = StripAttrs.vite as typeof StripAttrs.vite
export default vite
export { vite as 'module.exports' }
