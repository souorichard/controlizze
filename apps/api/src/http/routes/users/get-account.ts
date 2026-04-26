import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const getAccount: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['User'],
        summary: 'Get account information',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            user: z.object({
              id: z.uuid(),
              name: z.string().nullable(),
              email: z.email(),
              avatarUrl: z.url().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const [user] = await db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          avatarUrl: schema.users.avatarUrl,
        })
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1)

      if (!user) {
        throw new NotFoundError('User does not exist')
      }

      return {
        user,
      }
    },
  )
}
