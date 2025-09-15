import { defineAbilityFor } from '@controlizze/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getProfile } from '@/http/auth/get-profile'
import { getMembership } from '@/http/organization/get-membership'

export async function isAuthenticated() {
  const cookieStore = await cookies()

  const token = cookieStore.get('token')?.value

  return !!token
}

export async function getCurrentOrganization() {
  const cookieStore = await cookies()

  return cookieStore.get('organization')?.value ?? null
}

export async function getCurrentMembership() {
  const organization = await getCurrentOrganization()

  if (!organization) {
    return null
  }

  const { membership } = await getMembership(organization!)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export async function auth() {
  const cookieStore = await cookies()

  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch {}

  redirect('/api/auth/sign-out')
}
