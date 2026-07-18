'use server'

import { resetPassword } from '@/http/auth/reset-password'
import type { ActionResponse } from '@/interfaces/action'
import { actionError } from '@/utils/action-error'

interface ResetPasswordActionProps {
  code: string
  password: string
}

export async function resetPasswordAction({
  code,
  password,
}: ResetPasswordActionProps): Promise<ActionResponse> {
  try {
    await resetPassword({ code, password })
  } catch (error) {
    return await actionError(error)
  }

  return {
    success: true,
    message:
      'Senha redefinida com sucesso! Agora você já pode fazer login com sua nova senha.',
  }
}
