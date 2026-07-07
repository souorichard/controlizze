import z from 'zod/v3'

export const createOrgSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  // file: z
  //   .custom<File>((value) => value instanceof File, 'Select an image.')
  //   .refine((file) => file.size <= 5 * 1024 * 1024, 'Maximum size: 5MB.')
  //   .refine(
  //     (file) => ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type),
  //     'Invalid format (PNG, JPG, JPEG)',
  //   ),
})

export type CreateOrgData = z.infer<typeof createOrgSchema>
