'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { updateProfileName } from '@/http/auth/update-profile-name'
import { ActionResponse } from '@/interfaces/action-response'

import { ProfileNameFormData } from './_components/profile-name-form'

export async function updateProfileNameAction({
  name,
}: ProfileNameFormData): Promise<ActionResponse> {
  try {
    await updateProfileName({ name })

    revalidateTag('profile')
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
    message: 'Successfully updated profile name.',
  }
}
