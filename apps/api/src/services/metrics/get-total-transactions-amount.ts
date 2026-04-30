import dayjs from 'dayjs'
import { and, eq, gte, lt, ne, sql } from 'drizzle-orm'
import { db } from '../../db/index.ts'
import { schema } from '../../db/schema/index.ts'

interface GetTotalTransactionsAmountOptions {
  type: 'INCOME' | 'EXPENSE'
  accumulated?: boolean
}

export async function getTotalTransactionsAmount(
  organizationId: string,
  options: GetTotalTransactionsAmountOptions,
) {
  const today = dayjs()
  const currentMonth = today.startOf('month')
  const lastMonth = today.subtract(1, 'month')

  const amountSum = sql<number>`coalesce(sum(${schema.transactions.amount}), 0)`

  const baseFilters = [
    eq(schema.transactions.orgId, organizationId),
    eq(schema.transactions.type, options.type),
    ne(schema.transactions.status, 'CANCELED'),
  ]

  if (options.accumulated) {
    const [total, totalLastMonth] = await Promise.all([
      db
        .select({ amount: amountSum })
        .from(schema.transactions)
        .where(and(...baseFilters)),

      db
        .select({ amount: amountSum })
        .from(schema.transactions)
        .where(
          and(
            ...baseFilters,
            lt(
              schema.transactions.createdAt,
              lastMonth.endOf('month').toDate(),
            ),
          ),
        ),
    ])

    return {
      totalAmount: total[0]?.amount ?? 0,
      totalLastMonthAmount: totalLastMonth[0]?.amount ?? 0,
    }
  }

  const [total, totalLastMonth] = await Promise.all([
    db
      .select({ amount: amountSum })
      .from(schema.transactions)
      .where(
        and(
          ...baseFilters,
          gte(schema.transactions.createdAt, currentMonth.toDate()),
        ),
      ),

    db
      .select({ amount: amountSum })
      .from(schema.transactions)
      .where(
        and(
          ...baseFilters,
          gte(
            schema.transactions.createdAt,
            lastMonth.startOf('month').toDate(),
          ),
          lt(schema.transactions.createdAt, currentMonth.toDate()),
        ),
      ),
  ])

  return {
    totalAmount: total[0]?.amount ?? 0,
    totalLastMonthAmount: totalLastMonth[0]?.amount ?? 0,
  }
}
