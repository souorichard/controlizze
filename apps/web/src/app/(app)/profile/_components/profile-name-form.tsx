'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ProfileNameForm() {
  return (
    <div className="grid grid-rows-[auto_auto] items-center gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-10">
      <div className="space-y-2">
        <h2 className="font-semibold">Display name</h2>
        <p className="text-muted-foreground text-sm">
          How your name is displayed within Controlizze.
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
