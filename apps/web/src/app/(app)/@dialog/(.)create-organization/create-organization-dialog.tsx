'use client'

import { useState } from 'react'

import { InterceptedDialogContent } from '@/components/intercepted-dialog-content'
import { OrganizationForm } from '@/components/organization-form'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateOrganizationDialog() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <InterceptedDialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Create and share with your team members.
          </DialogDescription>
        </DialogHeader>
        <OrganizationForm dialogState={setIsOpen} />
      </InterceptedDialogContent>
    </Dialog>
  )
}
