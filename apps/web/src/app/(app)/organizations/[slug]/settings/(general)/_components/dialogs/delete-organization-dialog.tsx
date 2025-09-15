'use client'

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { deleteOrganizationAction } from '../../actions'

export function DeleteOrganizationDialog() {
  async function handleDeleteOrganization() {
    await deleteOrganizationAction()
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this organization?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. The organization and all of its data
          will be permanently deleted.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button variant="destructive" onClick={handleDeleteOrganization}>
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
