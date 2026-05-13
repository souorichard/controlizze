import dayjs from 'dayjs'
import { and, eq, gte, lte, ne } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { auth } from '../../middlewares/auth.ts'

export const getBalanceEvolutionMetrics: FastifyPluginAsyncZod = async (
  app,
) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Metrics'],
        summary: 'Get monthly organization balance evolution for a given year',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          year: z
            .string()
            .regex(/^\d{4}$/)
            .default(dayjs().year().toString()),
        }),
        response: {
          200: z.object({
            evolutions: z.array(
              z.object({
                date: z.string(),
                balance: z.number(),
              }),
            ),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params
      const { year } = request.query

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org } = await request.getUserMembership(slug, userId)

      const start = dayjs().year(Number(year)).startOf('year')
      const end = dayjs().year(Number(year)).endOf('year')

      const transactions = await db
        .select({
          type: schema.transactions.type,
          amount: schema.transactions.amount,
          transactionDate: schema.transactions.transactionDate,
        })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.orgId, org.id),
            ne(schema.transactions.status, 'CANCELED'),
            gte(schema.transactions.transactionDate, start.toDate()),
            lte(schema.transactions.transactionDate, end.toDate()),
          ),
        )

      const months = Array.from({ length: 12 }, (_, index) => ({
        date: dayjs().year(Number(year)).month(index).startOf('month'),
        income: 0,
        expense: 0,
      }))

      for (const transaction of transactions) {
        const monthIndex = transaction.transactionDate.getUTCMonth()
        const month = months[monthIndex]

        if (!month) continue

        if (transaction.type === 'INCOME') {
          month.income += transaction.amount
        } else {
          month.expense += transaction.amount
        }
      }

      let runningBalance = 0

      const evolutions = months.map((month) => {
        const monthBalance = month.income - month.expense

        runningBalance += monthBalance

        return {
          date: dayjs(month.date).format('MMMM'),
          balance: centsToReal(runningBalance),
        }
      })

      return { evolutions }
    },
  )
}
