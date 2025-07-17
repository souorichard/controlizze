'use server'

import { HTTPError } from 'ky'

import { createAccount } from '@/http/create-account'
import { ActionResponse } from '@/interfaces/action-response'

import { SignUpFormData } from './_components/sign-up-form'

export async function createAccountAction({
  name,
  email,
  password,
}: Omit<SignUpFormData, 'confirmPassword'>): Promise<ActionResponse> {
  try {
    await createAccount({ name, email, password })
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
    message: 'Successfully created account.',
  }
}
