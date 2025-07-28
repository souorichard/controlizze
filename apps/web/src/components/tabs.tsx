import { ArrowLeftRight, LayoutDashboard, Settings } from 'lucide-react'

import { ability, getCurrentOrganization } from '@/auth/auth'

import { NavLink } from './nav-link'

export async function Tabs() {
  const currentOrganization = await getCurrentOrganization()

  const permissions = await ability()

  const canGetTransactions = permissions?.can('get', 'Transaction')

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBilling = permissions?.can('get', 'Billing')

  const linkClass = `group flex items-center gap-2 text-muted-foreground data-[current=true]:text-foreground data-[current=true]:after:bg-primary data-[current=false]:hover:text-foreground data data-[current=false]:hover:after:bg-muted relative px-5 py-3 text-sm font-medium transition after:absolute after:-bottom-px after:left-0 after:z-10 after:h-0.5 after:w-full after:content-['']`

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center gap-1">
      <NavLink
        href={`/organizations/${currentOrganization}/overview`}
        className={linkClass}
      >
        <LayoutDashboard className="size-4" />
        <span className="group-data-[current=false]:hidden md:group-data-[current=false]:inline">
          Overview
        </span>
      </NavLink>

      {canGetTransactions && (
        <NavLink
          href={`/organizations/${currentOrganization}/transactions`}
          className={linkClass}
        >
          <ArrowLeftRight className="size-4" />
          <span className="group-data-[current=false]:hidden md:group-data-[current=false]:inline">
            Transactions
          </span>
        </NavLink>
      )}

      {(canUpdateOrganization || canGetBilling) && (
        <NavLink
          href={`/organizations/${currentOrganization}/settings`}
          className={linkClass}
        >
          <Settings className="size-4" />
          <span className="group-data-[current=false]:hidden md:group-data-[current=false]:inline">
            Settings
          </span>
        </NavLink>
      )}
    </div>
  )
}
