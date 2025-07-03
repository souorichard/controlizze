import type { AbilityBuilder } from '@casl/ability'

import type { AppAbility } from '.'
import type { User } from './models/user'
import type { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['update', 'transfer_ownership'], 'Organization')
    can(['update', 'transfer_ownership'], 'Organization', {
      ownerId: { $eq: user.id },
    })
  },
  MEMBER(user, { can }) {
    can('get', 'User')

    can('get', 'Organization')

    can(['create', 'get'], 'Transaction')
    can(['update', 'delete'], 'Transaction', { ownerId: { $eq: user.id } })

    can('manage', 'Analysis')
  },
  BILLING(_, { can }) {
    can('manage', 'Billing')
  },
}
