'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorMessage } from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requestPasswordRecoverAction } from '../actions'
import { type ForgotPasswordData, forgotPasswordSchema } from '../schemas'

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function handleRequestPasswordRecover({ email }: ForgotPasswordData) {
    const { success, message } = await requestPasswordRecoverAction({ email })

    if (!success) {
      toast.error(message)
      return
    }

    toast.success(message)
  }

  return (
    <form
      onSubmit={handleSubmit(handleRequestPasswordRecover)}
      className="space-y-4"
    >
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Enviar email
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  )
}
