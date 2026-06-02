import { recurringTransactionSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
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
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      const [recurringTransaction] = await db
        .select({
          id: schema.recurringTransactions.id,
          ownerId: schema.recurringTransactions.ownerId,
        })
        .from(schema.recurringTransactions)
        .where(
          and(
            eq(schema.recurringTransactions.id, recurringTransactionId),
            eq(schema.recurringTransactions.orgId, org.id),
          ),
        )
        .limit(1)

      if (!recurringTransaction) {
        throw new NotFoundError('Transação recorrente não encontrada')
      }

      const authRecurringTransaction =
        recurringTransactionSchema.parse(recurringTransaction)

      if (cannot('delete', authRecurringTransaction)) {
        throw new UnauthorizedError(
          `Você não tem permissão para deletar esta transação recorrente`,
        )
      }

      await db
        .delete(schema.recurringTransactions)
        .where(
          and(
            eq(schema.recurringTransactions.id, recurringTransactionId),
            eq(schema.recurringTransactions.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
