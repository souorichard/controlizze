'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
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
  email: z
    .email({ error: 'Please, provide a valid e-mail.' })
    .min(1, 'E-mail is required.'),
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

  async function onSubmit({ email }: RecoverPasswordFormData) {
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>E-mail</Label>
          <Input
            type="email"
            placeholder="john@acme.com"
            inputMode="email"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-destructive text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Send password recovery e-mail
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-xs">
        Remember your password?{' '}
        <Link
          href="/auth/sign-in"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
