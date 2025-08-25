export function centsToReal(cents: number): number {
  return cents / 100
}

export function realToCents(real: number): number {
  return Math.round(real * 100)
}
