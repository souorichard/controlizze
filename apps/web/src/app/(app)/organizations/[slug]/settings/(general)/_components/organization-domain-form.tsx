'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

const organizationDomainSchema = z
  .object({
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

export type OrganizationDomainFormData = z.infer<
  typeof organizationDomainSchema
>

interface OrganizationDomainFormProps {
  initialData: {
    domain: string | null
    shouldAttachUsersByDomain: boolean
  }
}

export function OrganizationDomainForm({
  initialData,
}: OrganizationDomainFormProps) {
  const { control, register, handleSubmit } = useForm({
    resolver: zodResolver(organizationDomainSchema),
    values: {
      domain: initialData?.domain ?? '',
      shouldAttachUsersByDomain:
        initialData?.shouldAttachUsersByDomain ?? false,
    },
  })

  async function handleUpdateOrganizationName({
    domain,
  }: OrganizationDomainFormData) {
    console.log(domain)
  }

  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="space-y-2">
        <h2 className="font-semibold">Organization domain</h2>
        <p className="text-muted-foreground text-sm">
          The e-mail domain of your organization when you log in.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleUpdateOrganizationName)}
        className="flex flex-col items-start gap-2 py-2"
      >
        <div className="flex w-full items-center gap-2">
          <Input className="w-full" {...register('domain')} />
          <Button type="submit" variant="outline">
            Save
          </Button>
        </div>

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
            {/* <p className="text-muted-foreground text-sm">
              This will automatically invite all members with same e-mail domain
              to this organization.
            </p> */}
          </label>
        </div>
      </form>
    </div>
  )
}
