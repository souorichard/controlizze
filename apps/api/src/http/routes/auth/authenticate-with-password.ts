import { compare } from 'bcryptjs'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'
import { ForbiddenError } from '../../errors/forbidden-error.ts'

export const authenticateWithPassword: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['Authentication'],
        summary: 'Authenticate with email and password',
        body: z.object({
          email: z.email('Invalid email address').min(1, 'Email is required'),
          password: z
            .string()
            .min(1, 'Password is required')
            .min(8, 'Password must be at least 8 characters'),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '5 minutes',
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const [userFromEmail] = await db
        .select({
          id: schema.users.id,
          hashPassword: schema.users.passwordHash,
          emailVerifiedAt: schema.users.emailVerifiedAt,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .where(eq(schema.users.email, email))
        .limit(1)

      if (!userFromEmail) {
        throw new BadRequestError('User not found')
      }

      if (!userFromEmail.emailVerifiedAt) {
        const hoursSinceCreation = dayjs().diff(
          dayjs(userFromEmail.createdAt),
          'hour',
        )

        if (hoursSinceCreation > 1) {
          throw new ForbiddenError('Email verification is required')
        }
      }

      if (!userFromEmail.hashPassword) {
        throw new BadRequestError(
          'User does not have a password registered; please use another authentication method',
        )
      }

      const isPassword = await compare(password, userFromEmail.hashPassword)

      if (!isPassword) {
        throw new BadRequestError('Invalid credentials')
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
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
