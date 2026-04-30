import { createUnplugin } from 'unplugin'
import type { UnpluginInstance } from 'unplugin'
import { resolveOptions } from './core/options'
import { stripAttrs } from './core/transform'
import type { Options } from './types'

/**
 * Universal unplugin instance that strips configured test attributes.
 */
export const StripAttrs: UnpluginInstance<Options | undefined, false> =
  createUnplugin((rawOptions = {}) => {
    const options = resolveOptions(rawOptions)

    return {
      name: 'unplugin-strip-attrs',
      enforce: options.enforce,

      transform: {
        filter: {
          id: {
            include: options.include,
            exclude: options.exclude,
          },
        },

        /**
         * Removes matching attributes from the current module code.
         *
         * @param code Module source code.
         * @param id Module id.
         * @returns Transformed result or `undefined` when unchanged.
         */
        handler(code, id) {
          const result = stripAttrs(code, id, options)
          if (!result.changed) {
            return
          }

          return {
            code: result.code,
            map: undefined,
          }
        },
      },
    }
  })

export * from './types'
