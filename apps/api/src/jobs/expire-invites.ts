import { and, eq, lt } from 'drizzle-orm'
import cron from 'node-cron'
import { db } from '../db/index.ts'
import { invites } from '../db/schema/invites.ts'
import { env } from '../env.ts'

export function expireInvitesJob() {
  if (env.NODE_ENV !== 'production') {
    console.log('[ExpireInvitesJob] Started!')
  }

  let isRunning = false

  async function run() {
    if (isRunning) return

    isRunning = true

    const startedAt = Date.now()

    try {
      const result = await db
        .update(invites)
        .set({ status: 'EXPIRED' })
        .where(
          and(eq(invites.status, 'PENDING'), lt(invites.expiresAt, new Date())),
        )
        .returning({ id: invites.id })

      if (env.NODE_ENV !== 'production' && result.length > 0) {
        console.log(
          `[ExpireInvitesJob] Expired ${result.length} invites in ${Date.now() - startedAt}ms`,
        )
      }
    } catch (error) {
      console.error('[ExpireInvitesJob] Error:', error)
    } finally {
      isRunning = false
    }
  }

  // run immediately
  run()

  // every day at midnight
  // however for dev, every 5 minutes
  cron.schedule('*/5 * * * *', run)
}
