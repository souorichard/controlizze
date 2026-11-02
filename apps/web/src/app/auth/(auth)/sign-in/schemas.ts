import z from 'zod/v3'

export const signInSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
})

export type SignInData = z.infer<typeof signInSchema>
