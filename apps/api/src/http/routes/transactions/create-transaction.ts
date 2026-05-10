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
import { statusSchema, typeSchema } from '../../schemas/index.ts'

export const createTransaction: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).post(
    '/',
    {
      schema: {
        tags: ['Transaction'],
        summary: 'Create a new transaction',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string().nullable().optional(),
          type: typeSchema,
          categoryId: z.uuid(),
          amount: z.coerce.number(),
          status: statusSchema,
          transactionDate: z.coerce.date().optional(),
          recurringTransactionId: z.uuid().nullable().optional(),
        }),
        response: {
          201: z.object({
            transactionId: z.uuid(),
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

      if (cannot('create', 'Transaction')) {
        throw new UnauthorizedError(`You're not allowed to create transactions`)
      }

      const {
        title,
        description,
        type,
        categoryId,
        amount,
        status,
        transactionDate,
        recurringTransactionId,
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

      const [transaction] = await db
        .insert(schema.transactions)
        .values({
          title,
          description,
          type,
          categoryId,
          amount: realToCents(amount),
          status,
          transactionDate: transactionDate ?? new Date(),
          recurringTransactionId,
          ownerId: userId,
          orgId: org.id,
        })
        .returning({
          id: schema.transactions.id,
        })

      return reply.status(201).send({
        transactionId: transaction.id,
      })
    },
  )
}
