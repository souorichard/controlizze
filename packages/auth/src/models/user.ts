import z from 'zod'

import { roleSchema } from '../roles'

export const userSchema = z.object({
  id: z.string().uuid(),
  role: roleSchema,
  __typename: z.literal('User').default('User'),
})

export type User = z.infer<typeof userSchema>
