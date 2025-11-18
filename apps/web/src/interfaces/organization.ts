export type Plan = 'FREE' | 'PRO'

export interface Organization {
  id: string
  name: string
  slug: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
  plan: Plan
  avatarUrl: string | null
  ownerId: string
}
