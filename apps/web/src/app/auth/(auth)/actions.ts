'use server'

import { redirect } from 'next/navigation'
import { env } from '@/env'

export async function signInWithGoogleAction() {
  const googleSignInUrl = new URL(
    'o/oauth2/v2/auth',
    'https://accounts.google.com',
  )

  googleSignInUrl.searchParams.set(
    'client_id',
    env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  )
  googleSignInUrl.searchParams.set(
    'redirect_uri',
    `${env.NEXT_PUBLIC_WEB_URL}/api/auth/callback/google`,
  )
  googleSignInUrl.searchParams.set('scope', 'openid email profile')
  googleSignInUrl.searchParams.set('response_type', 'code')
  googleSignInUrl.searchParams.set('access_type', 'offline') // optional, for refresh token

  redirect(googleSignInUrl.toString())
}

export async function signInWithGithubAction() {
  const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInUrl.searchParams.set(
    'client_id',
    env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  )
  githubSignInUrl.searchParams.set(
    'redirect_uri',
    `${env.NEXT_PUBLIC_WEB_URL}/api/auth/callback/github`,
  )
  githubSignInUrl.searchParams.set('scope', 'user:email')

  redirect(githubSignInUrl.toString())
}
