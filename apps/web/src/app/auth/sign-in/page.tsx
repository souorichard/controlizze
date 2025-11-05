import { SignInForm } from './_components/sign-in-form'

export default function SignInPage() {
  return (
    <div className="w-full max-w-lg space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Take control of your finances</h1>
        <p className="text-muted-foreground text-pretty">
          Join our system and simplify your financial life with ease and
          security
        </p>
      </div>

      <SignInForm />
    </div>
  )
}
