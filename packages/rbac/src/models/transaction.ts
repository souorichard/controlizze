import { z } from 'zod'

export const transactionSchema = z.object({
  id: z.uuidv7(),
  ownerId: z.uuidv7(),
  __typename: z.literal('Transaction').default('Transaction'),
})

export type transaction = z.infer<typeof transactionSchema>
