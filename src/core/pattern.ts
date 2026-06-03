import type { AttrPattern } from '../types'

const V_BIND_PREFIX = 'v-bind:'
const BIND_PREFIX = 'bind:'
const COLON_PREFIX = ':'
const V_BIND_PREFIX_LEN = V_BIND_PREFIX.length
const BIND_PREFIX_LEN = BIND_PREFIX.length
const COLON_PREFIX_LEN = COLON_PREFIX.length

/**
 * Normalizes framework-specific binding prefixes to a plain attribute name.
 *
 * @param name Raw attribute name from source code.
 * @returns Normalized attribute name.
 */
export function normalizeAttrName(name: string): string {
  if (name.startsWith(V_BIND_PREFIX)) {
    return name.slice(V_BIND_PREFIX_LEN)
  }

  if (name.startsWith(BIND_PREFIX)) {
    return name.slice(BIND_PREFIX_LEN)
  }

  if (name.startsWith(COLON_PREFIX)) {
    return name.slice(COLON_PREFIX_LEN)
  }

  return name
}

/**
 * Tests whether a value matches a configured string or regular expression.
 *
 * @param value Input value to test.
 * @param pattern Matcher pattern.
 * @param caseSensitive Whether matching should be case-sensitive.
 * @returns Whether the value matches the pattern.
 */
export function matchesPattern(
  value: string,
  pattern: AttrPattern,
  caseSensitive: boolean,
): boolean {
  if (typeof pattern === 'string') {
    return caseSensitive
      ? value === pattern
      : value.toLowerCase() === pattern.toLowerCase()
  }

  if (caseSensitive) {
    return pattern.test(value)
  }

  const flags = pattern.flags.includes('i')
    ? pattern.flags
    : `${pattern.flags}i`
  return new RegExp(pattern.source, flags).test(value)
}

/**
 * Parses and returns the lowercase tag name from a tag literal.
 *
 * @param tag Full tag literal, including angle brackets.
 * @returns Lowercase tag name or `undefined` when parsing fails.
 */
export function getTagName(tag: string): string | undefined {
  let i = 1
  while (i < tag.length && /\s/u.test(tag[i])) {
    i += 1
  }

  if (tag[i] === '/') {
    i += 1
  }

  const start = i
  while (i < tag.length && /[A-Za-z0-9_:.-]/u.test(tag[i])) {
    i += 1
  }

  if (start === i) {
    return undefined
  }

  return tag.slice(start, i).toLowerCase()
}
