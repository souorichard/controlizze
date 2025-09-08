'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { createOrganizationAction } from '../app/(app)/organizations/actions'

const upsertOrganizationSchema = z
  .object({
    name: z
      .string()
      .min(3, { error: 'Organization name must be at least 3 characters.' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (domain) => {
          if (domain) {
            const domainRegex =
              /^[a-zA-Z0-9•-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/

            return domainRegex.test(domain)
          }

          return true
        },
        { message: 'Please, enter a valid domain.' },
      ),
    shouldAttachUsersByDomain: z.boolean().default(false).nonoptional(),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain) {
        return !!data.domain
      }

      return true
    },
    {
      message: 'Domain is required when auto-join is enabled.',
      path: ['domain'],
    },
  )

export type UpsertOrganizationFormData = z.infer<
  typeof upsertOrganizationSchema
>

interface OrganizationFormProps {
  dialogState?: (state: boolean) => void
}

export function OrganizationForm({ dialogState }: OrganizationFormProps) {
  const router = useRouter()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
  } = useForm<UpsertOrganizationFormData>({
    resolver: zodResolver(upsertOrganizationSchema),
  })

  async function handleUpsertOrganization({
    name,
    domain,
    shouldAttachUsersByDomain,
  }: UpsertOrganizationFormData) {
    const { success, message } = await createOrganizationAction({
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    if (!success) {
      toast.error(message)

      return
    }

    toast.success(message)
    reset()

    if (dialogState) {
      dialogState(false)
    }

    router.back()
  }

  return (
    <form
      onSubmit={handleSubmit(handleUpsertOrganization)}
      className="space-y-5"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter an organization name"
          {...register('name')}
        />

        {errors.name && (
          <span className="text-destructive block text-xs">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input id="domain" placeholder="example.com" {...register('domain')} />

        {errors.domain && (
          <span className="text-destructive block text-xs">
            {errors.domain.message}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-start space-x-2">
          <div className="translate-y-0.5">
            <Controller
              name="shouldAttachUsersByDomain"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="shouldAttachUsersByDomain"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
            <span className="text-sm leading-none font-medium">
              Auto-join new members
            </span>
            <p className="text-muted-foreground text-sm">
              This will automatically invite all members with same e-mail domain
              to this organization.
            </p>
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save organization'
        )}
      </Button>
    </form>
  )
}
