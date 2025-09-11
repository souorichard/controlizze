'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { updateProfileEmailAction } from '../actions'

const profileEmailForm = z.object({
  email: z.email({ error: 'Please, provide a valid e-mail.' }),
})

export type ProfileEmailFormData = z.infer<typeof profileEmailForm>

interface ProfileEmailFormProps {
  initialData: string
  canUpdated: boolean
}

export function ProfileEmailForm({
  initialData,
  canUpdated,
}: ProfileEmailFormProps) {
  const { register, handleSubmit } = useForm<ProfileEmailFormData>({
    resolver: zodResolver(profileEmailForm),
    defaultValues: {
      email: initialData ?? '',
    },
  })

  async function handleUpdateProfileEmail({ email }: ProfileEmailFormData) {
    const { success, message } = await updateProfileEmailAction({ email })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)
  }

  return (
    <div className="grid grid-rows-[auto_auto] items-center gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-10">
      <div className="space-y-2">
        <h2 className="font-semibold">Account e-mail</h2>
        <p className="text-muted-foreground text-sm">
          Your e-mail address is used to log in to Controlizze.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleUpdateProfileEmail)}
        className="flex items-center gap-2"
      >
        <Input
          className="w-full"
          placeholder="john@example.com"
          {...register('email')}
          disabled={!canUpdated}
        />
        <Button type="submit" variant="outline" disabled={!canUpdated}>
          Save
        </Button>
      </form>
    </div>
  )
}
