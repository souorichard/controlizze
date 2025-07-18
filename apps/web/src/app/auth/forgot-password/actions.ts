import { HTTPError } from 'ky'

import { recoverPassword } from '@/http/recover-password'
import { resetPassword } from '@/http/reset-password'
import { ActionResponse } from '@/interfaces/action-response'

import { RecoverPasswordFormData } from './_components/recover-password-form'
import { ResetPasswordFormData } from './_components/reset-password-form'

export async function recoverPasswordAction({
  email,
}: RecoverPasswordFormData): Promise<ActionResponse> {
  try {
    await recoverPassword({ email })
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
    message: 'Successfully recovered password.',
  }
}

export async function resetPasswordAction({
  code,
  password,
}: Omit<ResetPasswordFormData, 'confirmPassword'> & {
  code: string
}): Promise<ActionResponse> {
  try {
    await resetPassword({ code, password })
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
    message: 'Successfully reset password.',
  }
}
