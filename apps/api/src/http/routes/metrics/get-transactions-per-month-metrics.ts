import dayjs from 'dayjs'
import { sql } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { auth } from '../../middlewares/auth.ts'

type MonthlyTransaction = {
  date: Date
  incomes: number
  expenses: number
}

export const getTransactionsPerMonthMetrics: FastifyPluginAsyncZod = async (
  app,
) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Metrics'],
        summary: 'Get organization transactions per month',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          months: z.coerce.number().min(1).max(12).optional().default(6),
        }),
        response: {
          200: z.object({
            transactions: z.array(
              z.object({
                date: z.date(),
                expenses: z.number(),
                incomes: z.number(),
              }),
            ),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params
      const { months } = request.query

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org } = await request.getUserMembership(slug, userId)

      const startDate = dayjs()
        .subtract(months - 1, 'months')
        .startOf('month')
      const endDate = dayjs().endOf('month')

      const monthlyTransactions = await db.execute<MonthlyTransaction>(sql`
        SELECT 
          DATE_TRUNC('month', ${schema.transactions.transactionDate}) as date,
          COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'INCOME' THEN ${schema.transactions.amount} ELSE 0 END), 0) as incomes,
          COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'EXPENSE' THEN ${schema.transactions.amount} ELSE 0 END), 0) as expenses
        FROM ${schema.transactions}
        WHERE ${schema.transactions.orgId} = ${org.id}
          AND ${schema.transactions.status} != 'CANCELED'
          AND ${schema.transactions.transactionDate} BETWEEN ${startDate.toDate()} AND ${endDate.toDate()}
        GROUP BY DATE_TRUNC('month', ${schema.transactions.transactionDate})
        ORDER BY date ASC
      `)

      const monthsArray = Array.from({ length: months }, (_, i) =>
        dayjs()
          .subtract(months - 1 - i, 'months')
          .startOf('month'),
      )

      const resultsByMonth = new Map(
        (monthlyTransactions.rows as MonthlyTransaction[]).map((item) => [
          dayjs(item.date).format('YYYY-MM'),
          item,
        ]),
      )

      const transactions = monthsArray.map((month) => {
        const item = resultsByMonth.get(month.format('YYYY-MM'))

        return {
          date: month.toDate(),
          incomes: centsToReal(Number(item?.incomes ?? 0)),
          expenses: centsToReal(Number(item?.expenses ?? 0)),
        }
      })

      return {
        transactions,
      }
    },
  )
}
