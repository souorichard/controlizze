'use server'

import { revalidateTag } from 'next/cache'
import { createOrg } from '@/http/orgs/create-org'
import type { ActionResponse } from '@/interfaces/action-interface'
import { actionError } from '@/utils/action-error'
import type { CreateOrgData } from './schemas'

export async function createOrgAction({
  name,
  description,
}: CreateOrgData): Promise<ActionResponse> {
  try {
    await createOrg({ name, description })

    revalidateTag('orgs', 'max')
  } catch (error) {
    await actionError(error)
  }

  return {
    success: true,
    message: 'Successfully created organization',
  }
}
