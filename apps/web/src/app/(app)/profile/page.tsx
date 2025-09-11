import { Metadata } from 'next'

import { Separator } from '@/components/ui/separator'

import { DeleteProfileForm } from './_components/delete-profile-form'
import { ProfileAvatarForm } from './_components/profile-avatar-form'
import { ProfileEmailForm } from './_components/profile-email-form'
import { ProfileNameForm } from './_components/profile-name-form'

export const metadata: Metadata = {
  title: 'Profile',
}

export default function ProfilePage() {
  return (
    <main className="w-full space-y-8">
      <ProfileNameForm />
      <Separator />

      <ProfileEmailForm />
      <Separator />

      <ProfileAvatarForm />
      <Separator />

      <DeleteProfileForm />
    </main>
  )
}
