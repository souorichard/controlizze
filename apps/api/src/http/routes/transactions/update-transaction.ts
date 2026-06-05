import { transactionSchema } from '@controlizze/rbac'
import { and, eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { realToCents } from '../../../utils/amount-converter.ts'
import { getUserPermissions } from '../../../utils/get-user-permissions.ts'
import { NotFoundError } from '../../errors/not-found-error.ts'
import { UnauthorizedError } from '../../errors/unauthorized-error.ts'
import { auth } from '../../middlewares/auth.ts'
import { statusSchema, typeSchema } from '../../schemas.ts'

export const updateTransaction: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).put(
    '/',
    {
      schema: {
        tags: ['Transaction'],
        summary: 'Update transaction details',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          transactionId: z.uuid(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string().nullable().optional(),
          type: typeSchema,
          categoryId: z.uuid(),
          amount: z.coerce.number(),
          status: statusSchema,
          transactionDate: z.coerce.date().optional(),
          recurrenceId: z.uuid().nullable().optional(),
        }),
        response: {
          204: z.void(),
        },
      },
    },
    async (request, reply) => {
      const { slug, transactionId } = request.params

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
        transactionDate,
        recurrenceId,
      } = request.body

      const [transaction] = await db
        .select({
          id: schema.transactions.id,
          ownerId: schema.transactions.ownerId,
        })
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.orgId, org.id),
            eq(schema.transactions.id, transactionId),
          ),
        )
        .limit(1)

      if (!transaction) {
        throw new NotFoundError('Transação não encontrada')
      }

      const authTransaction = transactionSchema.parse(transaction)

      if (cannot('update', authTransaction)) {
        throw new UnauthorizedError(
          `Você não tem permissão para atualizar esta transação`,
        )
      }

      await db
        .update(schema.transactions)
        .set({
          title,
          description,
          type,
          categoryId,
          amount: realToCents(amount),
          status,
          transactionDate: transactionDate ?? new Date(),
          recurrenceId,
        })
        .where(
          and(
            eq(schema.transactions.orgId, org.id),
            eq(schema.transactions.id, transaction.id),
          ),
        )

      return reply.status(204).send()
    },
  )
}
