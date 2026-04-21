import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { users } from '../../../db/schema/users.ts'
import { auth } from '../../middlewares/auth.ts'

export const deleteAccount: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/',
    {
      schema: {
        tags: ['User'],
        summary: 'Delete account',
        security: [{ bearerAuth: [] }],
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      await db.delete(users).where(eq(users.id, userId))

      return reply.status(204).send()
    },
  )
}
