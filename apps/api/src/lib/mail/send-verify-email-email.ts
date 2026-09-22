import { env } from '../../env.ts'
import { resend } from './resend.ts'

const LOGO_URL = `${env.WEB_URL}/logo-light.png`

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

  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your Controlizze email</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

                <!-- Logo -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <img src="${LOGO_URL}" alt="Controlizze" width="140" style="display:block;" />
                  </td>
                </tr>

                <!-- Card -->
                <tr>
                  <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#6366f1;padding:32px 40px;">
                          <p style="margin:0;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);letter-spacing:0.08em;text-transform:uppercase;">Email verification</p>
                          <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">Verify your email</h1>
                        </td>
                      </tr>
                    </table>

                    <!-- Body -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:36px 40px;">

                          <p style="margin:0 0 8px;font-size:15px;color:#71717a;">Hi ${userName ?? 'there'},</p>
                          <p style="margin:0 0 28px;font-size:15px;color:#18181b;line-height:1.7;">
                            Thanks for signing up for Controlizze! Click the button below to verify your email address and activate your account.
                          </p>

                          <!-- CTA -->
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background:#6366f1;border-radius:10px;">
                                <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                                  Verify email →
                                </a>
                              </td>
                            </tr>
                          </table>

                          <p style="margin:20px 0 0;font-size:12px;color:#a1a1aa;">
                            Or copy and paste this link into your browser:<br />
                            <a href="${verifyUrl}" style="color:#6366f1;word-break:break-all;">${verifyUrl}</a>
                          </p>

                        </td>
                      </tr>
                    </table>

                    <!-- Footer -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-top:1px solid #f4f4f5;padding:20px 40px;">
                          <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.7;">
                            This link expires in <strong>24 hours</strong>. If you didn't create a Controlizze account, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Bottom -->
                <tr>
                  <td align="center" style="padding-top:24px;">
                    <p style="margin:0;font-size:12px;color:#a1a1aa;">© ${new Date().getFullYear()} Controlizze. All rights reserved.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`

  await resend.emails.send({
    from: 'Controlizze <onboarding@resend.dev>',
    to,
    subject: `Verify your Controlizze email`,
    html,
  })
}
