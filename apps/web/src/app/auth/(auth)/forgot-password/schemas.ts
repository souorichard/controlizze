import z from 'zod/v3'

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
})

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
