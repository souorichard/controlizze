import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getTopExpenseCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/analysis/top-expense-categories',
      {
        schema: {
          tags: ['Analysis'],
          summary: 'Get top expense categories.',
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
            `You're not allowed to see this information.`,
          )
        }

        const topExpenses = await prisma.transaction.groupBy({
          by: ['categoryId'],
          _sum: {
            amount: true,
          },
          where: {
            organizationId: organization.id,
            type: 'EXPENSE',
          },
          orderBy: {
            _sum: { amount: 'desc' },
          },
          take: 4,
        })

        const categoryIds = topExpenses.map((expense) => expense.categoryId)

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

        const formattedCategories = topExpenses.map((expense) => {
          const category = categories.find(
            (category) => category.id === expense.categoryId,
          )

          return {
            category: category?.name ?? 'Uncategorized',
            amount: Number(expense._sum.amount),
          }
        })

        return {
          categories: formattedCategories,
        }
      },
    )
}
