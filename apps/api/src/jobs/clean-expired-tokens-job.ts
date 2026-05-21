import { lt } from 'drizzle-orm'
import cron from 'node-cron'
import { db } from '../db/index.ts'
import { tokens } from '../db/schema/tokens.ts'
import { env } from '../env.ts'

export function cleanExpiredTokensJob() {
  if (env.NODE_ENV !== 'production') {
    console.log('[CleanExpiredTokensJob] Started!')
  }

  let isRunning = false

  async function run() {
    if (isRunning) return

    isRunning = true

    const startedAt = Date.now()

    try {
      const result = await db
        .delete(tokens)
        .where(lt(tokens.expiresAt, new Date()))
        .returning({ id: tokens.id })

      if (env.NODE_ENV !== 'production' && result.length > 0) {
        console.log(
          `[CleanExpiredTokensJob] Deleted ${result.length} tokens in ${Date.now() - startedAt}ms`,
        )
      }
    } catch (error) {
      console.error('[CleanExpiredTokensJob] Error:', error)
    } finally {
      isRunning = false
    }
  }

  // run immediately
  run()

  // every day at midnight in production, every 5 minutes in dev
  cron.schedule(
    env.NODE_ENV === 'production' ? '0 0 * * *' : '*/5 * * * *',
    run,
  )
}
