import 'fastify'

import type { InferSelectModel } from 'drizzle-orm'
import type { members } from '../src/db/schema/members.ts'
import type { organizations } from '../src/db/schema/organizations.ts'

type Organization = InferSelectModel<typeof organizations>
type Member = InferSelectModel<typeof members>

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(
      slug: string,
    ): Promise<{ org: Organization; membership: Member }>
  }
}
