'use server'

import { cookies } from 'next/headers'
import { authenticateWithPassword } from '@/http/auth/authenticate-with-password'
import type { ActionResponse } from '@/interfaces/action-interface'
import { actionError } from '@/utils/action-error'
import type { SignInData } from './schemas'

export async function signIn({
  email,
  password,
}: SignInData): Promise<ActionResponse> {
  try {
    const { token } = await authenticateWithPassword({ email, password })

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch (error) {
    return actionError(error)
  }

  return {
    success: true,
    message: 'Autenticado com sucesso!',
  }
}
