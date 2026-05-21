import { expireInvitesJob } from './expire-invites-job.ts'
import { startRecurringTransactionsJob } from './start-recurring-transactions-job.ts'

export function registerJobs() {
  startRecurringTransactionsJob()
  expireInvitesJob()
}
