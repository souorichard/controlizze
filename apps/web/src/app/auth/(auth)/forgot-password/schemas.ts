import z from 'zod/v3'

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
})

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
