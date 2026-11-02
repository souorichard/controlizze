import z from 'zod/v3'

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(3, 'Name must be at least 3 characters long'),
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignUpData = z.infer<typeof signUpSchema>
