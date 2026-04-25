import { z } from 'zod'
import { roleSchema } from './../roles.ts'

export const userSchema = z.object({
  id: z.uuidv7(),
  role: roleSchema,
})

export type User = z.infer<typeof userSchema>
