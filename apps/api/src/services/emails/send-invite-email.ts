import { env } from '../../env.ts'
import { resend } from '../../lib/resend.ts'

interface SendInviteEmailProps {
  to: string
  code: string
  orgName: string
  authorName: string | null
  role: string
}

export async function sendInviteEmail({
  to,
  code,
  orgName,
  authorName,
  role,
}: SendInviteEmailProps) {
  const inviteUrl = `${env.WEB_URL}/invites?code=${code}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: `Você foi convidado para ${orgName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background: oklch(76.9% 0.188 70.08); padding: 2rem 2rem 1.5rem;">
          <p style="margin: 0; font-size: 20px; font-weight: 500; color: #3a1a00;">Controlizze</p>
        </div>
        <div style="padding: 2rem;">
          <p style="margin: 0 0 1rem; font-size: 15px; color: #666;">Olá,</p>
          <p style="margin: 0 0 1.5rem; font-size: 15px; color: #111; line-height: 1.6;">
            <strong>${authorName ?? 'Alguém'}</strong> convidou você para fazer parte da organização <strong>${orgName}</strong> como <strong>${role}</strong>.
          </p>
          <a href="${inviteUrl}" style="display: inline-block; background: oklch(76.9% 0.188 70.08); color: #3a1a00; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">
            Aceitar convite
          </a>
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #999; line-height: 1.6;">
              Este convite expira em 7 dias. Se você não esperava receber este convite, pode ignorar este email com segurança.
            </p>
          </div>
        </div>
      </div>
    `,
  })
}
