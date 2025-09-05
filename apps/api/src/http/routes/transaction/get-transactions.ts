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
          tags: ['Transaction'],
          summary: 'Get all organization transactions.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            page: z.coerce.number().default(1),
            perPage: z.coerce.number().default(10),
            description: z.string().optional(),
            type: z.string().optional(),
            category: z.string().optional(),
            status: z.string().optional(),
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
              pageSubtotal: z.number(),
              totalAmount: z.number(),
              totalCount: z.number(),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { page, perPage, description, type, category, status } =
          request.query

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Transaction')) {
          throw new UnauthorizedError(
            `You're not allowed to see organizations transactions.`,
          )
        }

        const [rawTransactions, transactionsCount, totalGeneral] =
          await Promise.all([
            prisma.transaction.findMany({
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
                description: {
                  contains: description,
                  mode: 'insensitive',
                },
                type: {
                  equals: type as 'EXPENSE' | 'REVENUE',
                },
                category: {
                  equals: category,
                },
                status: {
                  equals: status as 'PENDING' | 'COMPLETED' | 'CANCELLED',
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
              skip: (page - 1) * perPage,
              take: perPage,
            }),

            prisma.transaction.count({
              where: {
                organizationId: organization.id,
                description: {
                  contains: description,
                  mode: 'insensitive',
                },
                type: {
                  equals: type as 'EXPENSE' | 'REVENUE',
                },
                category: {
                  equals: category,
                },
                status: {
                  equals: status as 'PENDING' | 'COMPLETED' | 'CANCELLED',
                },
              },
            }),

            prisma.transaction.aggregate({
              _sum: {
                amount: true,
              },
              where: {
                organizationId: organization.id,
                status: { not: 'CANCELLED' },
              },
            }),
          ])

        const formattedTransactions = rawTransactions.map((transaction) => ({
          ...transaction,
          amount: Number(transaction.amount),
        }))

        const subtotal = formattedTransactions
          .filter((transaction) => transaction.status !== 'CANCELLED')
          .reduce((acc, transaction) => acc + transaction.amount, 0)

        const total = Number(totalGeneral._sum.amount ?? 0)

        return {
          transactions: formattedTransactions,
          pageSubtotal: subtotal,
          totalAmount: total,
          totalCount: transactionsCount,
        }
      },
    )
}
