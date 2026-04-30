import dayjs from 'dayjs'
import { sql } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { auth } from '../../middlewares/auth.ts'

type PeriodTransaction = {
  date: Date
  incomes: number
  expenses: number
}

export const getTransactionsPerPeriod: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Metrics'],
        summary: 'Get organization transactions per period',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          lastMonths: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            transactions: z.array(
              z.object({
                date: z.string(),
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
      const { lastMonths } = request.query

      const { org } = await request.getUserMembership(slug)

      const startDate = dayjs().subtract(lastMonths, 'months').startOf('month')
      const endDate = dayjs().endOf('day')

      const periodTransactions = await db.execute<PeriodTransaction>(sql`
        SELECT 
          DATE_TRUNC('day', ${schema.transactions.transactionDate}) as date,
          COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'INCOME' THEN ${schema.transactions.amount} ELSE 0 END), 0) as incomes,
          COALESCE(SUM(CASE WHEN ${schema.transactions.type} = 'EXPENSE' THEN ${schema.transactions.amount} ELSE 0 END), 0) as expenses
        FROM ${schema.transactions}
        WHERE ${schema.transactions.orgId} = ${org.id}
          AND ${schema.transactions.status} != 'CANCELED'
          AND ${schema.transactions.transactionDate} BETWEEN ${startDate.toDate()} AND ${endDate.toDate()}
        GROUP BY DATE_TRUNC('day', ${schema.transactions.transactionDate})
        ORDER BY date ASC
      `)

      return {
        transactions: (periodTransactions.rows as PeriodTransaction[]).map(
          (item) => ({
            date: dayjs(item.date).format('MMM DD'),
            incomes: centsToReal(Number(item.incomes) || 0),
            expenses: centsToReal(Number(item.expenses) || 0),
          }),
        ),
      }
    },
  )
}
