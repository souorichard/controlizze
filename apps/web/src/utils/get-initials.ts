export function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return initials
}

export function getTwiceInitialsLetters(name: string): string {
  const letters = name.slice(0, 2).toUpperCase()

  return letters
}
