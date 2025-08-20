import { PropsWithChildren } from 'react'

import { SettingsNavigation } from './_components/settings-navigation'

export default async function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <h1 className="text-xl font-semibold md:text-2xl">Settings</h1>
      <div className="flex flex-col gap-10 lg:flex-row">
        <SettingsNavigation />
        {children}
      </div>
    </>
  )
}
