import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getTotalTransactionsAmount } from '../../../services/metrics/get-total-transactions-amount.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { auth } from '../../middlewares/auth.ts'
import { typeSchema } from '../../schemas/index.ts'

export const getTransactionsAmountMetrics: FastifyPluginAsyncZod = async (
  app,
) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Metrics'],
        summary: 'Get organization transactions amount metrics',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          type: typeSchema,
          accumulated: z.coerce.boolean().optional(),
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
      const { type, accumulated } = request.query

      const { org } = await request.getUserMembership(slug)

      const { totalAmount, totalLastMonthAmount } =
        await getTotalTransactionsAmount(org.id, {
          type,
          accumulated,
        })

      const diffFromLastMonth =
        totalLastMonthAmount > 0
          ? ((totalAmount - totalLastMonthAmount) / totalLastMonthAmount) * 100
          : null

      return {
        amount: centsToReal(totalAmount),
        diffFromLastMonth: diffFromLastMonth
          ? Number(diffFromLastMonth.toFixed(1))
          : null,
      }
    },
  )
}
