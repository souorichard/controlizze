import { z } from 'zod'

export const recurringTransactionSchema = z.object({
  id: z.uuidv7(),
  ownerId: z.uuidv7(),
  __typename: z.literal('RecurringTransaction').default('RecurringTransaction'),
})

export type recurringTransaction = z.infer<typeof recurringTransactionSchema>
