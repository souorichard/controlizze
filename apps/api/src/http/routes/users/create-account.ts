import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { users } from '../../../db/schema/users.ts'
import { ConflictError } from '../../errors/conflict-error.ts'

export const createAccount: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/',
    {
      schema: {
        tags: ['User'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string().min(1, 'Name is required'),
          email: z.email('Invalid email address').min(1, 'Email is required'),
          password: z
            .string()
            .min(8, 'Password must be at least 6 characters long'),
        }),
        response: {
          201: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const [userWithSameEmail] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (userWithSameEmail) {
        throw new ConflictError('User with this email already exists')
      }

      const hashPassword = await hash(password, 8)

      await db.insert(users).values({
        name,
        email,
        hashPassword,
      })

      return reply.status(201).send()
    },
  )
}
