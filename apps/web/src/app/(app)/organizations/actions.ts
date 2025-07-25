'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'

import { createOrganization } from '@/http/organization/create-organization'
import { ActionResponse } from '@/interfaces/action-response'

import { UpsertOrganizationFormData } from './_components/organization-form'

export async function createOrganizationAction({
  name,
  domain,
  shouldAttachUsersByDomain,
}: UpsertOrganizationFormData): Promise<ActionResponse> {
  try {
    await createOrganization({ name, domain, shouldAttachUsersByDomain })

    revalidateTag('organizations')
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
    message: 'Successfully created organization.',
  }
}
