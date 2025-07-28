import { PropsWithChildren } from 'react'

import { SettingsNavigation } from './_components/settings-navigation'

export default async function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="grid grid-cols-[16rem_1fr] gap-10">
        <SettingsNavigation />
        {children}
      </div>
    </>
  )
}
