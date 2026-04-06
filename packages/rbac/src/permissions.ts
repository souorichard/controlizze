import type { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from './index'
import type { User } from './models/user'
import type { Role } from './roles'

type PermissionsRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Role, PermissionsRole> = {
  OWNER(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['update', 'transfer_ownership', 'leave'], 'Organization')
    can(['update', 'transfer_ownership'], 'Organization', {
      ownerId: { $eq: user.id },
    })
    can('leave', 'Organization', {
      ownerId: { $ne: user.id },
    })
  },
  ADMIN(_, { can }) {
    can(['read', 'invite'], 'User')

    can(['read', 'leave'], 'Organization')

    can('manage', ['Transaction', 'Category', 'Invite'])
  },
  MEMBER(user, { can }) {
    can('read', 'User')

    can(['read', 'leave'], 'Organization')

    can(['create', 'read'], 'Transaction')
    can(['update', 'delete'], 'Transaction', {
      ownerId: { $eq: user.id },
    })

    can('read', 'Category')
  },
}
