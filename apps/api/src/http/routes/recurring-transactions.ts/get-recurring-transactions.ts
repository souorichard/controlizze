import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { categories } from '../../../db/schema/categories.ts'
import { recurringTransactions } from '../../../db/schema/recurring-transactions.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import {
  frequencySchema,
  recurringStatusSchema,
  typeSchema,
} from '../../schemas/index.ts'

export const getRecurringTransactions: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Recurring transaction'],
        summary: 'Get organization recurring transactions',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            recurringTransactions: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable().optional(),
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
                status: recurringStatusSchema,
                frequency: frequencySchema,
                interval: z.number(),
                startDate: z.date(),
                endDate: z.date().nullable(),
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
          `You're not allowed to see organization recurring transactions`,
        )
      }

      const allRecurringTransactions = await db
        .select({
          id: recurringTransactions.id,
          title: recurringTransactions.title,
          description: recurringTransactions.description,
          type: recurringTransactions.type,
          category: {
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            color: categories.color,
          },
          amount: recurringTransactions.amount,
          status: recurringTransactions.status,
          frequency: recurringTransactions.frequency,
          interval: recurringTransactions.interval,
          startDate: recurringTransactions.startDate,
          endDate: recurringTransactions.endDate,
        })
        .from(recurringTransactions)
        .leftJoin(
          categories,
          eq(recurringTransactions.categoryId, categories.id),
        )
        .where(eq(recurringTransactions.orgId, org.id))

      const allRecurringTransactionsWithFormattedAmount =
        allRecurringTransactions.map((transaction) => {
          return {
            ...transaction,
            amount: centsToReal(transaction.amount),
          }
        })

      return {
        recurringTransactions: allRecurringTransactionsWithFormattedAmount,
      }
    },
  )
}
