import { randomBytes } from 'node:crypto'

export function createSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
}

export function generateSlugWithSuffix(text: string): string {
  const baseSlug = createSlug(text)
  const suffix = randomBytes(3).toString('hex') // ex: a1b2c3

  return `${baseSlug}-${suffix}`
}
