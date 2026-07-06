export function createAvatar(name: string, style: string): string {
  const seed = encodeURIComponent(name)
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`
}
