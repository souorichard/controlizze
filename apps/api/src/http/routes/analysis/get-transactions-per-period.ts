import dayjs from 'dayjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { checkPlan } from '../../middlewares/check-plan'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getTransactionsPerPeriod(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(checkPlan)
    .get(
      '/organizations/:slug/analysis/transactions-per-period',
      {
        schema: {
          tags: ['Analysis'],
          summary: 'Get transactions per period',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            lastMonths: z.coerce.number().optional().default(1),
          }),
          response: {
            200: z.object({
              transactions: z.array(
                z.object({
                  date: z.date(),
                  expenses: z.number(),
                  revenues: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { lastMonths } = request.query

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Analysis')) {
          throw new UnauthorizedError(
            `You're not allowed to see this information.`,
          )
        }

        const startDate = dayjs().subtract(lastMonths, 'months')
        const endDate = dayjs()

        const periodTransactions = await prisma.$queryRaw<
          { date: Date; revenues: number; expenses: number }[]
        >`
          SELECT 
            DATE_TRUNC('day', "created_at") as date,
            SUM(CASE WHEN type = 'REVENUE' THEN "amount" ELSE 0 END) as revenues,
            SUM(CASE WHEN type = 'EXPENSE' THEN "amount" ELSE 0 END) as expenses
          FROM "transactions"
          WHERE "organization_id" = ${organization.id}
            AND "created_at" BETWEEN ${startDate.startOf('month').toDate()} 
            AND ${endDate.startOf('month').toDate()}
          GROUP BY DATE_TRUNC('day', "created_at")
          ORDER BY date ASC;
        `

        const formattedPeriodTransactions = periodTransactions.map((item) => ({
          date: item.date,
          revenues: Number(item.revenues) || 0,
          expenses: Number(item.expenses) || 0,
        }))

        return {
          transactions: formattedPeriodTransactions,
        }
      },
    )
}
