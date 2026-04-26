import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { categories } from '../../../db/schema/categories.ts'
import { transactions } from '../../../db/schema/transactions.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { statusSchema, typeSchema } from '../../schemas/index.ts'

export const getTransactions: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Transaction'],
        summary: 'Get organization transactions',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            transactions: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
                type: typeSchema,
                category: z
                  .object({
                    id: z.uuid(),
                    name: z.string(),
                    slug: z.string(),
                    color: z.string(),
                  })
                  .nullable(),
                amount: z.number(),
                status: statusSchema,
                transactionDate: z.date(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Transaction')) {
        throw new UnauthorizedError(
          `You're not allowed to see organization transactions`,
        )
      }

      const allTransactions = await db
        .select({
          id: transactions.id,
          title: transactions.title,
          description: transactions.description,
          type: transactions.type,
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            color: categories.color,
          },
          amount: transactions.amount,
          status: transactions.status,
          transactionDate: transactions.transactionDate,
        })
        .from(transactions)
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(eq(transactions.orgId, org.id))

      const allTransactionsWithFormattedAmount = allTransactions.map(
        (transaction) => {
          return {
            ...transaction,
            amount: centsToReal(transaction.amount),
          }
        },
      )

      return {
        transactions: allTransactionsWithFormattedAmount,
      }
    },
  )
}
