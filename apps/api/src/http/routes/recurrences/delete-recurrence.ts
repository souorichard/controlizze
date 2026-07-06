import { recurrenceSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const deleteRecurrence: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/',
    {
      schema: {
        tags: ['Recurrence'],
        summary: 'Delete recurrence',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          recurrenceId: z.string(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, recurrenceId } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      const [recurrence] = await db
        .select({
          id: schema.recurrences.id,
          ownerId: schema.recurrences.ownerId,
        })
        .from(schema.recurrences)
        .where(
          and(
            eq(schema.recurrences.id, recurrenceId),
            eq(schema.recurrences.orgId, org.id),
          ),
        )
        .limit(1)

      if (!recurrence) {
        throw new NotFoundError('Recurrence not found')
      }

      const authRecurrence = recurrenceSchema.parse(recurrence)

      if (cannot('delete', authRecurrence)) {
        throw new UnauthorizedError(
          'You do not have permission to delete this recurrence',
        )
      }

      await db
        .delete(schema.recurrences)
        .where(
          and(
            eq(schema.recurrences.id, recurrenceId),
            eq(schema.recurrences.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
