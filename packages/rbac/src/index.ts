import {
  AbilityBuilder,
  type CreateAbility,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability'
import { z } from 'zod'
import type { User } from './models/user.ts'
import { permissions } from './permissions.ts'
import { categorySubject } from './subjects/category.ts'
import { inviteSubject } from './subjects/invite.ts'
import { memberSubject } from './subjects/members.ts'
import { organizationSubject } from './subjects/organization.ts'
import { recurrencesSubject } from './subjects/recurrences.ts'
import { transactionSubject } from './subjects/transaction.ts'
import { userSubject } from './subjects/user.ts'

export * from './models/organization.ts'
export * from './models/recurrences.ts'
export * from './models/transaction.ts'
export * from './models/user.ts'
export * from './roles.ts'

const appAbilitiesSchema = z.union([
  userSubject,
  organizationSubject,
  transactionSubject,
  recurrencesSubject,
  categorySubject,
  inviteSubject,
  memberSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      if (
        typeof subject === 'object' &&
        subject !== null &&
        '__typename' in subject
      ) {
        return (subject as { __typename: string }).__typename
      }

      // biome-ignore lint/suspicious/noExplicitAny: This is necessary to access the constructor name of the subject, which is not typed.
      return (subject as any)?.constructor?.name
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
