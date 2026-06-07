import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getTotalTransactionsAmount } from '../../../services/metrics/get-total-transactions-amount.ts'
import { auth } from '../../middlewares/auth.ts'

export const getSavingsRateMetrics: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Metrics'],
        summary: 'Get organization savings rate',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            rate: z.number(),
            transactionsCount: z.number(),
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
        }),

        getTotalTransactionsAmount(org.id, {
          type: 'EXPENSE',
        }),
      ])

      const rate =
        income.totalAmount === 0
          ? expense.totalAmount > 0
            ? -100
            : 0
          : Math.round(
              ((income.totalAmount - expense.totalAmount) /
                income.totalAmount) *
                100,
            )

      // biome-ignore lint/style/noNonNullAssertion: totalCount is guaranteed when accumulated is false
      const transactionsCount = income.totalCount! + expense.totalCount!

      return {
        rate,
        transactionsCount,
      }
    },
  )
}
