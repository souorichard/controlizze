import z from 'zod'

import { transactionSchema } from '../models/transaction'

export const transactionSubject = z.tuple([
  z.union([
    z.literal('create'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('manage'),
  ]),
  z.union([z.literal('Transaction'), transactionSchema]),
])

export type TransactionSubject = z.infer<typeof transactionSubject>
