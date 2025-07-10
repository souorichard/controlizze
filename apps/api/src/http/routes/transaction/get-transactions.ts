import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getTransations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/transactions',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Get all organization transactions.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              transactions: z.array(
                z.object({
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
                  createdAt: z.date(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Transaction')) {
          throw new UnauthorizedError(
            `You're not allowed to see organizations transactions.`,
          )
        }

        const rawTransactions = await prisma.transacion.findMany({
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
            createdAt: true,
          },
          where: {
            organizationId: organization.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        const formattedTransactions = rawTransactions.map((transaction) => {
          return {
            ...transaction,
            amount: Number(transaction.amount),
          }
        })

        return {
          transactions: formattedTransactions,
        }
      },
    )
}
