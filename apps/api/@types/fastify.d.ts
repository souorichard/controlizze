import 'fastify'

import type { InferSelectModel } from 'drizzle-orm'
import type { members } from '../src/db/schema/members.ts'

// import type { organizations } from '../src/db/schema/organizations.ts'

interface Organization {
  id: string
  name: string
  slug: string
  owner: {
    id: string
    name: string | null
    avatarUrl: string | null
  }
  avatarUrl: string | null
  createdAt: Date
}
type Member = InferSelectModel<typeof members>

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    verifyEmailVerification(userId: string): Promise<void>
    getUserMembership(
      slug: string,
      userId: string,
    ): Promise<{ org: Organization; membership: Member }>
  }
}
