'use server'

import { requestPasswordRecover } from '@/http/auth/request-password-recover'
import type { ActionResponse } from '@/interfaces/action-interface'
import { actionError } from '@/utils/action-error'

interface RequestPasswordRecoverActionProps {
  email: string
}

export async function requestPasswordRecoverAction({
  email,
}: RequestPasswordRecoverActionProps): Promise<ActionResponse> {
  try {
    await requestPasswordRecover({ email })
  } catch (error) {
    return await actionError(error)
  }

  return {
    success: true,
    message: 'Email de recuperação de senha enviado com sucesso!',
  }
}
