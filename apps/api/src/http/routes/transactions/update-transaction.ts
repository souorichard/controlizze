import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { transactions } from '../../../db/schema/transactions.ts'
import { realToCents } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { statusSchema, typeSchema } from '../../schemas/index.ts'

export const updateTransaction: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).put(
    '/',
    {
      schema: {
        tags: ['Transaction'],
        summary: 'Update transaction details',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          transactionId: z.uuid(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string().nullable().optional(),
          type: typeSchema,
          categoryId: z.uuid(),
          amount: z.coerce.number(),
          status: statusSchema,
          transactionDate: z.coerce.date().optional(),
          recurringTransactionId: z.uuid().nullable().optional(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, transactionId } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('update', 'Transaction')) {
        throw new UnauthorizedError(`You're not allowed to update transactions`)
      }

      const {
        title,
        description,
        type,
        categoryId,
        amount,
        status,
        transactionDate,
        recurringTransactionId,
      } = request.body

      await db
        .update(transactions)
        .set({
          title,
          description,
          type,
          categoryId,
          amount: realToCents(amount),
          status,
          transactionDate: transactionDate ?? new Date(),
          recurringTransactionId,
        })
        .where(
          and(
            eq(transactions.id, transactionId),
            eq(transactions.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
