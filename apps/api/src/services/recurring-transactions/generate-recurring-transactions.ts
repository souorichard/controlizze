import { and, eq, lte } from 'drizzle-orm'
import { db } from '../../db/index.ts'
import { schema } from '../../db/schema/index.ts'
import { calculateNextExecutionDate } from './calculate-next-execution-date.ts'

export async function generateRecurringTransactions() {
  const now = new Date()
  let processed = 0

  const recurringTransactionsToRun = await db
    .select()
    .from(schema.recurringTransactions)
    .where(
      and(
        eq(schema.recurringTransactions.status, 'ACTIVE'),
        lte(schema.recurringTransactions.nextExecutionDate, now),
      ),
    )

  for (const recurringTransaction of recurringTransactionsToRun) {
    await db.transaction(async (tx) => {
      const executionDate = recurringTransaction.nextExecutionDate

      if (
        recurringTransaction.endDate &&
        executionDate > recurringTransaction.endDate
      ) {
        return
      }

      const nextExecutionDate = calculateNextExecutionDate({
        date: executionDate,
        frequency: recurringTransaction.frequency,
        interval: recurringTransaction.interval,
      })

      await tx.insert(schema.transactions).values({
        title: recurringTransaction.title,
        description: recurringTransaction.description,
        type: recurringTransaction.type,
        categoryId: recurringTransaction.categoryId,
        amount: recurringTransaction.amount,
        status: 'PENDING',
        transactionDate: executionDate,
        recurringTransactionId: recurringTransaction.id,
        ownerId: recurringTransaction.ownerId,
        orgId: recurringTransaction.orgId,
      })

      await tx
        .update(schema.recurringTransactions)
        .set({
          lastGeneratedAt: executionDate,
          nextExecutionDate,
        })
        .where(eq(schema.recurringTransactions.id, recurringTransaction.id))

      processed++
    })
  }

  return processed
}
