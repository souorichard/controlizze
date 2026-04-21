import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { users } from '../../../db/schema/users.ts'

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
            .min(8, 'Password must be at least 6 characters long'),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const [userFromEmail] = await db
        .select({ id: users.id, hashPassword: users.hashPassword })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (!userFromEmail) {
        throw new Error('User does not exist')
      }

      if (!userFromEmail.hashPassword) {
        throw new Error(
          'User does not have a password set, please use another authentication method',
        )
      }

      const isPassword = await compare(password, userFromEmail.hashPassword)

      if (!isPassword) {
        throw new Error('Invalid credentials')
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
