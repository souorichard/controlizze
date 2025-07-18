'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { resetPasswordAction } from '../actions'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { error: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code') ?? ''

  if (!code) {
    toast.error('Code not found, please try again.')
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function handleRecoverPassword({ password }: ResetPasswordFormData) {
    const { success, message } = await resetPasswordAction({
      code,
      password,
    })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)

    router.push('/auth/sign-in')
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <form
        onSubmit={handleSubmit(handleRecoverPassword)}
        className="space-y-4 md:space-y-5"
      >
        <div className="space-y-1.5">
          <Label>New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your new password"
            {...register('password')}
          />

          {errors.password && (
            <span className="text-destructive block text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="confirmPassword"
            placeholder="Enter your new password again"
            {...register('confirmPassword')}
          />

          {errors.confirmPassword && (
            <span className="text-destructive block text-xs">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Reset password'
          )}
        </Button>

        <Button type="button" variant="link" className="w-full" asChild>
          <Link href="/auth/sign-in">Back to sign in</Link>
        </Button>
      </form>
    </div>
  )
}
