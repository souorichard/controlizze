import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

export async function getTotalRevenues(organizationId: string) {
  const today = dayjs()
  const currentMonth = today.startOf('month')
  const lastMonth = today.subtract(1, 'month').startOf('month')

  const [totalRevenues, totalRevenuesLastMonth] = await Promise.all([
    prisma.transacion.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        organizationId,
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
        organizationId,
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

  return {
    totalRevenuesAmount: Number(totalRevenues._sum.amount ?? 0),
    totalRevenuesLastMonthAmount: Number(
      totalRevenuesLastMonth._sum.amount ?? 0,
    ),
  }
}
