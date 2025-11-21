import { env } from '@controlizze/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function authenticateWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with Google',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const googleOAuthUrl = new URL('https://oauth2.googleapis.com/token')

      googleOAuthUrl.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
      googleOAuthUrl.searchParams.set(
        'client_secret',
        env.GOOGLE_OAUTH_CLIENT_SECRET,
      )
      googleOAuthUrl.searchParams.set(
        'redirect_uri',
        env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
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
          'Your Google account must have an e-mail address for authentication or you need to make it public',
        )
      }

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GOOGLE',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GOOGLE',
            providerAccountId: googleId,
            userId: user.id,
          },
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

      return reply.status(201).send({ token })
    },
  )
}
