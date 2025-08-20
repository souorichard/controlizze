'use client'

import { Role } from '@controlizze/auth'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateMemberAction } from '../actions'
import { RoleSelect } from './role-select'

interface UpdateMemberRoleSelectProps {
  organization: string
  memberId: string
  value: Role
  disabled?: boolean
}

export function UpdateMemberRoleSelect({
  organization,
  memberId,
  value,
  disabled,
}: UpdateMemberRoleSelectProps) {
  const queryClient = useQueryClient()

  async function handleRoleChange(role: Role) {
    const { success, message } = await updateMemberAction({
      memberId,
      role,
    })

    if (!success) {
      toast.error(message)

      return
    }

    queryClient.invalidateQueries({ queryKey: ['members', organization] })
    toast.success(message)
  }

  return (
    <RoleSelect
      value={value}
      onValueChange={handleRoleChange}
      className="w-[160px]"
      disabled={disabled}
    />
  )
}
