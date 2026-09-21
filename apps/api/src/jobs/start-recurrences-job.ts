import { generateRecurrences } from '../services/recurrences/generate-recurrences.ts'
import { createJob } from '../utils/create-job.ts'

export function startRecurrencesJob() {
  createJob({
    name: 'RecurrencesJob',
    fn: async () => {
      await generateRecurrences()
    },
    schedule: {
      production: '0 0 * * *',
      development: '*/5 * * * *',
    },
  })
}
