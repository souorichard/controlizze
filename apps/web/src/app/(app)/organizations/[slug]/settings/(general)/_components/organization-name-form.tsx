'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { updateOrganizationNameAction } from '../actions'

const organizationNameSchema = z.object({
  name: z
    .string()
    .min(3, { error: 'Organization name must be at least 3 characters.' }),
})

export type OrganizationNameFormData = z.infer<typeof organizationNameSchema>

interface OrganizationNameFormProps {
  initialData: string
}

export function OrganizationNameForm({
  initialData,
}: OrganizationNameFormProps) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(organizationNameSchema),
    values: {
      name: initialData ?? '',
    },
  })

  async function handleUpdateOrganizationName({
    name,
  }: OrganizationNameFormData) {
    const { success, message } = await updateOrganizationNameAction({
      name,
    })

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
          How your organization name is displayed within Controlizze.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleUpdateOrganizationName)}
        className="flex items-center gap-2"
      >
        <Input className="w-full" {...register('name')} />
        <Button type="submit" variant="outline">
          Save
        </Button>
      </form>
    </div>
  )
}
