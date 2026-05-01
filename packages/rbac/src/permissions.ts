import type { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from './index.ts'
import type { User } from './models/user.ts'
import type { Role } from './roles.ts'

type PermissionsRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Role, PermissionsRole> = {
  OWNER(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['update', 'transfer_ownership'], 'Organization')
    can(['update', 'transfer_ownership'], 'Organization', {
      ownerId: { $eq: user.id },
    })

    cannot('leave', 'Organization')
  },
  ADMIN(user, { can, cannot }) {
    can('read', 'User')
    can('update', 'User', { id: { $eq: user.id } })

    cannot(['update', 'delete'], 'Member')
    can(['update', 'delete'], 'Member', {
      id: { $ne: user.id },
      role: { $ne: 'OWNER' },
    })

    can(['read', 'leave'], 'Organization')

    can('manage', ['Transaction', 'Category'])

    can(['create', 'read', 'revoke'], 'Invite')
  },
  MEMBER(user, { can }) {
    can('read', 'User')
    can('update', 'User', { id: { $eq: user.id } })

    can(['read', 'leave'], 'Organization')

    can(['create', 'read'], 'Transaction')
    can(['update', 'delete'], 'Transaction', {
      ownerId: { $eq: user.id },
    })

    can('read', 'Category')
  },
}
