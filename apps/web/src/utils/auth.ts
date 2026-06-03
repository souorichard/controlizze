import { defineAbilityFor } from '@controlizze/rbac'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getMembership } from '@/http/orgs/get-membership'
import { getAccount } from '@/http/users/get-account'

export async function isAuthenticated() {
  const cookieStore = await cookies()

  const token = cookieStore.get('auth-token')?.value

  return !!token
}

export async function getCurrentOrg() {
  const cookieStore = await cookies()

  return cookieStore.get('org')?.value ?? null
}

export async function getCurrentMembership() {
  const org = await getCurrentOrg()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org as string)

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

  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getAccount()

    return { user }
  } catch {}

  redirect('/api/auth/sign-out')
}
