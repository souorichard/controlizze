import dayjs from 'dayjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getRevenuesAmount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/analysis/revenues-amount',
      {
        schema: {
          tags: ['Analysis'],
          summary: 'Get revenues amount.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              amount: z.number(),
              diffFromLastMonth: z.number(),
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

        const today = dayjs()
        const currentMonth = today.startOf('month')
        const lastMonth = today.subtract(1, 'month').startOf('month')

        const [totalRevenues, totalRevenuesLastMonth] = await Promise.all([
          prisma.transacion.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              organizationId: organization.id,
              type: 'REVENUE',
              status: {
                not: 'CANCELLED',
              },
              createdAt: {
                gte: currentMonth.toDate(),
              },
            },
          }),

          prisma.transacion.aggregate({
            _sum: {
              amount: true,
            },
            where: {
              organizationId: organization.id,
              type: 'REVENUE',
              status: {
                not: 'CANCELLED',
              },
              createdAt: {
                gte: lastMonth.toDate(),
                lt: currentMonth.toDate(),
              },
            },
          }),
        ])

        const totalRevenuesAmount = Number(totalRevenues._sum.amount ?? 0)
        const totalRevenuesLastMonthAmount = Number(
          totalRevenuesLastMonth._sum.amount ?? 0,
        )

        const diffFromLastMonth =
          totalRevenuesAmount && totalRevenuesLastMonthAmount
            ? ((totalRevenuesAmount - totalRevenuesLastMonthAmount) /
                totalRevenuesLastMonthAmount) *
              100
            : 0

        return {
          amount: totalRevenuesAmount,
          diffFromLastMonth: diffFromLastMonth
            ? Number(diffFromLastMonth.toFixed(1))
            : 0,
        }
      },
    )
}
