import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getTopRevenueCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/analysis/top-revenue-categories',
      {
        schema: {
          tags: ['Analysis'],
          summary: 'Get top revenue categories',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              categories: z.array(
                z.object({
                  category: z.string(),
                  amount: z.number(),
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

        if (cannot('get', 'Analysis')) {
          throw new UnauthorizedError(
            `You're not allowed to see this information`,
          )
        }

        const topRevenues = await prisma.transaction.groupBy({
          by: ['categoryId'],
          _sum: {
            amount: true,
          },
          where: {
            organizationId: organization.id,
            type: 'REVENUE',
          },
          orderBy: {
            _sum: { amount: 'desc' },
          },
          take: 4,
        })

        const categoryIds = topRevenues.map((revenue) => revenue.categoryId)

        const categories = await prisma.category.findMany({
          select: {
            id: true,
            name: true,
          },
          where: {
            id: {
              in: categoryIds,
            },
          },
        })

        const formattedCategories = topRevenues.map((revenue) => {
          const category = categories.find(
            (category) => category.id === revenue.categoryId,
          )

          return {
            category: category?.name ?? 'Uncategorized',
            amount: Number(revenue._sum.amount),
          }
        })

        return {
          categories: formattedCategories,
        }
      },
    )
}
