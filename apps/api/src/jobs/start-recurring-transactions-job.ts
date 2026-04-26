import { env } from '../env.ts'
import { generateRecurringTransactions } from '../services/recurring-transactions/generate-recurring-transactions.ts'

export function startRecurringTransactionsJob() {
  const INTERVAL = 1000 * 60 * 5 // 5 min

  let isRunning = false

  async function run() {
    if (isRunning) return

    isRunning = true

    const startedAt = Date.now()

    try {
      const processed = await generateRecurringTransactions()

      if (env.NODE_ENV !== 'production' && processed > 0) {
        console.log(
          `[RecurringJob] Processed ${processed} items in ${Date.now() - startedAt}ms`,
        )
      }
    } catch (error) {
      console.error('[RecurringJob] Error:', error)
    } finally {
      isRunning = false
    }
  }

  // run immediately
  run()

  // schedule
  setInterval(run, INTERVAL)
}
