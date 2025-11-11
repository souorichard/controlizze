'use client'

import { CategoryForm } from '@/components/category-form'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Category } from '@/interfaces/category'

interface UpdateCategoryDialogProps {
  categoryId: string
  initialData: Category
}

export function UpdateCategoryDialog({
  categoryId,
  initialData,
}: UpdateCategoryDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update category</DialogTitle>
        <DialogDescription>
          Update and share with your organization members.
        </DialogDescription>
      </DialogHeader>

      <CategoryForm
        categoryId={categoryId}
        initialData={initialData}
        isUpdating
      />
    </DialogContent>
  )
}
