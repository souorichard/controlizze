import z from 'zod'

export const transactionSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  __typename: z.literal('Transaction').default('Transaction'),
})

export type Transaction = z.infer<typeof transactionSchema>
