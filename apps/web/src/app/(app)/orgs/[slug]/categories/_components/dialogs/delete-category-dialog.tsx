'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useOrganization } from '@/hooks/use-organization'

import { deleteCategoryAction } from '../../actions'

interface DeleteCategoryDialogProps {
  categoryId: string
}

export function DeleteCategoryDialog({
  categoryId,
}: DeleteCategoryDialogProps) {
  const queryClient = useQueryClient()

  const organization = useOrganization()

  async function handleDeleteCategory() {
    await deleteCategoryAction({ categoryId })

    queryClient.invalidateQueries({ queryKey: ['categories', organization] })
    queryClient.invalidateQueries({ queryKey: ['analysis', organization] })
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this category?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          category from our organization.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          type="submit"
          variant="destructive"
          onClick={handleDeleteCategory}
        >
          Confirm
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
