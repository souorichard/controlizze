import { sendInviteEmail } from './send-invite-email.ts'
import { sendRecoverPasswordEmail } from './send-recover-password-email.ts'
import { sendVerifyEmailEmail } from './send-verify-email-email.ts'

export const emails = {
  sendRecoverPasswordEmail,
  sendInviteEmail,
  sendVerifyEmailEmail,
}
