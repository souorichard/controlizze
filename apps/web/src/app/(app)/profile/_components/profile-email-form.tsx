'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ProfileEmailForm() {
  return (
    <div className="grid grid-rows-[auto_auto] items-center gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-10">
      <div className="space-y-2">
        <h2 className="font-semibold">Account e-mail</h2>
        <p className="text-muted-foreground text-sm">
          Your e-mail address is used to log in to Controlizze.
        </p>
      </div>

      <form className="flex items-center gap-2">
        <Input className="w-full" />
        <Button type="submit" variant="outline">
          Save
        </Button>
      </form>
    </div>
  )
}
