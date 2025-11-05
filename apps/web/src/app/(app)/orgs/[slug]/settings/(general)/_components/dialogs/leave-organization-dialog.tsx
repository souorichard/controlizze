'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { leaveOrganizationAction } from '../../actions'

export function LeaveOrganizationDialog() {
  const router = useRouter()

  async function handleLeaveOrganization() {
    const { success, message } = await leaveOrganizationAction()

    if (!success) {
      toast.error(message)

      return
    }

    router.push('/')
    toast.success(message)
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to leave this organization?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The organization will no longer be part
          of your account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button variant="destructive" onClick={handleLeaveOrganization}>
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
