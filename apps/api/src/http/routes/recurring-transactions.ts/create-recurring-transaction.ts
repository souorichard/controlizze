import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { categories } from '../../../db/schema/categories.ts'
import { recurringTransactions } from '../../../db/schema/recurring-transactions.ts'
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

export const createRecurringTransaction: FastifyPluginAsyncZod = async (
  app,
) => {
  app.register(auth).post(
    '/',
    {
      schema: {
        tags: ['Recurring transaction'],
        summary: 'Create a new recurring transaction',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
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
          201: z.object({
            recurringTransactionId: z.uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      const { org, membership } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('create', 'Transaction')) {
        throw new UnauthorizedError(
          `You're not allowed to create recurring transactions`,
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
          id: categories.id,
          type: categories.type,
        })
        .from(categories)
        .where(and(eq(categories.id, categoryId), eq(categories.orgId, org.id)))
        .limit(1)

      if (!category) {
        throw new BadRequestError('Category not found')
      }

      if (category.type !== type) {
        throw new BadRequestError('Category must match transaction type')
      }

      const [recurringTransaction] = await db
        .insert(recurringTransactions)
        .values({
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
          ownerId: userId,
          orgId: org.id,
        })
        .returning({
          id: recurringTransactions.id,
        })

      return reply.status(201).send({
        recurringTransactionId: recurringTransaction.id,
      })
    },
  )
}
