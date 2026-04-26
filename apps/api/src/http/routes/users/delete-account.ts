import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
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

      await db.delete(schema.users).where(eq(schema.users.id, userId))

      return reply.status(204).send()
    },
  )
}
