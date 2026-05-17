import { and, count, eq, ilike } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import {
  frequencySchema,
  recurringStatusSchema,
  typeSchema,
} from '../../schemas.ts'

export const getRecurringTransactions: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Recurring transaction'],
        summary: 'Get organization recurring transactions',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          title: z
            .string()
            .min(3, 'Search term must be at least 3 characters')
            .optional(),
          type: typeSchema.optional(),
          status: recurringStatusSchema.optional(),
          frequency: frequencySchema.optional(),
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(50).default(10),
        }),
        response: {
          200: z.object({
            recurringTransactions: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable().optional(),
                type: typeSchema,
                category: z
                  .object({
                    id: z.uuid(),
                    name: z.string(),
                    color: z.string(),
                  })
                  .nullable(),
                amount: z.number(),
                status: recurringStatusSchema,
                frequency: frequencySchema,
                interval: z.number(),
                startDate: z.date(),
                endDate: z.date().nullable(),
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
      const { title, type, status, frequency, page, perPage } = request.query

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'RecurringTransaction')) {
        throw new UnauthorizedError(
          `You're not allowed to see organization recurring transactions`,
        )
      }

      const filters = and(
        eq(schema.recurringTransactions.orgId, org.id),
        title
          ? ilike(schema.recurringTransactions.title, `%${title}%`)
          : undefined,
        type ? eq(schema.recurringTransactions.type, type) : undefined,
        status ? eq(schema.recurringTransactions.status, status) : undefined,
        frequency
          ? eq(schema.recurringTransactions.frequency, frequency)
          : undefined,
      )

      const [{ total }] = await db
        .select({ total: count() })
        .from(schema.recurringTransactions)
        .where(filters)

      const recurringTransactions = await db
        .select({
          id: schema.recurringTransactions.id,
          title: schema.recurringTransactions.title,
          description: schema.recurringTransactions.description,
          type: schema.recurringTransactions.type,
          category: {
            id: schema.categories.id,
            name: schema.categories.name,
            color: schema.categories.color,
          },
          amount: schema.recurringTransactions.amount,
          status: schema.recurringTransactions.status,
          frequency: schema.recurringTransactions.frequency,
          interval: schema.recurringTransactions.interval,
          startDate: schema.recurringTransactions.startDate,
          endDate: schema.recurringTransactions.endDate,
        })
        .from(schema.recurringTransactions)
        .leftJoin(
          schema.categories,
          eq(schema.recurringTransactions.categoryId, schema.categories.id),
        )
        .where(filters)
        .limit(perPage)
        .offset((page - 1) * perPage)

      const recurringTransactionsWithFormattedAmount =
        recurringTransactions.map((transaction) => {
          return {
            ...transaction,
            amount: centsToReal(transaction.amount),
          }
        })

      return {
        recurringTransactions: recurringTransactionsWithFormattedAmount,
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
