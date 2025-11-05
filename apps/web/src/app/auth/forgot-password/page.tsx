import { RecoverPasswordForm } from './_components/recover-password-form'

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-lg space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Recover your password</h1>
        <p className="text-muted-foreground text-pretty">
          Enter your email address below and we'll send you a link to reset your
        </p>
      </div>

      <RecoverPasswordForm />
    </div>
  )
}
