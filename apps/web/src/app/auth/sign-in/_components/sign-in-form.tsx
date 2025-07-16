'use client'

import Image from 'next/image'
import Link from 'next/link'

import githubIcon from '@/assets/github-icon.svg'
import googleIcon from '@/assets/google-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export function SignInForm() {
  return (
    <div className="space-y-4 md:space-y-5">
      <form className="space-y-4 md:space-y-5">
        <div className="space-y-1.5">
          <Label>E-mail</Label>
          <Input id="email" type="email" placeholder="john@acme.com" />
        </div>

        <div className="space-y-1.5">
          <Label>Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
          />

          <Link
            href="/auth/forgot-password"
            className="text-muted-foreground hover:text-foreground text-xs transition hover:underline hover:underline-offset-4"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full">
          Sign in with e-mail
        </Button>

        <Button type="button" variant="ghost" className="w-full" asChild>
          <Link href="/auth/sign-up">Create a new account</Link>
        </Button>
      </form>

      <Separator />

      <div className="grid grid-rows-2 gap-3 md:grid-cols-2 md:grid-rows-none">
        <form>
          <Button type="submit" variant="outline" className="w-full">
            <Image
              src={githubIcon}
              alt="Github"
              className="size-4 scale-125 invert"
            />
            Sign in with Github
          </Button>
        </form>
        <form>
          <Button type="submit" variant="outline" className="w-full">
            <Image src={googleIcon} alt="Github" className="size-4" />
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
