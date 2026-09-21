import { and, eq, lt } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { invites } from '../db/schema/invites.ts'
import { createJob } from '../utils/create-job.ts'

export function expireInvitesJob() {
  createJob({
    name: 'ExpireInvitesJob',
    fn: async () => {
      await db
        .update(invites)
        .set({ status: 'EXPIRED' })
        .where(
          and(eq(invites.status, 'PENDING'), lt(invites.expiresAt, new Date())),
        )
    },
    schedule: {
      production: '0 0 * * *',
      development: '*/5 * * * *',
    },
  })
}
