import { SignUpForm } from './_components/sign-up-form'

export default function SignUpPage() {
  return (
    <div className="w-full max-w-lg space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold">Take control of your finances</h1>
        <p className="text-muted-foreground text-pretty">
          Register our system and simplify your financial life with ease and
          security
        </p>
      </div>

      <SignUpForm />
    </div>
  )
}
