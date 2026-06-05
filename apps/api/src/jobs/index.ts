import { expireInvitesJob } from './expire-invites-job.ts'
import { startRecurrencesJob } from './start-recurrences-job.ts'

export function registerJobs() {
  startRecurrencesJob()
  expireInvitesJob()
}
