'use client'

import { Eye, EyeOff, Lock } from 'lucide-react'
import { type ComponentProps, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PasswordInputProps
  extends Omit<ComponentProps<typeof Input>, 'type' | 'endAdornment'> {}

export function PasswordInput({ ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Input
      {...props}
      type={isVisible ? 'text' : 'password'}
      wrapperClassName="pr-0"
      startAdornment={<Lock className="size-4 text-muted-foreground" />}
      endAdornment={
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          onClick={() => setIsVisible((prev) => !prev)}
          className="shrink-0"
        >
          {isVisible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </Button>
      }
    />
  )
}
