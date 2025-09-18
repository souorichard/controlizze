'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { deleteProfile } from '@/http/auth/delete-profile'
import { updateProfileAvatar } from '@/http/auth/update-profile-avatar'
import { updateProfileEmail } from '@/http/auth/update-profile-email'
import { updateProfileName } from '@/http/auth/update-profile-name'
import { uploadProfileAvatar } from '@/http/storage/upload-profile-avatar'
import { ActionResponse } from '@/interfaces/action-response'

import { ProfileAvatarFormData } from './_components/profile-avatar-form'
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

export async function updateProfileAvatarAction({
  file,
}: ProfileAvatarFormData): Promise<ActionResponse> {
  try {
    const { url } = await uploadProfileAvatar({ file })

    await updateProfileAvatar({ avatarUrl: url })

    revalidateTag('profile')

    return {
      success: true,
      message: 'Successfully updated profile avatar.',
      savedUrl: url,
    }
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
