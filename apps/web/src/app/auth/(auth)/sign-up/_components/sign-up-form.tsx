'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorMessage } from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '../../_components/password-input'
import { signUp } from '../actions'
import { type SignUpData, signUpSchema } from '../schemas'

export function SignUpForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function handleSignUp({
    name,
    email,
    password,
    confirmPassword,
  }: SignUpData) {
    const { success, message } = await signUp({
      name,
      email,
      password,
      confirmPassword,
    })

    if (!success) {
      toast.error(message)
      return
    }

    toast.success(message)

    router.push(`/auth/sign-in?email=${encodeURIComponent(email)}`)
  }

  return (
    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
      <div className="space-y-1">
        <Label>Name</Label>
        <Input
          type="text"
          placeholder="John Doe"
          disabled={isSubmitting}
          {...register('name')}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="john@exemplo.com"
          disabled={isSubmitting}
          {...register('email')}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <PasswordInput
          placeholder="• • • • • • • •"
          disabled={isSubmitting}
          {...register('password')}
        />
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </div>

      <div className="space-y-2">
        <Label>Confirm password</Label>
        <PasswordInput
          placeholder="• • • • • • • •"
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <span>Create my account</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  )
}
