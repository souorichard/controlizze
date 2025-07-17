'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { ActionResponse } from '@/interfaces/action-response'

import { SignInFormData } from './_components/sign-in-form'

export async function signInWithPasswordAction({
  email,
  password,
}: SignInFormData): Promise<ActionResponse> {
  try {
    const { token } = await signInWithPassword({ email, password })

    const cookieStore = await cookies()

    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
      }
    }

    return {
      success: false,
      message: 'Internal server error.',
    }
  }

  return {
    success: true,
    message: 'Successfully signed in.',
  }
}
