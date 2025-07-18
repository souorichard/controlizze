'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { recoverPasswordAction } from '../actions'

const recoverPasswordSchema = z.object({
  email: z.email({ error: 'Please, provide a valid e-mail.' }),
})

export type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>

export function RecoverPasswordForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      email,
    },
  })

  async function handleRecoverPassword({ email }: RecoverPasswordFormData) {
    const { success, message } = await recoverPasswordAction({
      email,
    })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <form
        onSubmit={handleSubmit(handleRecoverPassword)}
        className="space-y-4 md:space-y-5"
      >
        <div className="space-y-1.5">
          <Label>E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@acme.com"
            {...register('email')}
          />

          {errors.email && (
            <span className="text-destructive block text-xs">
              {errors.email.message}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Recover password'
          )}
        </Button>

        <Button type="button" variant="link" className="w-full" asChild>
          <Link href="/auth/sign-in">Back to sign in</Link>
        </Button>
      </form>
    </div>
  )
}
