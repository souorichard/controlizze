import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { calculateNextExecutionDate } from '../../../services/recurrences/calculate-next-execution-date.ts'
import { realToCents } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import {
  frequencySchema,
  recurrenceStatusSchema,
  typeSchema,
} from '../../schemas.ts'

export const createRecurrence: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).post(
    '/',
    {
      schema: {
        tags: ['Recurrence'],
        summary: 'Create a new recurrence',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        body: z
          .object({
            title: z.string(),
            description: z.string().nullable().optional(),
            type: typeSchema.default('EXPENSE'),
            categoryId: z.uuid(),
            amount: z.coerce.number(),
            status: recurrenceStatusSchema.default('ACTIVE'),
            frequency: frequencySchema.default('MONTHLY'),
            interval: z.coerce.number(),
            startDate: z.coerce.date(),
            endDate: z.coerce.date().optional(),
          })
          .superRefine((data, ctx) => {
            if (data.endDate && data.endDate <= data.startDate) {
              ctx.addIssue({
                code: 'custom',
                message: 'Data de término deve ser depois da data de início',
                path: ['endDate'],
              })
            }
          }),
        response: {
          201: z.object({
            recurrenceId: z.uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('create', 'Recurrence')) {
        throw new UnauthorizedError(
          `Você não tem permissão para criar recorrências`,
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
        throw new BadRequestError('Categoria não encontrada')
      }

      if (category.type !== type) {
        throw new BadRequestError(
          'Categoria deve corresponder ao tipo de transação',
        )
      }

      const recurrence = await db.transaction(async (tx) => {
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

        const [createdRecurrence] = await tx
          .insert(schema.recurrences)
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
            id: schema.recurrences.id,
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
            recurrenceId: createdRecurrence.id,
            ownerId: userId,
            orgId: org.id,
          })
        }

        return createdRecurrence
      })

      return reply.status(201).send({
        recurrenceId: recurrence.id,
      })
    },
  )
}
