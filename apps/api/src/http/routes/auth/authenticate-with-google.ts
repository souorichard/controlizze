import { env } from '../../../env.ts'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { authAccounts } from '../../../db/schema/auth-accounts.ts'
import { users } from '../../../db/schema/users.ts'

export const authenticateWithGoogle: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Authenticate with Google',
        body: z.object({
          code: z.string(),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const googleOAuthUrl = new URL('https://oauth2.googleapis.com/token')

      googleOAuthUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID)
      googleOAuthUrl.searchParams.set('client_secret', env.GOOGLE_CLIENT_SECRET)
      googleOAuthUrl.searchParams.set(
        'redirect_uri',
        `${env.WEB_URL}/api/auth/callback/google`,
      )
      googleOAuthUrl.searchParams.set('code', code)
      googleOAuthUrl.searchParams.set('grant_type', 'authorization_code')

      const googleAccessTokenResponse = await fetch(googleOAuthUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const googleAccessTokenData = await googleAccessTokenResponse.json()

      const { access_token: googleAccessToken } = z
        .object({
          id_token: z.string(),
          access_token: z.string(),
          expires_in: z.number(),
          refresh_token: z.string().optional(),
          token_type: z.literal('Bearer'),
          scope: z.string(),
        })
        .parse(googleAccessTokenData)

      const googleUserResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      )

      const googleUserData = await googleUserResponse.json()

      const {
        id: googleId,
        name,
        email,
        picture: avatarUrl,
      } = z
        .object({
          id: z.string(),
          name: z.string().optional(),
          given_name: z.string().optional(),
          family_name: z.string().optional(),
          email: z.email().nullable(),
          verified_email: z.boolean(),
          picture: z.url().nullable(),
          locale: z.string().optional(),
        })
        .parse(googleUserData)

      if (email === null) {
        throw new Error(
          'Your Google account must have an e-mail address for authentication or you need to make it public',
        )
      }

      let [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (!user) {
        user = await db.insert(users).values({
          name,
          email,
          avatarUrl,
        })
      }

      let [authAccount] = await db
        .select()
        .from(authAccounts)
        .where(
          and(
            eq(authAccounts.provider, 'GOOGLE'),
            eq(authAccounts.userId, user.id),
          ),
        )
        .limit(1)

      if (!authAccount) {
        authAccount = await db.insert(authAccounts).values({
          provider: 'GOOGLE',
          providerAccountId: googleId,
          userId: user.id,
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(200).send({ token })
    },
  )
}
