import { z } from 'zod/v3'

export const upsertTransactionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string(),
  category: z.string(),
  amount: z.string(),
  status: z.string(),
  transactionDate: z.string(),
})

export type UpsertTransactionFormData = z.infer<typeof upsertTransactionSchema>
