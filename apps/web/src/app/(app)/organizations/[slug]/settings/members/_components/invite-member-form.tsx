'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { inviteMemberAction } from '../actions'
import { RoleSelect } from './role-select'

const inviteMemberSchema = z.object({
  email: z.email({ error: 'Please, provide a valid e-mail.' }),
  role: z.enum(['ADMIN', 'MEMBER', 'BILLING']),
})

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>

export function InviteMemberForm({ organization }: { organization: string }) {
  const queryClient = useQueryClient()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isLoading },
    reset,
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
    },
  })

  async function handleInviteMember({ email, role }: InviteMemberFormData) {
    const { success, message } = await inviteMemberAction({ email, role })

    if (!success) {
      toast.error(message)

      return
    }

    queryClient.invalidateQueries({ queryKey: ['invites', organization] })
    toast.success(message)
    reset()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="font-semibold">Invite member</h2>
        <p className="text-muted-foreground text-sm">
          Send an invite to a new member of your organization.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleInviteMember)} className="flex gap-2">
        <div className="flex w-full gap-2">
          <div className="w-full space-y-1.5">
            <Input placeholder="john@acme.com" {...register('email')} />

            {errors.email && (
              <span className="text-destructive block text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          <Controller
            control={control}
            name="role"
            render={({ field }) => {
              return (
                <RoleSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  className="w-[160px]"
                />
              )
            }}
          />
        </div>
        <Button type="submit" variant="outline" disabled={isLoading}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Send'}
        </Button>
      </form>
    </div>
  )
}
