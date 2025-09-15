'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

import { getCurrentOrganization } from '@/auth/auth'
import { leaveOrganization } from '@/http/organization/leave-organization'
import { deleteOrganization } from '@/http/organization/shutdown-organization'
import { updateOrganizationDomain } from '@/http/organization/update-organization-domain'
import { updateOrganizationName } from '@/http/organization/update-organization-name'
import { ActionResponse } from '@/interfaces/action-response'

import { OrganizationDomainFormData } from './_components/organization-domain-form'
import { OrganizationNameFormData } from './_components/organization-name-form'

export async function updateOrganizationNameAction({
  name,
}: OrganizationNameFormData): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    await updateOrganizationName({ organization: currentOrganization!, name })
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
    message: 'Successfully updated organization name.',
  }
}

export async function updateOrganizationDomainAction({
  domain,
  shouldAttachUsersByDomain,
}: OrganizationDomainFormData): Promise<ActionResponse> {
  const currentOrganization = await getCurrentOrganization()

  try {
    await updateOrganizationDomain({
      organization: currentOrganization!,
      domain,
      shouldAttachUsersByDomain,
    })
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
    message:
      'Successfully updated organization domain and option to attach users.',
  }
}

export async function leaveOrganizationAction() {
  const currentOrganization = await getCurrentOrganization()

  try {
    await leaveOrganization(currentOrganization!)

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
    message: 'Successfully leaved organization.',
  }
}

export async function deleteOrganizationAction() {
  const currentOrganization = await getCurrentOrganization()

  await deleteOrganization({
    organization: currentOrganization!,
  })

  redirect('/')
}
