import { recurrenceSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { realToCents } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { BadRequestError } from '../../errors/bad-request-error.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import {
  frequencySchema,
  recurrenceStatusSchema,
  typeSchema,
} from '../../schemas.ts'

export const updateRecurrence: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).put(
    '/',
    {
      schema: {
        tags: ['Recurrence transaction'],
        summary: 'Update recurrence',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          recurrenceId: z.string(),
        }),
        body: z
          .object({
            title: z.string(),
            description: z.string().nullable().optional(),
            type: typeSchema,
            categoryId: z.uuid(),
            amount: z.coerce.number(),
            status: recurrenceStatusSchema,
            frequency: frequencySchema,
            interval: z.coerce.number(),
            startDate: z.coerce.date(),
            endDate: z.coerce.date().optional(),
          })
          .superRefine((data, ctx) => {
            if (data.endDate && data.endDate <= data.startDate) {
              ctx.addIssue({
                code: 'custom',
                message: 'The end date must be after the start date',
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
      const { slug, recurrenceId } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

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
        throw new NotFoundError('Category not found')
      }

      if (category.type !== type) {
        throw new BadRequestError(
          'The category must match the transaction type',
        )
      }

      const [recurrence] = await db
        .select({
          id: schema.recurrences.id,
          ownerId: schema.recurrences.ownerId,
        })
        .from(schema.recurrences)
        .where(
          and(
            eq(schema.recurrences.id, recurrenceId),
            eq(schema.recurrences.orgId, org.id),
          ),
        )
        .limit(1)

      if (!recurrence) {
        throw new NotFoundError('Recurrence not found')
      }

      const authRecurrence = recurrenceSchema.parse(recurrence)

      if (cannot('update', authRecurrence)) {
        throw new UnauthorizedError(
          'You do not have permission to update this recurrence',
        )
      }

      await db
        .update(schema.recurrences)
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
            eq(schema.recurrences.id, recurrenceId),
            eq(schema.recurrences.orgId, org.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
