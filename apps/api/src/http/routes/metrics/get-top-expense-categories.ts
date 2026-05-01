import { desc, eq, sql } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { auth } from '../../middlewares/auth.ts'

export const getTopExpenseCategories: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Metrics'],
        summary: 'Get organization top expense categories',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            categories: z.array(
              z.object({
                category: z.string(),
                amount: z.number(),
              }),
            ),
          }),
        },
      },
    },
    async (request) => {
      const { slug } = request.params

      const { org } = await request.getUserMembership(slug)

      const amountSum = sql<number>`coalesce(sum(${schema.transactions.amount}), 0)`

      const topExpenses = await db
        .select({
          category: sql<string>`coalesce(${schema.categories.name}, 'Uncategorized')`,
          amount: amountSum,
        })
        .from(schema.transactions)
        .leftJoin(
          schema.categories,
          eq(schema.transactions.categoryId, schema.categories.id),
        )
        .where(
          sql`
            ${schema.transactions.orgId} = ${org.id}
            and ${schema.transactions.type} = 'EXPENSE'
            and ${schema.transactions.status} != 'CANCELED'
          `,
        )
        .groupBy(schema.categories.id, schema.categories.name)
        .orderBy(desc(amountSum))
        .limit(6)

      return {
        categories: topExpenses.map((item) => ({
          category: item.category,
          amount: centsToReal(Number(item.amount) || 0),
        })),
      }
    },
  )
}
