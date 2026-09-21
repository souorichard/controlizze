import { and, count, eq, sum } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { auth } from '../../middlewares/auth.ts'

export const getPendingTransactionsMetrics: FastifyPluginAsyncZod = async (
  app,
) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Metrics'],
        summary: 'Get organization pending transactions',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            amount: z.number(),
            count: z.number(),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org } = await request.getUserMembership(slug, userId)

      const [result] = await db
        .select({
          total: sum(schema.transactions.amount),
          count: count(),
        })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.orgId, org.id),
            eq(schema.transactions.status, 'PENDING'),
          ),
        )

      return {
        amount: centsToReal(Number(result?.total ?? 0)),
        count: Number(result?.count ?? 0),
      }
    },
  )
}
