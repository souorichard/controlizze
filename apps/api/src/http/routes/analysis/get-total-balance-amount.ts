import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'
import { getTotalExpenses } from './functions/get-total-expenses'
import { getTotalRevenues } from './functions/get-total-revenues'

export async function getTotalBalanceAmount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/analysis/balance-amount',
      {
        schema: {
          tags: ['Analysis'],
          summary: 'Get total balance amount.',
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

        const { totalExpensesAmount, totalExpensesLastMonthAmount } =
          await getTotalExpenses(organization.id, { accumulated: true })

        const { totalRevenuesAmount, totalRevenuesLastMonthAmount } =
          await getTotalRevenues(organization.id, { accumulated: true })

        const totalBalanceAmount = totalRevenuesAmount - totalExpensesAmount

        const totalBalanceLastMonthAmount =
          totalRevenuesLastMonthAmount - totalExpensesLastMonthAmount

        const diffFromLastMonth =
          totalBalanceLastMonthAmount !== 0
            ? ((totalBalanceAmount - totalBalanceLastMonthAmount) /
                Math.abs(totalBalanceLastMonthAmount)) *
              100
            : 0

        return {
          amount: totalBalanceAmount,
          diffFromLastMonth: diffFromLastMonth
            ? Number(diffFromLastMonth.toFixed(1))
            : 0,
        }
      },
    )
}
