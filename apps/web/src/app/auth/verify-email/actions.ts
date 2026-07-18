'use server'

import { verifyEmail } from '@/http/auth/verifiy-email'
import type { ActionResponse } from '@/interfaces/action'
import { actionError } from '@/utils/action-error'

interface VerifyEmailActionProps {
  code: string
}

export async function verifyEmailAction({
  code,
}: VerifyEmailActionProps): Promise<ActionResponse> {
  try {
    await verifyEmail({ code })
  } catch (error) {
    return await actionError(error)
  }

  return {
    success: true,
    message: 'Email verificado com sucesso!',
  }
}
