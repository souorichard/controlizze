import cron from 'node-cron'
import { env } from '../env.ts'

interface CreateJobOptions {
  name: string
  fn: () => Promise<void>
  schedule: {
    production: string
    development: string
  }
}

export function createJob({ name, fn, schedule }: CreateJobOptions) {
  if (env.NODE_ENV !== 'production') {
    console.log(`[${name}] Started!`)
  }

  let isRunning = false

  async function run() {
    if (isRunning) return

    isRunning = true
    const startedAt = Date.now()

    try {
      await fn()

      if (env.NODE_ENV !== 'production') {
        console.log(`[${name}] Done in ${Date.now() - startedAt}ms`)
      }
    } catch (error) {
      console.error(`[${name}] Error:`, error)
    } finally {
      isRunning = false
    }
  }

  run()

  cron.schedule(
    env.NODE_ENV === 'production' ? schedule.production : schedule.development,
    run,
  )
}
