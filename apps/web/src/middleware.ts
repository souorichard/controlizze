import { NextRequest, NextResponse } from 'next/server'

import { getUrl } from './utils/get-url'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  const { pathname } = request.nextUrl

  if (pathname.includes('/auth') && token) {
    return NextResponse.redirect(new URL(getUrl('/')))
  }

  if (pathname.includes('/orgs') && !token) {
    return NextResponse.redirect(new URL(getUrl('/auth/sign-in')))
  }

  if (
    pathname.includes('/reset') &&
    !request.nextUrl.searchParams.get('code')
  ) {
    return NextResponse.redirect(new URL(getUrl('/auth/forgot-password')))
  }

  const response = NextResponse.next()

  if (pathname.startsWith('/orgs')) {
    const [, , slug] = pathname.split('/')

    response.cookies.set('organization', slug)
  } else {
    response.cookies.delete('organization')
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
