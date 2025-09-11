'use client'

import { useRouter } from 'next/navigation'

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { deleteProfileAction } from '../../actions'

export function DeleteProfileDialog() {
  const router = useRouter()

  async function handleDeleteProfile() {
    await deleteProfileAction()

    router.push('/api/auth/sign-out')
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete your profile?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The account will be permanently deleted.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          type="submit"
          variant="destructive"
          onClick={handleDeleteProfile}
        >
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
