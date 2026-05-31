'use server'

import { createAccount } from '@/http/auth/create-account'
import type { ActionResponse } from '@/interfaces/action-interface'
import { actionError } from '@/utils/action-error'
import type { SignUpData } from './schemas'

export async function signUp({
  name,
  email,
  password,
}: SignUpData): Promise<ActionResponse> {
  try {
    await createAccount({ name, email, password })
  } catch (error) {
    return await actionError(error)
  }

  return {
    success: true,
    message:
      'Conta criada com sucesso! Verifique seu email para confirmar sua conta.',
  }
}
