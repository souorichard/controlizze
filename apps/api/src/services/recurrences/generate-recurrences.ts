import { and, eq, lte } from 'drizzle-orm'
import { db } from '../../db/index.ts'
import { schema } from '../../db/schema/index.ts'
import { calculateNextExecutionDate } from './calculate-next-execution-date.ts'

export async function generateRecurrences() {
  const now = new Date()
  let processed = 0

  const recurrencesToRun = await db
    .select()
    .from(schema.recurrences)
    .where(
      and(
        eq(schema.recurrences.status, 'ACTIVE'),
        lte(schema.recurrences.nextExecutionDate, now),
      ),
    )

  for (const recurrence of recurrencesToRun) {
    await db.transaction(async (tx) => {
      const executionDate = recurrence.nextExecutionDate

      if (recurrence.endDate && executionDate > recurrence.endDate) {
        return
      }

      const nextExecutionDate = calculateNextExecutionDate({
        date: executionDate,
        frequency: recurrence.frequency,
        interval: recurrence.interval,
      })

      await tx.insert(schema.transactions).values({
        title: recurrence.title,
        description: recurrence.description,
        type: recurrence.type,
        categoryId: recurrence.categoryId,
        amount: recurrence.amount,
        status: 'PENDING',
        transactionDate: executionDate,
        recurrenceId: recurrence.id,
        ownerId: recurrence.ownerId,
        orgId: recurrence.orgId,
      })

      await tx
        .update(schema.recurrences)
        .set({
          lastGeneratedAt: executionDate,
          nextExecutionDate,
        })
        .where(eq(schema.recurrences.id, recurrence.id))

      processed++
    })
  }

  return processed
}
