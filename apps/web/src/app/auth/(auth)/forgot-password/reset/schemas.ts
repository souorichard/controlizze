import z from 'zod/v3'

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
