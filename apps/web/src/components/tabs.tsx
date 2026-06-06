import {
  BadgeDollarSign,
  LayoutDashboard,
  Repeat,
  Settings,
  Tags,
} from 'lucide-react'

import { ability, getCurrentOrg } from '@/utils/auth'

import { NavLink } from './nav-link'

export async function Tabs() {
  const currentOrganization = await getCurrentOrg()

  const permissions = await ability()

  const canReadTransactions = permissions?.can('read', 'Transaction')
  const canReadRecurringTransactions = permissions?.can('read', 'Recurrence')
  const canReadCategories = permissions?.can('read', 'Category')

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canReadMembers = permissions?.can('read', 'User')

  const linkClass = `group flex h-[2.75rem] items-center gap-2 text-muted-foreground data-[current=true]:text-foreground data-[current=true]:after:bg-primary data-[current=false]:hover:text-foreground data data-[current=false]:hover:after:bg-muted relative px-5 py-3 text-sm font-medium transition after:absolute after:-bottom-px after:left-0 after:z-10 after:h-0.5 after:w-full after:content-['']`

  return (
    <div className="mx-auto hidden lg:flex w-full max-w-7xl items-center gap-1">
      <NavLink
        href={`/orgs/${currentOrganization}/overview`}
        className={linkClass}
      >
        <LayoutDashboard className="size-4" />
        <span className="group-data-[current=false]:hidden md:group-data-[current=false]:inline">
          Visão geral
        </span>
      </NavLink>

      {canReadTransactions && (
        <NavLink
          href={`/orgs/${currentOrganization}/transactions`}
          className={linkClass}
        >
          <BadgeDollarSign className="size-4" />
          <span className="group-data-[current=false]:hidden md:group-data-[current=false]:inline">
            Transações
          </span>
        </NavLink>
      )}

      {canReadRecurringTransactions && (
        <NavLink
          href={`/orgs/${currentOrganization}/recurrences`}
          className={linkClass}
        >
          <Repeat className="size-4" />
          <span className="group-data-[current=false]:hidden md:group-data-[current=false]:inline">
            Recorrências
          </span>
        </NavLink>
      )}

      {canReadCategories && (
        <NavLink
          href={`/orgs/${currentOrganization}/categories`}
          className={linkClass}
        >
          <Tags className="size-4" />
          <span className="group-data-[current=false]:hidden md:group-data-[current=false]:inline">
            Categorias
          </span>
        </NavLink>
      )}

      {(canUpdateOrganization || canReadMembers) && (
        <NavLink
          href={`/orgs/${currentOrganization}/settings`}
          className={linkClass}
        >
          <Settings className="size-4" />
          <span className="group-data-[current=false]:hidden md:group-data-[current=false]:inline">
            Configurações
          </span>
        </NavLink>
      )}
    </div>
  )
}
