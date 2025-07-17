import { env } from '@controlizze/env'
import { Resend } from 'resend'

import { User } from '@/generated'

export async function sendRecoverPasswordEmail(user: User, code: string) {
  const resend = new Resend(env.RESEND_API_KEY)

  const recoveryLink = `${env.NEXT_PUBLIC_WEB_URL}/reset-password?code=${code}`

  await resend.emails.send({
    from: 'Controlizze <no-reply@resend.dev>',
    to: [user.email],
    subject: 'Recover your password!',
    html: `
      <div style="font-family: sans-serif; width: 80%; height: 280px; margin: 0 auto; padding: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border: 2px solid #e4e4e7; border-radius: 10px">
        <p style="font-size: 20px; font-weight: bold;">Hello, ${user.name}</p>

        <p>You requested to recover password of your account in <b>Controlizze</b>. To recover your password, click on the link below:</p>

        <a href="${recoveryLink}" target="_blank" style="margin-bottom: 20px; padding: 8px 20px; background-color: #efb100; color: #733e0a; text-decoration: none; border-radius: 6px; font-size: 14px;">Reset password</a>

        <span style="font-size: 12px; color: #9f9fa9;">If you did not request to recover your password, please ignore this email.</span>
      </div>
    `,
  })
}
