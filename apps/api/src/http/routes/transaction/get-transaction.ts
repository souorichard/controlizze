import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { NotFoundError } from '../_errors/not-found-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getTransation(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/transactions/:transactionId',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Get transaction details.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            transactionId: z.uuid(),
          }),
          response: {
            200: z.object({
              transaction: z.object({
                id: z.uuid(),
                description: z.string(),
                category: z.string(),
                type: z.union([z.literal('EXPENSE'), z.literal('REVENUE')]),
                status: z.union([
                  z.literal('PENDING'),
                  z.literal('COMPLETED'),
                  z.literal('CANCELLED'),
                ]),
                amount: z.number(),
                organizationId: z.uuid(),
                owner: z.object({
                  id: z.uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.url().nullable(),
                }),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, transactionId } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Transaction')) {
          throw new UnauthorizedError(
            `You're not allowed to see this transaction.`,
          )
        }

        const transaction = await prisma.transacion.findUnique({
          select: {
            id: true,
            description: true,
            category: true,
            type: true,
            status: true,
            amount: true,
            organizationId: true,
            owner: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            id: transactionId,
            organizationId: organization.id,
          },
        })

        if (!transaction) {
          throw new NotFoundError('Transaction not found.')
        }

        return {
          transaction: {
            ...transaction,
            amount: Number(transaction.amount),
          },
        }
      },
    )
}
