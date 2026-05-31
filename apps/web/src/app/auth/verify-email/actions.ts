'use server'

import { verifyEmail } from '@/http/auth/verifiy-email'
import type { ActionResponse } from '@/interfaces/action-interface'
import { actionError } from '@/utils/action-error'

export async function verifyEmailAction(code: string): Promise<ActionResponse> {
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
