import type { PropsWithChildren } from 'react'

export function ErrorMessage({ children }: PropsWithChildren) {
  return <p className="text-sm text-destructive">{children}</p>
}
