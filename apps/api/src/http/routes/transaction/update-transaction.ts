import { transactionSchema } from '@controlizze/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { NotFoundError } from '../_errors/not-found-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateTransation(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/transactions/:transactionId',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Update a transaction.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            transactionId: z.uuid(),
          }),
          body: z.object({
            description: z.string(),
            category: z.string(),
            type: z.union([z.literal('EXPENSE'), z.literal('REVENUE')]),
            status: z.union([
              z.literal('PENDING'),
              z.literal('COMPLETED'),
              z.literal('CANCELLED'),
            ]),
            amount: z.number(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, transactionId } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const transaction = await prisma.transaction.findUnique({
          where: {
            id: transactionId,
            organizationId: organization.id,
          },
        })

        if (!transaction) {
          throw new NotFoundError(`Transaction not found.`)
        }

        const authTransaction = transactionSchema.parse(transaction)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authTransaction)) {
          throw new UnauthorizedError(
            `You're not allowed to update this transaction.`,
          )
        }

        const {
          description,
          category: categorySlug,
          type,
          status,
          amount,
        } = request.body

        const category = await prisma.category.findUnique({
          where: {
            slug_type: {
              slug: categorySlug,
              type,
            },
          },
        })

        if (!category) {
          throw new NotFoundError('Category not found.')
        }

        await prisma.transaction.update({
          where: {
            id: transactionId,
          },
          data: {
            description,
            categoryId: category.id,
            type,
            status,
            amount,
          },
        })

        return reply.status(204).send()
      },
    )
}
