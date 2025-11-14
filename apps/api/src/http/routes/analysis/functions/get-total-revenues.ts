import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

interface GetTotalRevenuesOptions {
  accumulated?: boolean
}

export async function getTotalRevenues(
  organizationId: string,
  options?: GetTotalRevenuesOptions,
) {
  const today = dayjs()
  const currentMonth = today.startOf('month')
  const lastMonth = today.subtract(1, 'month')

  if (options?.accumulated) {
    const [totalRevenues, totalRevenuesLastMonth] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          organizationId,
          type: 'REVENUE',
          status: {
            not: 'CANCELLED',
          },
        },
      }),

      prisma.transaction.aggregate({
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
            lt: lastMonth.endOf('month').toDate(),
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

  const [totalRevenues, totalRevenuesLastMonth] = await Promise.all([
    prisma.transaction.aggregate({
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

    prisma.transaction.aggregate({
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
          gte: lastMonth.startOf('month').toDate(),
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
