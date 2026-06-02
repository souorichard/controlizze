import { and, count, eq, gte, ilike, lte } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { statusSchema, typeSchema } from '../../schemas.ts'

export const getTransactions: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Transaction'],
        summary: 'Get organization transactions',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          title: z
            .string()
            .min(3, 'Termo de busca deve ter pelo menos 3 caracteres')
            .optional(),
          type: typeSchema.optional(),
          status: statusSchema.optional(),
          categoryId: z.uuid().optional(),
          startDate: z.coerce.date().optional(),
          endDate: z.coerce.date().optional(),
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(50).default(10),
        }),
        response: {
          200: z.object({
            transactions: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
                type: typeSchema,
                category: z
                  .object({
                    id: z.uuid(),
                    name: z.string(),
                    color: z.string(),
                  })
                  .nullable(),
                amount: z.number(),
                status: statusSchema,
                transactionDate: z.date(),
              }),
            ),
            meta: z.object({
              page: z.number(),
              perPage: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const {
        title,
        type,
        status,
        categoryId,
        startDate,
        endDate,
        page,
        perPage,
      } = request.query

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Transaction')) {
        throw new UnauthorizedError(
          `Você não tem permissão para visualizar transações desta organização`,
        )
      }

      const filters = and(
        eq(schema.transactions.orgId, org.id),
        title ? ilike(schema.transactions.title, `%${title}%`) : undefined,
        type ? eq(schema.transactions.type, type) : undefined,
        status ? eq(schema.transactions.status, status) : undefined,
        categoryId ? eq(schema.transactions.categoryId, categoryId) : undefined,
        startDate
          ? gte(schema.transactions.transactionDate, startDate)
          : undefined,
        endDate ? lte(schema.transactions.transactionDate, endDate) : undefined,
      )

      const [{ total }] = await db
        .select({ total: count() })
        .from(schema.transactions)
        .where(filters)

      const transactions = await db
        .select({
          id: schema.transactions.id,
          title: schema.transactions.title,
          description: schema.transactions.description,
          type: schema.transactions.type,
          category: {
            id: schema.categories.id,
            name: schema.categories.name,
            color: schema.categories.color,
          },
          amount: schema.transactions.amount,
          status: schema.transactions.status,
          transactionDate: schema.transactions.transactionDate,
        })
        .from(schema.transactions)
        .leftJoin(
          schema.categories,
          eq(schema.transactions.categoryId, schema.categories.id),
        )
        .where(filters)
        .limit(perPage)
        .offset((page - 1) * perPage)

      const transactionsWithFormattedAmount = transactions.map(
        (transaction) => {
          return {
            ...transaction,
            amount: centsToReal(transaction.amount),
          }
        },
      )

      return {
        transactions: transactionsWithFormattedAmount,
        meta: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      }
    },
  )
}
