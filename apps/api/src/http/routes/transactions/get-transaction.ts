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
import { statusSchema, typeSchema } from '../../schemas.ts'

export const getTransaction: FastifyPluginAsyncZod = async (app) => {
  app.register(auth).get(
    '/',
    {
      schema: {
        tags: ['Transaction'],
        summary: 'Get organization transaction details',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
          transactionId: z.uuid(),
        }),
        response: {
          200: z.object({
            transaction: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
              type: typeSchema,
              category: z
                .object({
                  id: z.uuid(),
                  name: z.string(),
                  color: z.string(),
                })
                .nullable(),
              amount: z.number(),
              status: statusSchema,
              transactionDate: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug, transactionId } = request.params

      const userId = await request.getCurrentUserId()
      await request.verifyEmailVerification(userId)
      const { org, membership } = await request.getUserMembership(slug, userId)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('read', 'Transaction')) {
        throw new UnauthorizedError(
          `Você não tem permissão para visualizar esta transação desta organização`,
        )
      }

      const [transaction] = await db
        .select({
          id: schema.transactions.id,
          title: schema.transactions.title,
          description: schema.transactions.description,
          type: schema.transactions.type,
          category: {
            id: schema.categories.id,
            name: schema.categories.name,
            color: schema.categories.color,
          },
          amount: schema.transactions.amount,
          status: schema.transactions.status,
          transactionDate: schema.transactions.transactionDate,
        })
        .from(schema.transactions)
        .leftJoin(
          schema.categories,
          eq(schema.transactions.categoryId, schema.categories.id),
        )
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

      return {
        transaction: {
          ...transaction,
          amount: centsToReal(transaction.amount),
        },
      }
    },
  )
}
