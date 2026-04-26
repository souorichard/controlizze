import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { calculateNextExecutionDate } from '../../../services/recurring-transactions/calculate-next-execution-date.ts'
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

      const recurringTransaction = await db.transaction(async (tx) => {
        const amountInCents = realToCents(amount)
        const now = new Date()
        const shouldCreateFirstTransaction = startDate <= now

        const nextExecutionDate = shouldCreateFirstTransaction
          ? calculateNextExecutionDate({
              date: startDate,
              frequency,
              interval,
            })
          : startDate

        const [createdRecurringTransaction] = await tx
          .insert(schema.recurringTransactions)
          .values({
            title,
            description,
            type,
            categoryId,
            amount: amountInCents,
            status,
            frequency,
            interval,
            startDate,
            endDate: endDate ?? null,
            lastGeneratedAt: shouldCreateFirstTransaction ? startDate : null,
            nextExecutionDate,
            ownerId: userId,
            orgId: org.id,
          })
          .returning({
            id: schema.recurringTransactions.id,
          })

        if (shouldCreateFirstTransaction) {
          await tx.insert(schema.transactions).values({
            title,
            description,
            type,
            categoryId,
            amount: amountInCents,
            status: 'PENDING',
            transactionDate: startDate,
            recurringTransactionId: createdRecurringTransaction.id,
            ownerId: userId,
            orgId: org.id,
          })
        }

        return createdRecurringTransaction
      })

      return reply.status(201).send({
        recurringTransactionId: recurringTransaction.id,
      })
    },
  )
}
