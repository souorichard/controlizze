import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getTotalTransactionsAmount } from '../../../services/metrics/get-total-transactions-amount.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { auth } from '../../middlewares/auth.ts'

export const getTransactionsBalanceAmountMetrics: FastifyPluginAsyncZod =
  async (app) => {
    app.register(auth).get(
      '/',
      {
        schema: {
          tags: ['Metrics'],
          summary: 'Get organization transactions balance amount metrics',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              amount: z.number(),
              diffFromLastMonth: z.number().nullable(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        await request.verifyEmailVerification(userId)
        const { org } = await request.getUserMembership(slug, userId)

        const [income, expense] = await Promise.all([
          getTotalTransactionsAmount(org.id, {
            type: 'INCOME',
            accumulated: true,
          }),

          getTotalTransactionsAmount(org.id, {
            type: 'EXPENSE',
            accumulated: true,
          }),
        ])

        const totalBalanceAmount = income.totalAmount - expense.totalAmount

        const totalBalanceLastMonthAmount =
          income.totalLastMonthAmount - expense.totalLastMonthAmount

        const diffFromLastMonth =
          totalBalanceLastMonthAmount !== 0
            ? ((totalBalanceAmount - totalBalanceLastMonthAmount) /
                Math.abs(totalBalanceLastMonthAmount)) *
              100
            : null

        return {
          amount: centsToReal(totalBalanceAmount),
          diffFromLastMonth:
            diffFromLastMonth !== null
              ? Number(diffFromLastMonth.toFixed(1))
              : null,
        }
      },
    )
  }
