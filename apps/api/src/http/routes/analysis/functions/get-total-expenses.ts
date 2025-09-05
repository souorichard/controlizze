import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

export async function getTotalExpenses(organizationId: string) {
  const today = dayjs()
  const currentMonth = today.startOf('month')
  const lastMonth = today.subtract(1, 'month').startOf('month')

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
          gte: lastMonth.toDate(),
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
