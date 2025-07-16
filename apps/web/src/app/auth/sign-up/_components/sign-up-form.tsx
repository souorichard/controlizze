'use client'

import Image from 'next/image'
import Link from 'next/link'

import githubIcon from '@/assets/github-icon.svg'
import googleIcon from '@/assets/google-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export function SignUpForm() {
  return (
    <div className="space-y-4 md:space-y-5">
      <form className="space-y-4 md:space-y-5">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input id="name" type="name" placeholder="Enter your name" />
        </div>

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
        </div>

        <div className="space-y-1.5">
          <Label>Confirm password</Label>
          <Input
            id="confirm_password"
            type="confirm_password"
            placeholder="Enter your password again"
          />
        </div>

        <Button type="submit" className="w-full">
          Create account
        </Button>

        <Button type="button" variant="link" className="w-full" asChild>
          <Link href="/auth/sign-in">Already registered? Sign in</Link>
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
            Sign up with Github
          </Button>
        </form>
        <form>
          <Button type="submit" variant="outline" className="w-full">
            <Image src={googleIcon} alt="Github" className="size-4" />
            Sign up with Google
          </Button>
        </form>
      </div>
    </div>
  )
}
