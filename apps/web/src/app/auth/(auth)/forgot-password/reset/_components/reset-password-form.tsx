'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorMessage } from '@/components/error-message'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '../../../_components/password-input'
import { resetPasswordAction } from '../actions'
import { type ResetPasswordData, resetPasswordSchema } from '../schemas'

interface ResetPasswordFormProps {
  code: string
}

export function ResetPasswordForm({ code }: ResetPasswordFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function handleRequestPasswordRecover({ password }: ResetPasswordData) {
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
    <form
      onSubmit={handleSubmit(handleRequestPasswordRecover)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Nova senha</Label>
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
        <Label>Confirmar nova senha</Label>
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
            Redefinir senha
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  )
}
