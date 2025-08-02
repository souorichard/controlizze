import { OrganizationForm } from './organization-form'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export function CreateOrganizationDialog() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create organization</DialogTitle>
        <DialogDescription>
          Create and share with your team members.
        </DialogDescription>
      </DialogHeader>
      <OrganizationForm />
    </DialogContent>
  )
}
