'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { deleteProfile } from '@/http/auth/delete-profile'
import { updateProfileEmail } from '@/http/auth/update-profile-email'
import { updateProfileName } from '@/http/auth/update-profile-name'
import { ActionResponse } from '@/interfaces/action-response'

import { ProfileEmailFormData } from './_components/profile-email-form'
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

export async function updateProfileEmailAction({
  email,
}: ProfileEmailFormData): Promise<ActionResponse> {
  try {
    await updateProfileEmail({ email })

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
    message: 'Successfully updated profile email.',
  }
}

export async function deleteProfileAction() {
  try {
    await deleteProfile()
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
    message: 'Successfully deleted profile.',
  }
}
