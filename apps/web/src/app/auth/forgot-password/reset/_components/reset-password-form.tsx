'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { resetPasswordAction } from '../../actions'

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { error: 'Password is required.' })
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
  const [isVisible, setIsVisible] = useState(false)

  const code = searchParams.get('code') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function onSubmit({ password }: ResetPasswordFormData) {
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={isVisible ? 'text' : 'password'}
              placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
              className="pr-10"
              {...register('password')}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-0 right-0"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          {errors.password && (
            <span className="text-destructive text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Confirm password</Label>
          <div className="relative">
            <Input
              type={isVisible ? 'text' : 'password'}
              placeholder="⁕⁕⁕⁕⁕⁕⁕⁕"
              className="pr-10"
              {...register('confirmPassword')}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute top-0 right-0"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <span className="text-destructive text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Reset password
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </form>

      {/* <p className="text-muted-foreground text-center text-xs">
        Remember your password?{' '}
        <Link
          href="/auth/sign-in"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p> */}
    </div>
  )
}
