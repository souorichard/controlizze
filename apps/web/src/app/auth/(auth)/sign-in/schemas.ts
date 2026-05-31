import z from 'zod/v3'

export const signInSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
})

export type SignInData = z.infer<typeof signInSchema>
