/**
 * This entry file is for webpack plugin.
 *
 * @module
 */

import { StripAttrs } from '.'

/**
 * Webpack plugin
 *
 * @example
 * ```ts
 * // webpack.config.js
 * module.exports = {
 *  plugins: [require('unplugin-strip-attrs/webpack')()],
 * }
 * ```
 */
const webpack = StripAttrs.webpack as typeof StripAttrs.webpack
export default webpack
export { webpack as 'module.exports' }
