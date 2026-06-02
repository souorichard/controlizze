import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
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
          name: z.string().min(1, 'Nome é obrigatório'),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)

      const { name } = request.body

      await db
        .update(schema.users)
        .set({
          name,
        })
        .where(eq(schema.users.id, userId))

      return reply.status(204).send()
    },
  )
}
