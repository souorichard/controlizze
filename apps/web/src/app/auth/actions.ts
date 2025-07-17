'use server'

import { env } from '@controlizze/env'
import { redirect } from 'next/navigation'

export async function signInWithGithubAction() {
  const githubSignInUrl = new URL('login/oauth/authorize', 'https://github.com')

  githubSignInUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
  githubSignInUrl.searchParams.set(
    'redirect_uri',
    env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
  )
  githubSignInUrl.searchParams.set('scope', 'user:email')

  redirect(githubSignInUrl.toString())
}

export async function signInWithGoogleAction() {
  const googleSignInUrl = new URL(
    'o/oauth2/v2/auth',
    'https://accounts.google.com',
  )

  googleSignInUrl.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
  googleSignInUrl.searchParams.set(
    'redirect_uri',
    env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
  )
  googleSignInUrl.searchParams.set('scope', 'openid email profile')
  googleSignInUrl.searchParams.set('response_type', 'code')
  googleSignInUrl.searchParams.set('access_type', 'offline') // optional, for refresh token

  redirect(googleSignInUrl.toString())
}
