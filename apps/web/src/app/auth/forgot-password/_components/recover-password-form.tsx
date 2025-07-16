'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RecoverPasswordForm() {
  return (
    <div className="space-y-4 md:space-y-5">
      <form className="space-y-4 md:space-y-5">
        <div className="space-y-1.5">
          <Label>E-mail</Label>
          <Input id="email" type="email" placeholder="john@acme.com" />
        </div>

        <Button type="submit" className="w-full">
          Recover password
        </Button>

        <Button type="button" variant="link" className="w-full" asChild>
          <Link href="/auth/sign-in">Back to sign in</Link>
        </Button>
      </form>
    </div>
  )
}
