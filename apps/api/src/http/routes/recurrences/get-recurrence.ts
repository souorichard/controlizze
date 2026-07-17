import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { centsToReal } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import {
  frequencySchema,
  recurrenceStatusSchema,
  typeSchema,
} from '../../schemas.ts'

export const getRecurrence: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Recurrence'],
        summary: 'Get organization recurrence details',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          recurrenceId: z.uuid(),
        }),
        response: {
          200: z.object({
            recurrence: z.object({
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
              status: recurrenceStatusSchema.transform((v) => v.toLowerCase()),
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
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug, recurrenceId } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Recurrence')) {
        throw new UnauthorizedError(
          'You do not have permission to view this recurrence in this organization',
        )
      }

      const [recurrence] = await db
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
        .where(
          and(
            eq(schema.recurrences.orgId, org.id),
            eq(schema.recurrences.id, recurrenceId),
          ),
        )
        .limit(1)

      if (!recurrence) {
        throw new NotFoundError('Recurrence not found')
      }

      return {
        recurrence: {
          ...recurrence,
          amount: centsToReal(recurrence.amount),
        },
      }
    },
  )
}
