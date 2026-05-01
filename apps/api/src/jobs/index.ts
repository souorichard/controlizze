import { expireInvitesJob } from './expire-invites.ts'
import { startRecurringTransactionsJob } from './start-recurring-transactions-job.ts'

export function registerJobs() {
  startRecurringTransactionsJob()
  expireInvitesJob()
}
