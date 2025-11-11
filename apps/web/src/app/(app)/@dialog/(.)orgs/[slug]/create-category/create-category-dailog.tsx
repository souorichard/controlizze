'use client'

import { useState } from 'react'

import { CategoryForm } from '@/components/category-form'
import { InterceptedDialogContent } from '@/components/intercepted-dialog-content'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateCategoryDialog({
  organization,
}: {
  organization: string
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <InterceptedDialogContent>
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            Create a new category for this organization.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm organization={organization} dialogState={setIsOpen} />
      </InterceptedDialogContent>
    </Dialog>
  )
}
