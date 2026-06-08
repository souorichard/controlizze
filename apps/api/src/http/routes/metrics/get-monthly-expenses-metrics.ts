import dayjs from 'dayjs'
import { and, eq, gte, lte, ne } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { auth } from '../../middlewares/auth.ts'

export const getMonthlyExpensesMetrics: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Metrics'],
        summary: 'Get last 6 months expenses amount',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            expenses: z.array(
              z.object({
                date: z.date(),
                amount: z.number(),
              }),
            ),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org } = await request.getUserMembership(slug, userId)

      const startDate = dayjs().subtract(5, 'month').startOf('month')
      const endDate = dayjs().endOf('month')

      const transactions = await db
        .select({
          amount: schema.transactions.amount,
          transactionDate: schema.transactions.transactionDate,
        })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.orgId, org.id),
            eq(schema.transactions.type, 'EXPENSE'),
            ne(schema.transactions.status, 'CANCELED'),
            gte(schema.transactions.transactionDate, startDate.toDate()),
            lte(schema.transactions.transactionDate, endDate.toDate()),
          ),
        )

      const months = Array.from({ length: 6 }, (_, index) => ({
        date: startDate.add(index, 'month'),
        amount: 0,
      }))

      for (const transaction of transactions) {
        const monthIndex = dayjs(transaction.transactionDate).diff(
          startDate,
          'month',
        )

        const month = months[monthIndex]

        if (!month) continue

        month.amount += transaction.amount
      }

      return {
        expenses: months.map((month) => ({
          date: month.date.toDate(),
          amount: centsToReal(month.amount),
        })),
      }
    },
  )
}
