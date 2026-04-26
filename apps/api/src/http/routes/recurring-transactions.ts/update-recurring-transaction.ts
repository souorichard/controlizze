import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { realToCents } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import {
  frequencySchema,
  recurringStatusSchema,
  typeSchema,
} from '../../schemas/index.ts'

export const updateRecurringTransaction: FastifyPluginAsyncZod = async (
  app,
) => {
  app.register(auth).put(
    '/',
    {
      schema: {
        tags: ['Recurring transaction'],
        summary: 'Update recurring transaction',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          recurringTransactionId: z.string(),
        }),
        body: z
          .object({
            title: z.string(),
            description: z.string().nullable().optional(),
            type: typeSchema,
            categoryId: z.uuid(),
            amount: z.coerce.number(),
            status: recurringStatusSchema,
            frequency: frequencySchema,
            interval: z.coerce.number(),
            startDate: z.coerce.date(),
            endDate: z.coerce.date().optional(),
          })
          .superRefine((data, ctx) => {
            if (data.endDate && data.endDate <= data.startDate) {
              ctx.addIssue({
                code: 'custom',
                message: 'End date must be after start date',
                path: ['endDate'],
              })
            }
          }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, recurringTransactionId } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('update', 'Transaction')) {
        throw new UnauthorizedError(
          `You're not allowed to update recurring transactions`,
        )
      }

      const {
        title,
        description,
        type,
        categoryId,
        amount,
        status,
        frequency,
        interval,
        startDate,
        endDate,
      } = request.body

      const [category] = await db
        .select({
          id: schema.categories.id,
          type: schema.categories.type,
        })
        .from(schema.categories)
        .where(
          and(
            eq(schema.categories.id, categoryId),
            eq(schema.categories.orgId, org.id),
          ),
        )
        .limit(1)

      if (!category) {
        throw new BadRequestError('Category not found')
      }

      if (category.type !== type) {
        throw new BadRequestError('Category must match transaction type')
      }

      const [recurringTransaction] = await db
        .update(schema.recurringTransactions)
        .set({
          title,
          description,
          type,
          categoryId,
          amount: realToCents(amount),
          status,
          frequency,
          interval,
          startDate,
          endDate: endDate ?? null,
        })
        .where(
          and(
            eq(schema.recurringTransactions.id, recurringTransactionId),
            eq(schema.recurringTransactions.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
