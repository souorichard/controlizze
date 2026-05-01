import { startRecurringTransactionsJob } from './start-recurring-transactions-job.ts'

export function registerJobs() {
  startRecurringTransactionsJob()
}
