'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ErrorMessage } from '../error-message'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { createOrgAction } from './actions'
import { type CreateOrgData, createOrgSchema } from './schemas'

export function OrgForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  return (
    <form onSubmit={handleSubmit(handleUpsertOrg)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Displayed name</CardTitle>
          <CardDescription>
            This is your org's visible name within Controlizze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              placeholder="Acme Inc..."
              disabled={isSubmitting}
              {...register('name')}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>
            This is your org's description. After create your org, you can
            update the description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              placeholder="We are a company that specializes in providing..."
              disabled={isSubmitting}
              {...register('description')}
            />
            {errors.description && (
              <ErrorMessage>{errors.description.message}</ErrorMessage>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
      </Button>
    </form>
  )
}
