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
          categorySlug: z.string().optional(),
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
                owner: z.object({
                  id: z.uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                }),
                createdAt: z.date(),
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
        categorySlug,
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
          'You do not have permission to view transactions in this organization',
        )
      }

      const filters = and(
        eq(schema.transactions.orgId, org.id),
        title ? ilike(schema.transactions.title, `%${title}%`) : undefined,
        type ? eq(schema.transactions.type, type) : undefined,
        status ? eq(schema.transactions.status, status) : undefined,
        categorySlug ? eq(schema.categories.slug, categorySlug) : undefined,
        startDate
          ? gte(schema.transactions.transactionDate, startDate)
          : undefined,
        endDate ? lte(schema.transactions.transactionDate, endDate) : undefined,
      )

      const [{ total }] = await db
        .select({ total: count() })
        .from(schema.transactions)
        .leftJoin(
          schema.categories,
          eq(schema.transactions.categoryId, schema.categories.id),
        )
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
          owner: {
            id: schema.users.id,
            name: schema.users.name,
            avatarUrl: schema.users.avatarUrl,
          },
          createdAt: schema.transactions.createdAt,
        })
        .from(schema.transactions)
        .leftJoin(
          schema.categories,
          eq(schema.transactions.categoryId, schema.categories.id),
        )
        .innerJoin(
          schema.users,
          eq(schema.transactions.ownerId, schema.users.id),
        )
        .where(filters)
        .limit(perPage)
        .offset((page - 1) * perPage)

      const transactionsWithFormattedAmount = transactions.map(
        (transaction) => {
          return {
            ...transaction,
            amount: centsToReal(transaction.amount),
            category: transaction.category?.id ? transaction.category : null,
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
