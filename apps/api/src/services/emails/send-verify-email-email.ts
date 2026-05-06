import { env } from '../../env.ts'
import { resend } from '../../lib/resend.ts'

interface SendVerifyEmailEmailProps {
  to: string
  code: string
  userName: string | null
}

export async function sendVerifyEmailEmail({
  to,
  code,
  userName,
}: SendVerifyEmailEmailProps) {
  const verifyUrl = `${env.WEB_URL}/auth/verify-email?code=${code}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Verifique seu e-mail',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background: oklch(76.9% 0.188 70.08); padding: 2rem 2rem 1.5rem;">
          <p style="margin: 0; font-size: 20px; font-weight: 500; color: #3a1a00;">Controlizze</p>
        </div>
        <div style="padding: 2rem;">
          <p style="margin: 0 0 1rem; font-size: 15px; color: #666;">Olá, ${userName ?? ''}</p>
          <p style="margin: 0 0 1.5rem; font-size: 15px; color: #111; line-height: 1.6;">
            Obrigado por se cadastrar no Controlizze! Clique no botão abaixo para verificar seu e-mail e ativar sua conta.
          </p>
          <a href="${verifyUrl}" style="display: inline-block; background: oklch(76.9% 0.188 70.08); color: #3a1a00; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">
            Verificar e-mail
          </a>
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #999; line-height: 1.6;">
              Este link expira em 24 horas. Se você não criou uma conta no Controlizze, pode ignorar este email com segurança.
            </p>
          </div>
        </div>
      </div>
    `,
  })
}
