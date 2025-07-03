import z from 'zod'

export const organizationSchema = z.object({
  id: z.string().uuid(),
  ownerId: z.string().uuid(),
  __typename: z.literal('Organization').default('Organization'),
})

export type Organization = z.infer<typeof organizationSchema>
