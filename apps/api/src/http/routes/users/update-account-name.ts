import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { users } from '../../../db/schema/users.ts'
import { auth } from '../../middlewares/auth.ts'

export const updateAccountName: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).patch(
    '/',
    {
      schema: {
        tags: ['User'],
        summary: 'Update account name',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string().min(1, 'Name is required'),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const { name } = request.body

      await db
        .update(users)
        .set({
          name,
        })
        .where(eq(users.id, userId))

      return reply.status(204).send()
    },
  )
}
