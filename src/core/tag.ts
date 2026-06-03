import type { OptionsResolved, RemoveAttrContext, StripResult } from '../types'
import { matchesPattern, normalizeAttrName } from './pattern'
import { parseAttrValue, readValueEnd, skipWhitespace } from './value'

interface AttrToken {
  leadingWs: string
  name: string
  source: string
  value: string | undefined
}

type TagPart =
  | { type: 'end'; text: string; next: number }
  | { type: 'raw'; text: string; next: number }
  | { type: 'attr'; token: AttrToken; next: number }

/**
 * Determines whether a tag should be skipped entirely.
 *
 * @param tag Full tag literal.
 * @param options Resolved plugin options.
 * @returns Skip metadata with parse cursor index.
 */
function shouldSkipTag(
  tag: string,
  options: OptionsResolved,
): { skip: boolean; index: number } {
  let i = skipWhitespace(tag, 1)
  if (tag[i] === '/' || tag[i] === '!' || tag[i] === '?') {
    return { skip: true, index: i }
  }

  const start = i
  while (i < tag.length && /[A-Za-z0-9_:.-]/u.test(tag[i])) {
    i += 1
  }

  if (start === i) {
    return { skip: true, index: i }
  }

  const tagName = tag.slice(start, i)
  const skip = options.ignoreTagNames.some(pattern =>
    matchesPattern(tagName, pattern, options.caseSensitive),
  )

  return { skip, index: i }
}

/**
 * Tokenizes a single tag segment into an ending marker, raw text, or attribute.
 *
 * @param tag Full tag literal.
 * @param start Current cursor index.
 * @returns Parsed tag segment.
 */
function readTagPart(tag: string, start: number): TagPart {
  const wsEnd = skipWhitespace(tag, start)
  const ws = tag.slice(start, wsEnd)

  if (tag[wsEnd] === '>') {
    return { type: 'end', text: `${ws}>`, next: wsEnd + 1 }
  }

  if (tag[wsEnd] === '/' && tag[wsEnd + 1] === '>') {
    return { type: 'end', text: `${ws}/>`, next: wsEnd + 2 }
  }

  let i = wsEnd
  const nameStart = i
  while (i < tag.length && /[^\s=/>]/u.test(tag[i])) {
    i += 1
  }

  if (nameStart === i) {
    return { type: 'raw', text: `${ws}${tag[i] ?? ''}`, next: i + 1 }
  }

  const rawName = tag.slice(nameStart, i)
  const afterName = i
  i = skipWhitespace(tag, i)

  if (tag[i] === '=') {
    i += 1
    i = skipWhitespace(tag, i)
    i = readValueEnd(tag, i)
  }

  const rawValuePart = tag.slice(afterName, i)

  return {
    type: 'attr',
    token: {
      leadingWs: ws,
      name: normalizeAttrName(rawName),
      source: `${rawName}${rawValuePart}`,
      value: parseAttrValue(rawValuePart),
    },
    next: i,
  }
}

/**
 * Decides if a matched removable attribute should still be preserved.
 *
 * @param token Parsed attribute token.
 * @param id Module id.
 * @param options Resolved plugin options.
 * @returns Whether the attribute should be kept.
 */
function shouldKeepAttr(
  token: AttrToken,
  id: string,
  options: OptionsResolved,
): boolean {
  const ctx: RemoveAttrContext = {
    id,
    attrName: token.name,
    attrValue: token.value,
  }

  const keepByName = options.keepAttrs.some(rule => {
    if (typeof rule === 'function') {
      return rule(ctx)
    }

    return matchesPattern(token.name, rule, options.caseSensitive)
  })

  const keepByValue =
    token.value !== undefined &&
    options.keepValues.some(pattern =>
      matchesPattern(token.value as string, pattern, options.caseSensitive),
    )

  return keepByName || keepByValue
}

/**
 * Strips removable attributes from one tag literal.
 *
 * @param tag Full tag literal.
 * @param id Module id.
 * @param options Resolved plugin options.
 * @returns Cleaned tag result.
 */
export function cleanTag(
  tag: string,
  id: string,
  options: OptionsResolved,
): StripResult {
  const meta = shouldSkipTag(tag, options)
  if (meta.skip) {
    return { code: tag, changed: false }
  }

  let i = meta.index
  let out = tag.slice(0, i)
  let changed = false

  while (i < tag.length) {
    const part = readTagPart(tag, i)
    i = part.next

    if (part.type === 'end') {
      out += part.text
      break
    } else if (part.type === 'raw') {
      out += part.text
    } else {
      const canRemove = options.attrs.some(pattern =>
        matchesPattern(part.token.name, pattern, options.caseSensitive),
      )

      const shouldKeep = shouldKeepAttr(part.token, id, options)
      if (!canRemove || shouldKeep) {
        out += part.token.leadingWs + part.token.source
      } else {
        changed = true
      }
    }
  }

  return { code: out, changed }
}
