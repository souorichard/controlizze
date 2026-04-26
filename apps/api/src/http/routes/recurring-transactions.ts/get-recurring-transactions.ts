import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
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
          id: schema.recurringTransactions.id,
          title: schema.recurringTransactions.title,
          description: schema.recurringTransactions.description,
          type: schema.recurringTransactions.type,
          category: {
            id: schema.categories.id,
            name: schema.categories.name,
            slug: schema.categories.slug,
            color: schema.categories.color,
          },
          amount: schema.recurringTransactions.amount,
          status: schema.recurringTransactions.status,
          frequency: schema.recurringTransactions.frequency,
          interval: schema.recurringTransactions.interval,
          startDate: schema.recurringTransactions.startDate,
          endDate: schema.recurringTransactions.endDate,
        })
        .from(schema.recurringTransactions)
        .leftJoin(
          schema.categories,
          eq(schema.recurringTransactions.categoryId, schema.categories.id),
        )
        .where(eq(schema.recurringTransactions.orgId, org.id))

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
