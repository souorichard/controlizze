import { env } from '@controlizze/env'
import { Resend } from 'resend'

export async function sendInviteEmail(email: string, inviteId: string) {
  const resend = new Resend(env.RESEND_API_KEY)

  const invitePageLink = `${env.NEXT_PUBLIC_WEB_URL}/invite/${inviteId}`

  const html = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Montserrat', 'Arial', sans-serif;
          }
          a {
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #09090B; border: 1px solid #27272A; border-radius: 10px; overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 32px 0; background-color: #27272740;">
                    <img src="../../assets/controlizze/brand.svg" width="244" alt="Controlizze" style="display: block;">
                  </td>
                </tr>
                <!-- Main content -->
                <tr>
                  <td style="padding: 32px 60px; color: #A1A1A1; font-size: 14px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-size: 16px; color: #FAFAFA; font-weight: normal;">
                          Hello!
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 8px; color: #A1A1A1; font-size: 14px;">
                          You have been invited to join <span style="font-weight: 500; color: #FAFAFA;">Controlizze</span>. To accept the invitation, click on the link below:
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 28px;" align="center">
                          <a href="${invitePageLink}" target="_blank" style="display: inline-block; width: 100%; height: 36px; line-height: 36px; background-color: #EFB100; color: #432004; font-weight: 600; text-align: center; border-radius: 6px;">
                            Accept invitation
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 28px; font-size: 12px; text-align: center; color: #A1A1A1;">
                          If you was not expecting this invitation, please ignore this email
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  await resend.emails.send({
    from: 'Controlizze <no-reply@resend.dev>',
    to: [email],
    subject: 'Invite to join Controlizze!',
    html,
  })
}
