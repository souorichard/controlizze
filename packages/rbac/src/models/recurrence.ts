import { z } from 'zod'

export const recurrenceSchema = z.object({
  id: z.uuidv7(),
  ownerId: z.uuidv7(),
  __typename: z.literal('Recurrence').default('Recurrence'),
})

export type Recurrence = z.infer<typeof recurrenceSchema>
