export function parseNdjsonSamples(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[]

  if (typeof value === 'string') {
    const lines = value.split('\n').map((l) => l.trim()).filter(Boolean)
    return lines.map((line) => { try { return JSON.parse(line) } catch { return {} } })
  }

  if (value && typeof value === 'object') return [value as Record<string, unknown>]

  return []
}
