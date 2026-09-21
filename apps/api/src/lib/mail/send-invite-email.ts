import { env } from '../../env.ts'
import { resend } from './resend.ts'

const LOGO_BASE64 =
  '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'

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
  const author = authorName ?? 'Someone'
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>You've been invited to ${orgName}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

                <!-- Logo -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <img src="data:image/png;base64,${LOGO_BASE64}" alt="Controlizze" width="140" style="display:block;" />
                  </td>
                </tr>

                <!-- Card -->
                <tr>
                  <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#6366f1;padding:32px 40px;">
                          <p style="margin:0;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);letter-spacing:0.08em;text-transform:uppercase;">Organization invite</p>
                          <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">${orgName}</h1>
                        </td>
                      </tr>
                    </table>

                    <!-- Body -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:36px 40px;">

                          <p style="margin:0 0 8px;font-size:15px;color:#71717a;">Hi there,</p>
                          <p style="margin:0 0 28px;font-size:15px;color:#18181b;line-height:1.7;">
                            <strong style="color:#18181b;">${author}</strong> has invited you to join
                            <strong style="color:#18181b;">${orgName}</strong> on Controlizze as
                            <strong style="color:#6366f1;">${roleLabel}</strong>.
                          </p>

                          <!-- Role badge -->
                          <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                            <tr>
                              <td style="background:#f4f4f5;border-radius:8px;padding:14px 20px;">
                                <table cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="padding-right:16px;">
                                      <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">Organization</p>
                                      <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#18181b;">${orgName}</p>
                                    </td>
                                    <td style="border-left:1px solid #e4e4e7;padding-left:16px;">
                                      <p style="margin:0;font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">Role</p>
                                      <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#6366f1;">${roleLabel}</p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- CTA -->
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background:#6366f1;border-radius:10px;">
                                <a href="${inviteUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                                  Accept invitation →
                                </a>
                              </td>
                            </tr>
                          </table>

                          <p style="margin:20px 0 0;font-size:12px;color:#a1a1aa;">
                            Or copy and paste this link into your browser:<br />
                            <a href="${inviteUrl}" style="color:#6366f1;word-break:break-all;">${inviteUrl}</a>
                          </p>

                        </td>
                      </tr>
                    </table>

                    <!-- Footer -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-top:1px solid #f4f4f5;padding:20px 40px;">
                          <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.7;">
                            This invitation expires in <strong>7 days</strong>. If you weren't expecting this invite, you can safely ignore this email.
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
    subject: `You've been invited to join ${orgName}`,
    html,
  })
}
