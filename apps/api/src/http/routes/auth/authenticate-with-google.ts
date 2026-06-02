import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { env } from '../../../env.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'

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
        throw new BadRequestError(
          'Sua conta do Google deve ter um endereço de e-mail para autenticação ou você precisa torná-lo público',
        )
      }

      let [user] = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)

      if (!user) {
        user = await db.insert(schema.users).values({
          name,
          email,
          avatarUrl,
        })
      }

      let [authAccount] = await db
        .select()
        .from(schema.authAccounts)
        .where(
          and(
            eq(schema.authAccounts.provider, 'GOOGLE'),
            eq(schema.authAccounts.userId, user.id),
          ),
        )
        .limit(1)

      if (!authAccount) {
        authAccount = await db.insert(schema.authAccounts).values({
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
