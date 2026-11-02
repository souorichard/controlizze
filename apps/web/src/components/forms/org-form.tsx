'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorMessage } from '../error-message'
import { Button } from '../ui/button'
import { DialogFooter } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { createOrgAction } from './actions'
import { type CreateOrgData, createOrgSchema } from './schemas'

interface OrgFormProps {
  viewMode?: 'card' | 'dialog'
}

export function OrgForm({ viewMode = 'card' }: OrgFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CreateOrgData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function handleUpsertOrg({ name }: CreateOrgData) {
    const { success, message } = await createOrgAction({ name })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)
    router.back()
  }

  function onDismiss() {
    router.back()
  }

  if (viewMode === 'dialog') {
    return (
      <form onSubmit={handleSubmit(handleUpsertOrg)} className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Acme Corp"
              disabled={isSubmitting}
              {...register('name')}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="We are a company that specializes in providing..."
              disabled={isSubmitting}
              {...register('description')}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onDismiss}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </DialogFooter>
      </form>
    )
  }

  return (
    <div className="bg-card/60 rounded-xl border overflow-hidden">
      <form onSubmit={handleSubmit(handleUpsertOrg)}>
        <div className="p-5 flex flex-col gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Acme Corp"
              disabled={isSubmitting}
              {...register('name')}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="We are a company that specializes in providing..."
              disabled={isSubmitting}
              {...register('description')}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </div>
        </div>
        <div className="px-5 py-3 flex gap-3 border-t">
          <Button
            type="submit"
            className="ml-auto"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
