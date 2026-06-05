import cron from 'node-cron'
import { env } from '../env.ts'
import { generateRecurrences } from '../services/recurrences/generate-recurrences.ts'

export function startRecurrencesJob() {
  if (env.NODE_ENV !== 'production') {
    console.log('[RecurrencesJob] Started!')
  }

  let isRunning = false

  async function run() {
    if (isRunning) return

    isRunning = true

    const startedAt = Date.now()

    try {
      const processed = await generateRecurrences()

      if (env.NODE_ENV !== 'production' && processed > 0) {
        console.log(
          `[RecurrencesJob] Processed ${processed} items in ${Date.now() - startedAt}ms`,
        )
      }
    } catch (error) {
      console.error('[RecurrencesJob] Error:', error)
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
