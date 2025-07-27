'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { SocialSignInButtons } from '@/components/auth/social-sign-in-buttons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { createAccountAction } from '../actions'

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { error: 'Name must be at least 3 characters.' })
      .refine((value) => value.split(' ').length > 1, {
        message: 'Please, enter your full name.',
      }),
    email: z.email({ error: 'Please, provide a valid e-mail.' }),
    password: z
      .string()
      .min(6, { error: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  })

export type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  async function handleSignUp({ name, email, password }: SignUpFormData) {
    const { success, message } = await createAccountAction({
      name,
      email,
      password,
    })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)

    redirect('/auth/sign-in')
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="space-y-4 md:space-y-5"
      >
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input
            id="name"
            type="name"
            placeholder="John Doe"
            {...register('name')}
          />

          {errors.name && (
            <span className="text-destructive block text-xs">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
          />

          {errors.email && (
            <span className="text-destructive block text-xs">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••"
            {...register('password')}
          />

          {errors.password && (
            <span className="text-destructive block text-xs">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••"
            {...register('confirmPassword')}
          />

          {errors.confirmPassword && (
            <span className="text-destructive block text-xs">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-1 py-2 text-sm">
          <span className="text-muted-foreground">Already registered?</span>
          <Link
            href="/auth/sign-in"
            className="underline-offset-4 transition hover:underline"
          >
            Sign in
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <Separator />

      <SocialSignInButtons disabled={isLoading} />
    </div>
  )
}
