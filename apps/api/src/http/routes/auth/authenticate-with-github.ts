import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { env } from '../../../env.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'

export const authenticateWithGithub: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Authenticate with Github',
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

      const githubOAuthUrl = new URL(
        'https://github.com/login/oauth/access_token',
      )

      githubOAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID)
      githubOAuthUrl.searchParams.set('client_secret', env.GITHUB_CLIENT_SECRET)
      githubOAuthUrl.searchParams.set(
        'redirect_uri',
        `${env.WEB_URL}/api/auth/callback/github`,
      )
      githubOAuthUrl.searchParams.set('code', code)

      const githubAccessTokenResponse = await fetch(githubOAuthUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessTokenData = await githubAccessTokenResponse.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessTokenData)

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      })

      const githubUserData = await githubUserResponse.json()

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number().transform(String),
          name: z.string().nullable(),
          email: z.string().nullable(),
          avatar_url: z.url(),
        })
        .parse(githubUserData)

      if (email === null) {
        throw new BadRequestError(
          'We could not retrieve your email from Github. Please make sure your email is public in your Github account settings.',
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
            eq(schema.authAccounts.provider, 'GITHUB'),
            eq(schema.authAccounts.userId, user.id),
          ),
        )
        .limit(1)

      if (!authAccount) {
        authAccount = await db.insert(schema.authAccounts).values({
          provider: 'GITHUB',
          providerAccountId: githubId,
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
