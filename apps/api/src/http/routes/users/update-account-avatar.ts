import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { users } from '../../../db/schema/users.ts'
import { auth } from '../../middlewares/auth.ts'

export const updateAccountAvatar: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).patch(
    '/avatar',
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
        .update(users)
        .set({
          avatarUrl,
        })
        .where(eq(users.id, userId))

      return reply.status(204).send()
    },
  )
}
