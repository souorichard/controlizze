import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { auth } from '../../middlewares/auth.ts'

export const updateAccountAvatar: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).patch(
    '/',
    {
      schema: {
        tags: ['User'],
        summary: 'Update account avatar',
        security: [{ bearerAuth: [] }],
        body: z.object({
          avatarUrl: z.url(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const { avatarUrl } = request.body

      await db
        .update(schema.users)
        .set({
          avatarUrl,
        })
        .where(eq(schema.users.id, userId))

      return reply.status(204).send()
    },
  )
}
