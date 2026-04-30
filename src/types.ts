import type { FilterPattern } from 'unplugin'

/**
 * Shared quote character type used when scanning tag expressions.
 */
export type QuoteChar = '"' | "'" | '`' | ''

/**
 * Transform output shape used by strip and tag-cleaning utilities.
 */
export interface StripResult {
  /**
   * Transformed source code.
   */
  code: string

  /**
   * Whether the source code changed.
   */
  changed: boolean
}

/**
 * Callback context for selective keep rules.
 */
export interface RemoveAttrContext {
  /**
   * Current module id.
   */
  id: string

  /**
   * Normalized attribute name.
   */
  attrName: string

  /**
   * Parsed attribute value if present.
   */
  attrValue: string | undefined
}

/**
 * Attribute matcher pattern.
 */
export type AttrPattern = string | RegExp

/**
 * Rule used to keep attributes from being removed.
 */
export type KeepRule = AttrPattern | ((ctx: RemoveAttrContext) => boolean)

/**
 * Plugin options.
 */
export interface Options {
  /**
   * Transform phase order.
   */
  enforce?: 'post' | 'pre'

  /**
   * Excluded file filters.
   */
  exclude?: FilterPattern

  /**
   * Included file filters.
   */
  include?: FilterPattern

  /**
   * Attribute names or patterns to remove.
   */
  attrs?: AttrPattern[]

  /**
   * Rules for attributes that should be kept.
   */
  keepAttrs?: KeepRule[]

  /**
   * Attribute value patterns that should be kept.
   */
  keepValues?: AttrPattern[]

  /**
   * Tag names to skip while stripping.
   */
  ignoreTagNames?: AttrPattern[]

  /**
   * Whether attribute matching is case-sensitive.
   */
  caseSensitive?: boolean

  /**
   * Project root used for path resolution.
   */
  root?: string
}

/**
 * Resolved options with defaults applied.
 */
export type OptionsResolved = Required<Options>
