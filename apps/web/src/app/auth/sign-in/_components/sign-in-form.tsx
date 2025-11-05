'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { SocialButtons } from '../../_components/social-buttons'
import { signInWithPasswordAction } from '../actions'

const signInSchema = z.object({
  email: z
    .email({ error: 'Please, provide a valid e-mail.' })
    .min(1, 'E-mail is required.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(6, { error: 'Password must be at least 6 characters.' }),
})

export type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
    getValues,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  async function onSubmit({ email, password }: SignInFormData) {
    const { success, message } = await signInWithPasswordAction({
      email,
      password,
    })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)

    router.push('/')
  }

  function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault()

    const email = getValues('email')

    if (!email) {
      router.push('/auth/forgot-password')

      return
    }

    router.push(`/auth/forgot-password?email=${email}`)
  }

  return (
    <div className="space-y-6">
      <SocialButtons isLoading={isLoading} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <p className="text-muted-foreground text-xs">OR CONTINUE WITH</p>
        <Separator className="flex-1" />
      </div>

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

        <div className="space-y-1.5">
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={isVisible ? 'text' : 'password'}
              placeholder="⁕⁕⁕⁕⁕⁕"
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

          <Link
            href="/auth/forgot-password"
            onClick={handleForgotPassword}
            className="text-muted-foreground hover:text-foreground text-xs transition hover:underline hover:underline-offset-4"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Sign in with e-mail and password
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-xs">
        Don't have an account?{' '}
        <Link
          href="/auth/sign-up"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
