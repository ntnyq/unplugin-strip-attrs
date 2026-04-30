import type { OptionsResolved, QuoteChar, StripResult } from '../types'
import { getTagName } from './pattern'
import { cleanTag } from './tag'

const COMMENT_OPEN = '<!--'
const COMMENT_OPEN_LEN = COMMENT_OPEN.length
const COMMENT_CLOSE = '-->'
const COMMENT_CLOSE_LEN = COMMENT_CLOSE.length

/**
 * Reports whether the character is part of an identifier.
 *
 * @param char Character to inspect.
 * @returns Whether the character is identifier-like.
 */
function isWordChar(char: string | undefined): boolean {
  return !!char && /[\w$]/.test(char)
}

/**
 * Heuristic check for whether `<` likely starts a real tag.
 *
 * @param code Full source text.
 * @param start Index of `<`.
 * @returns Whether this looks like a tag start.
 */
function isLikelyTagStart(code: string, start: number): boolean {
  const prev = code[start - 1]
  const next = code[start + 1]
  const possibleTag = /[A-Za-z!/]/.test(next || '')
  return possibleTag && !isWordChar(prev)
}

/**
 * Reads HTML comment boundary and returns the closing index if found.
 *
 * @param code Full source text.
 * @param start Index of potential comment start.
 * @returns Closing comment start index or `-1`.
 */
function readCommentEnd(code: string, start: number): number {
  if (!code.startsWith(COMMENT_OPEN, start)) {
    return -1
  }
  return code.indexOf(COMMENT_CLOSE, start + COMMENT_OPEN_LEN)
}

/**
 * Determines if a parsed tag is an opening `script` or `style` tag.
 *
 * @param tag Full tag literal.
 * @param tagName Parsed tag name.
 * @returns Whether the tag opens a raw-text block.
 */
function isRawTextOpenTag(tag: string, tagName: string | undefined): boolean {
  if (!tagName || (tagName !== 'script' && tagName !== 'style')) {
    return false
  }

  const isClosingTag = /^<\s*\//.test(tag)
  const isSelfClosing = /\/\s*>$/.test(tag)
  return !isClosingTag && !isSelfClosing
}

/**
 * Finds the matching raw-text closing tag index.
 *
 * @param code Full source text.
 * @param from Start index for searching.
 * @param tagName Tag name to close.
 * @returns Closing tag start index or `-1`.
 */
function findRawTextCloseStart(
  code: string,
  from: number,
  tagName: string,
): number {
  const lower = code.toLowerCase()
  return lower.indexOf(`</${tagName}`, from)
}

/**
 * Advances index after handling raw text content inside `script`/`style` tags.
 *
 * @param code Full source text.
 * @param end End index of current opening tag.
 * @param tag Full tag literal.
 * @returns Next cursor and raw text payload to append.
 */
function getNextIndexAfterRawText(
  code: string,
  end: number,
  tag: string,
): { i: number; rawText: string } {
  const tagName = getTagName(tag)
  if (!tagName || !isRawTextOpenTag(tag, tagName)) {
    return { i: end + 1, rawText: '' }
  }

  const closeStart = findRawTextCloseStart(code, end + 1, tagName)
  if (closeStart === -1) {
    return { i: end + 1, rawText: '' }
  }

  return {
    i: closeStart,
    rawText: code.slice(end + 1, closeStart),
  }
}

/**
 * Finds the end index of a tag while respecting quotes and braces.
 *
 * @param code Full source text.
 * @param start Index of opening `<`.
 * @returns Index of closing `>` or `-1` when not found.
 */
function findTagEnd(code: string, start: number): number {
  let end = start + 1
  let quote: QuoteChar = ''
  let escaped = false
  let braceDepth = 0

  while (end < code.length) {
    const ch = code[end]

    if (quote) {
      if (!escaped && ch === quote) {
        quote = ''
      }
      escaped = !escaped && ch === '\\'
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      escaped = false
    } else {
      if (ch === '{') {
        braceDepth += 1
      } else if (ch === '}' && braceDepth > 0) {
        braceDepth -= 1
      }

      if (ch === '>' && braceDepth === 0) {
        return end
      }
    }

    end += 1
  }

  return -1
}

/**
 * Strips configured attributes from tag-like syntaxes in supported template files.
 *
 * @param code Module source code.
 * @param id Module id.
 * @param options Resolved plugin options.
 * @returns Transformed source and changed marker.
 */
export function stripAttrs(
  code: string,
  id: string,
  options: OptionsResolved,
): StripResult {
  let out = ''
  let i = 0
  let changed = false

  while (i < code.length) {
    const start = code.indexOf('<', i)

    if (start === -1) {
      out += code.slice(i)
      break
    }

    out += code.slice(i, start)

    const commentEnd = readCommentEnd(code, start)
    if (commentEnd === -1) {
      const likelyTagStart = isLikelyTagStart(code, start)
      if (likelyTagStart) {
        const end = findTagEnd(code, start)
        if (end === -1) {
          out += code.slice(start)
          break
        }

        const tag = code.slice(start, end + 1)
        const cleaned = cleanTag(tag, id, options)
        out += cleaned.code
        changed = changed || cleaned.changed

        const next = getNextIndexAfterRawText(code, end, tag)
        const { i: nextIndex, rawText } = next
        out += rawText
        i = nextIndex
      } else {
        out += '<'
        i = start + 1
      }
    } else {
      out += code.slice(start, commentEnd + COMMENT_CLOSE_LEN)
      i = commentEnd + COMMENT_CLOSE_LEN
    }
  }

  return { code: out, changed }
}
