import type { QuoteChar } from '../types'

/**
 * Advances the cursor over whitespace.
 *
 * @param input Source string.
 * @param start Start index.
 * @returns Index after trailing whitespace.
 */
export function skipWhitespace(input: string, start: number): number {
  let i = start
  while (i < input.length && /\s/u.test(input[i])) {
    i += 1
  }
  return i
}

/**
 * Reads a quoted value and returns the position after the closing quote.
 *
 * @param input Source string.
 * @param start Start index pointing to quote char.
 * @returns Index after the quoted value.
 */
function readQuoted(input: string, start: number): number {
  const quote = input[start]
  let i = start + 1

  while (i < input.length && input[i] !== quote) {
    i += 1
  }

  return i < input.length ? i + 1 : i
}

/**
 * Reads a braced JavaScript expression and returns the next cursor index.
 *
 * @param input Source string.
 * @param start Start index pointing to opening brace.
 * @returns Index after the braced expression.
 */
function readBraced(input: string, start: number): number {
  let i = start
  let depth = 0
  let quote: QuoteChar = ''
  let escaped = false

  while (i < input.length) {
    const ch = input[i]

    if (quote) {
      if (!escaped && ch === quote) {
        quote = ''
      }
      escaped = !escaped && ch === '\\'
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      escaped = false
    } else if (ch === '{') {
      depth += 1
    } else if (ch === '}') {
      depth -= 1
      if (depth === 0) {
        return i + 1
      }
    }

    i += 1
  }

  return i
}

/**
 * Reads an unquoted value until a tag boundary.
 *
 * @param input Source string.
 * @param start Start index.
 * @returns Index after the unquoted value.
 */
function readBare(input: string, start: number): number {
  let i = start
  while (i < input.length && !/\s|>/u.test(input[i])) {
    if (input[i] === '/') {
      break
    }
    i += 1
  }
  return i
}

/**
 * Reads the end index for an attribute value in any supported syntax.
 *
 * @param input Source string.
 * @param start Start index.
 * @returns Index after the attribute value.
 */
export function readValueEnd(input: string, start: number): number {
  if (input[start] === '"' || input[start] === "'") {
    return readQuoted(input, start)
  }

  if (input[start] === '{') {
    return readBraced(input, start)
  }

  return readBare(input, start)
}

/**
 * Parses an attribute source segment to extract a normalized attribute value.
 *
 * @param rawValuePart Raw source after attribute name.
 * @returns Parsed attribute value or `undefined` for valueless attributes.
 */
export function parseAttrValue(rawValuePart: string): string | undefined {
  const eqIndex = rawValuePart.indexOf('=')
  if (eqIndex === -1) {
    return undefined
  }

  const raw = rawValuePart.slice(eqIndex + 1).trim()
  if (!raw) {
    return ''
  }

  const [first] = raw
  const last = raw.at(-1)
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return raw.slice(1, -1)
  }

  if (first === '{' && last === '}') {
    return raw.slice(1, -1).trim()
  }

  return raw
}
