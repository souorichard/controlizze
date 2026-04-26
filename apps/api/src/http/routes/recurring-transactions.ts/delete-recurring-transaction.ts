import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { recurringTransactions } from '../../../db/schema/recurring-transactions.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const deleteRecurringTransaction: FastifyPluginAsyncZod = async (
  app,
) => {
  app.register(auth).delete(
    '/',
    {
      schema: {
        tags: ['Recurring transaction'],
        summary: 'Delete recurring transaction',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          recurringTransactionId: z.string(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, recurringTransactionId } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('delete', 'Transaction')) {
        throw new UnauthorizedError(
          `You're not allowed to delete recurring transactions`,
        )
      }

      const [recurringTransaction] = await db
        .delete(recurringTransactions)
        .where(
          and(
            eq(recurringTransactions.id, recurringTransactionId),
            eq(recurringTransactions.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
