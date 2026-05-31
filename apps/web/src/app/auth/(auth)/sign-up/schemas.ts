import z from 'zod/v3'

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
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

export type SignUpData = z.infer<typeof signUpSchema>
