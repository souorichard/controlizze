import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { authenticateWithGithub } from '@/http/auth/authenticate-with-github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      {
        message: 'Github OAuth code was not found.',
      },
      {
        status: 400,
      },
    )
  }

  const { token } = await authenticateWithGithub({ code })

  const cookieStore = await cookies()

  cookieStore.set('auth-token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'

  return NextResponse.redirect(redirectUrl)
}
