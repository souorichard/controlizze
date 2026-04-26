import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { categories } from '../../../db/schema/categories.ts'
import { transactions } from '../../../db/schema/transactions.ts'
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
      const { org, membership } = await request.getUserMembership(slug)

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
          id: categories.id,
          type: categories.type,
        })
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1)

      if (!category) {
        throw new BadRequestError('Category not found')
      }

      if (category.type !== type) {
        throw new BadRequestError('Category must match transaction type')
      }

      const [transaction] = await db
        .insert(transactions)
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
          id: transactions.id,
        })

      return reply.status(201).send({
        transactionId: transaction.id,
      })
    },
  )
}
