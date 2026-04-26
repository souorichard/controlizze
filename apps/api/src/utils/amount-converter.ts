export function realToCents(value: number): number {
  return Math.round(value * 100)
}

export function centsToReal(value: number): number {
  return value / 100
}
