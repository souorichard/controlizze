import { env } from '../../env.ts'
import { resend } from '../../lib/resend.ts'

interface SendRecoverPasswordEmailProps {
  to: string
  code: string
  userName: string | null
}

export async function sendRecoverPasswordEmail({
  to,
  code,
  userName,
}: SendRecoverPasswordEmailProps) {
  const recoverUrl = `${env.WEB_URL}/sessions/forgot-password/reset?code=${code}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Redefinição de senha',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background: oklch(76.9% 0.188 70.08); padding: 2rem 2rem 1.5rem;">
          <p style="margin: 0; font-size: 20px; font-weight: 500; color: #3a1a00;">Controlizze</p>
        </div>
        <div style="padding: 2rem;">
          <p style="margin: 0 0 1rem; font-size: 15px; color: #666;">Olá, ${userName ? userName : ''}</p>
          <p style="margin: 0 0 1.5rem; font-size: 15px; color: #111; line-height: 1.6;">
            Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.
          </p>
          <a href="${recoverUrl}" style="display: inline-block; background: oklch(76.9% 0.188 70.08); color: #3a1a00; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">
            Redefinir senha
          </a>
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #999; line-height: 1.6;">
              Este link expira em 1 hora. Se você não solicitou a redefinição de senha, pode ignorar este email com segurança — sua senha permanece a mesma.
            </p>
          </div>
        </div>
      </div>
    `,
  })
}
