import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

interface GetTotalExpensesOptions {
  accumulated?: boolean
}

export async function getTotalExpenses(
  organizationId: string,
  options?: GetTotalExpensesOptions,
) {
  const today = dayjs()
  const currentMonth = today.startOf('month')
  const lastMonth = today.subtract(1, 'month')

  if (options?.accumulated) {
    const [totalExpenses, totalExpensesLastMonth] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          organizationId,
          type: 'EXPENSE',
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
          type: 'EXPENSE',
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
      totalExpensesAmount: Number(totalExpenses._sum.amount ?? 0),
      totalExpensesLastMonthAmount: Number(
        totalExpensesLastMonth._sum.amount ?? 0,
      ),
    }
  }

  const [totalExpenses, totalExpensesLastMonth] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        organizationId,
        type: 'EXPENSE',
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
        type: 'EXPENSE',
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
    totalExpensesAmount: Number(totalExpenses._sum.amount ?? 0),
    totalExpensesLastMonthAmount: Number(
      totalExpensesLastMonth._sum.amount ?? 0,
    ),
  }
}
