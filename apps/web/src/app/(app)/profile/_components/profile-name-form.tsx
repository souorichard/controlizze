'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { updateProfileNameAction } from '../actions'

const profileNameForm = z.object({
  name: z.string().min(3, { error: 'Name must be at least 3 characters.' }),
})

export type ProfileNameFormData = z.infer<typeof profileNameForm>

interface ProfileNameFormProps {
  initialData: string
}

export function ProfileNameForm({ initialData }: ProfileNameFormProps) {
  const { register, handleSubmit } = useForm<ProfileNameFormData>({
    resolver: zodResolver(profileNameForm),
    defaultValues: {
      name: initialData,
    },
  })

  async function handleUpdateProfileName({ name }: ProfileNameFormData) {
    const { success, message } = await updateProfileNameAction({ name })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)
  }

  return (
    <div className="grid grid-rows-[auto_auto] items-center gap-6 lg:grid-cols-2 lg:grid-rows-none lg:gap-10">
      <div className="space-y-2">
        <h2 className="font-semibold">Display name</h2>
        <p className="text-muted-foreground text-sm">
          How your name is displayed within Controlizze.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleUpdateProfileName)}
        className="flex items-center gap-2"
      >
        <Input
          className="w-full"
          placeholder="John Doe"
          {...register('name')}
        />
        <Button type="submit" variant="outline">
          Save
        </Button>
      </form>
    </div>
  )
}
