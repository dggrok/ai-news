export function absoluteUrl(href: string, base: string) {
  try {
    return new URL(href, base).toString()
  } catch {
    return href
  }
}

export function toISODate(input?: string | Date | null): string | undefined {
  if (!input) return undefined
  try {
    if (input instanceof Date) return input.toISOString()
    const d = new Date(input)
    if (!Number.isNaN(d.getTime())) return d.toISOString()
  } catch {}
  return undefined
}

export function hash(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h).toString(36)
}

export function uniqBy<T>(arr: T[], key: (x: T) => string) {
  const m = new Map<string, T>()
  for (const item of arr) {
    const k = key(item)
    if (!m.has(k)) m.set(k, item)
  }
  return Array.from(m.values())
}
