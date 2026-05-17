import z from 'zod'

import { recurringTransactionSchema } from '../models/recurring-transaction.ts'

export const recurringTransactionSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.union([z.literal('RecurringTransaction'), recurringTransactionSchema]),
])

export type TransactionSubject = z.infer<typeof recurringTransactionSubject>
