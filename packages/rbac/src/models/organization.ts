import { z } from 'zod'

export const organizationSchema = z.object({
  id: z.uuidv7(),
  ownerId: z.uuidv7(),
  __typename: z.literal('Organization').default('Organization'),
})

export type Organization = z.infer<typeof organizationSchema>
