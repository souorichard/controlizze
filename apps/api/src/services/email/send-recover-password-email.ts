import { env } from '@controlizze/env'
import { Resend } from 'resend'

import { User } from '@/generated'

export async function sendRecoverPasswordEmail(user: User, code: string) {
  const resend = new Resend(env.RESEND_API_KEY)

  const recoveryLink = `${env.NEXT_PUBLIC_WEB_URL}/auth/forgot-password/reset?code=${code}`

  await resend.emails.send({
    from: 'Controlizze <no-reply@resend.dev>',
    to: [user.email],
    subject: 'Recover your password!',
    html: `
      <table width="80%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:600px; border: 2px solid #e4e4e7; border-radius: 10px; font-family: Arial, sans-serif;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <p style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #111;">Hello, ${user.name}</p>
            <p style="font-size: 16px; margin: 0 0 24px 0; color: #111;">
              You requested to recover password of your account in <strong>Controlizze</strong>. To recover your password, click on the link below:
            </p>
            <a href="${recoveryLink}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #efb100; color: #733e0a; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; margin-bottom: 20px;">
              Reset password
            </a>
            <p style="font-size: 12px; color: #9f9fa9; margin: 0;">
              If you did not request to recover your password, please ignore this email.
            </p>
          </td>
        </tr>
      </table>
    `,
  })
}
