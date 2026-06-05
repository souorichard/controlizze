import { z } from 'zod'

export const recurrencesSchema = z.object({
  id: z.uuidv7(),
  ownerId: z.uuidv7(),
  __typename: z.literal('Recurrences').default('Recurrences'),
})

export type Recurrences = z.infer<typeof recurrencesSchema>
