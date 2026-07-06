import { transactionSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'

export const deleteTransaction: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).delete(
    '/',
    {
      schema: {
        tags: ['Transaction'],
        summary: 'Delete transaction',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          transactionId: z.uuid(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, transactionId } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      const [transaction] = await db
        .select({
          id: schema.transactions.id,
          ownerId: schema.transactions.ownerId,
        })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.id, transactionId),
            eq(schema.transactions.orgId, org.id),
          ),
        )
        .limit(1)

      if (!transaction) {
        throw new NotFoundError('Transaction not found')
      }

      const authTransaction = transactionSchema.parse(transaction)

      if (cannot('delete', authTransaction)) {
        throw new UnauthorizedError(
          'You do not have permission to delete this transaction',
        )
      }

      await db
        .delete(schema.transactions)
        .where(
          and(
            eq(schema.transactions.id, transactionId),
            eq(schema.transactions.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
