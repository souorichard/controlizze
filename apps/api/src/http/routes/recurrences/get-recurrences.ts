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
  recurrenceStatusSchema,
  typeSchema,
} from '../../schemas.ts'

export const getRecurrences: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Recurrence'],
        summary: 'Get organization recurrences',
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
          status: recurrenceStatusSchema.optional(),
          frequency: frequencySchema.optional(),
          page: z.coerce.number().min(1).default(1),
          perPage: z.coerce.number().min(1).max(50).default(10),
        }),
        response: {
          200: z.object({
            recurrences: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable().optional(),
                type: typeSchema.transform((v) => v.toLowerCase()),
                category: z
                  .object({
                    id: z.uuid(),
                    name: z.string(),
                    color: z.string(),
                  })
                  .nullable(),
                amount: z.number(),
                status: recurrenceStatusSchema.transform((v) =>
                  v.toLowerCase(),
                ),
                frequency: frequencySchema.transform((v) => v.toLowerCase()),
                interval: z.number(),
                startDate: z.date(),
                endDate: z.date().nullable(),
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
      const { title, type, status, frequency, page, perPage } = request.query

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Recurrence')) {
        throw new UnauthorizedError(
          'You do not have permission to view recurrences in this organization',
        )
      }

      const filters = and(
        eq(schema.recurrences.orgId, org.id),
        title ? ilike(schema.recurrences.title, `%${title}%`) : undefined,
        type ? eq(schema.recurrences.type, type) : undefined,
        status ? eq(schema.recurrences.status, status) : undefined,
        frequency ? eq(schema.recurrences.frequency, frequency) : undefined,
      )

      const [{ total }] = await db
        .select({ total: count() })
        .from(schema.recurrences)
        .where(filters)

      const recurrences = await db
        .select({
          id: schema.recurrences.id,
          title: schema.recurrences.title,
          description: schema.recurrences.description,
          type: schema.recurrences.type,
          category: {
            id: schema.categories.id,
            name: schema.categories.name,
            color: schema.categories.color,
          },
          amount: schema.recurrences.amount,
          status: schema.recurrences.status,
          frequency: schema.recurrences.frequency,
          interval: schema.recurrences.interval,
          startDate: schema.recurrences.startDate,
          endDate: schema.recurrences.endDate,
          owner: {
            id: schema.users.id,
            name: schema.users.name,
            avatarUrl: schema.users.avatarUrl,
          },
          createdAt: schema.recurrences.createdAt,
        })
        .from(schema.recurrences)
        .leftJoin(
          schema.categories,
          eq(schema.recurrences.categoryId, schema.categories.id),
        )
        .innerJoin(
          schema.users,
          eq(schema.recurrences.ownerId, schema.users.id),
        )
        .where(filters)
        .limit(perPage)
        .offset((page - 1) * perPage)

      const recurrencesWithFormattedAmount = recurrences.map((transaction) => {
        return {
          ...transaction,
          amount: centsToReal(transaction.amount),
        }
      })

      return {
        recurrences: recurrencesWithFormattedAmount,
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
