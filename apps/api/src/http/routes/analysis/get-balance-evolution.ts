import dayjs from 'dayjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { auth } from '@/http/middlewares/auth'
import { checkPlan } from '@/http/middlewares/check-plan'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getBalanceEvolution(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(checkPlan)
    .get(
      '/organizations/:slug/analysis/balance-evolution',
      {
        schema: {
          tags: ['Analysis'],
          summary: 'Get monthly balance evolution for a given year.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          querystring: z.object({
            year: z
              .string()
              .regex(/^\d{4}$/)
              .default(dayjs().year().toString()),
          }),
          response: {
            200: z.object({
              evolutions: z.array(
                z.object({
                  date: z.string(),
                  balance: z.number(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params
        const { year } = request.query

        const userId = await request.getCurrentUserId()
        const { organization, membership } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('get', 'Analysis')) {
          throw new UnauthorizedError(
            `You're not allowed to see this information.`,
          )
        }

        const start = dayjs().set('year', Number(year)).startOf('year')
        const end = dayjs().set('year', Number(year)).endOf('year')

        const transactions = await prisma.transaction.findMany({
          select: {
            type: true,
            amount: true,
            createdAt: true,
          },
          where: {
            organizationId: organization.id,
            status: {
              not: 'CANCELLED',
            },
            createdAt: {
              gte: start.toDate(),
              lte: end.toDate(),
            },
          },
        })

        const months = Array.from({ length: 12 }, (_, i) => ({
          date: dayjs().set('year', Number(year)).month(i).startOf('month'),
          expense: 0,
          revenue: 0,
        }))

        // 🔹 Distribuir valores nos meses corretos
        for (const t of transactions) {
          const monthIndex = t.createdAt.getUTCMonth()
          const entry = months[monthIndex]

          if (!entry) continue

          if (t.type === 'REVENUE') entry.revenue += Number(t.amount)
          else entry.expense += Number(t.amount)
        }

        // 🔹 Calcular saldo acumulado
        let runningBalance = 0
        const evolutions = months.map((month) => {
          const monthBalance = month.revenue - month.expense
          runningBalance += monthBalance

          return {
            date: month.date.toISOString(),
            balance: runningBalance,
          }
        })

        return { evolutions }
      },
    )
}
