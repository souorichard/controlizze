'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { SocialButtons } from '../../_components/social-buttons'
import { createAccountAction } from '../actions'

const signUpSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .min(1, 'Name is required'),
  email: z
    .email({ error: 'Invalid email address' })
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .min(1, 'Password is required'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const [isVisible, setIsVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit({ name, email, password }: SignUpFormData) {
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
    <div className="space-y-6">
      <SocialButtons isLoading={isLoading} />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <p className="text-muted-foreground text-xs">OR CONTINUE WITH</p>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input type="name" placeholder="John Doe" {...register('name')} />
          {errors.name && (
            <span className="text-destructive text-sm">
              {errors.name.message}
            </span>
          )}
        </div>

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

        <Button type="submit" size="lg" className="w-full">
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-xs">
        Already have an accoun?{' '}
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
