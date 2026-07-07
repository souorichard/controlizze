'use client'

import { useState } from 'react'
import { OrgForm } from '@/components/forms/org-form'
import { InterceptedDialogContent } from '@/components/intercepted-dialog-content'
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function CreateOrgDialog() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <InterceptedDialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Let's get your organization set up. It only takes a minute
          </DialogDescription>
        </DialogHeader>

        <OrgForm />
      </InterceptedDialogContent>
    </Dialog>
  )
}
