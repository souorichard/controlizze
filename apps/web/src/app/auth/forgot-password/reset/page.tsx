import { ResetPasswordForm } from '../reset/_components/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-lg space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground text-pretty">
          Enter your new password below to reset your account password.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  )
}
