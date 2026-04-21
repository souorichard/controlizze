import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { users } from '../../../db/schema/users.ts'
import { auth } from '../../middlewares/auth.ts'

export const updateAccount: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).patch(
    '/',
    {
      schema: {
        tags: ['User'],
        summary: 'Update account information',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string().min(1, 'Name is required').optional(),
          avatarUrl: z.url().nullable().optional(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const { name, avatarUrl } = request.body

      const data: Partial<typeof users.$inferInsert> = {}

      if (name !== undefined) {
        data.name = name
      }

      if (avatarUrl !== undefined) {
        data.avatarUrl = avatarUrl

        if (avatarUrl === null) {
          data.avatarKey = null
        }
      }

      if (Object.keys(data).length === 0) {
        throw new Error('No data provided for update')
      }

      await db.update(users).set(data).where(eq(users.id, userId))

      return reply.status(204).send()
    },
  )
}
