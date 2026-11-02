import type * as React from 'react'
import { cn } from '@/lib/utils'

type InputProps = React.ComponentProps<'input'> & {
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  wrapperClassName?: string
}

function Input({
  className,
  type,
  startAdornment,
  endAdornment,
  wrapperClassName,
  ...props
}: InputProps) {
  return (
    <div
      data-slot="input-wrapper"
      className={cn(
        'flex h-9 w-full items-center rounded-md border border-input bg-surface/60 px-3 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20',
        'has-disabled:pointer-events-none has-disabled:opacity-50',
        startAdornment || endAdornment ? 'gap-3' : 'gap-2',
        wrapperClassName,
      )}
    >
      {startAdornment}

      <input
        type={type}
        data-slot="input"
        className={cn(
          'h-full w-full min-w-0 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground',
          'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          className,
        )}
        {...props}
      />

      {endAdornment}
    </div>
  )
}

export { Input }
