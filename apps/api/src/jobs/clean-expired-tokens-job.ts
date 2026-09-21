import { lt } from 'drizzle-orm'
import { db } from '../db/index.ts'
import { tokens } from '../db/schema/tokens.ts'
import { createJob } from '../utils/create-job.ts'

export function cleanExpiredTokensJob() {
  createJob({
    name: 'CleanExpiredTokensJob',
    fn: async () => {
      await db.delete(tokens).where(lt(tokens.expiresAt, new Date()))
    },
    schedule: {
      production: '0 0 * * *',
      development: '*/5 * * * *',
    },
  })
}
