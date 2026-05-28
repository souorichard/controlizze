import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Início',
}

export default function HomePage() {
  return (
    <div>
      <h1>Hello, autenticado!</h1>
      <a href="/api/auth/sign-out">Sair</a>
    </div>
  )
}
