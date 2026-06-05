import { authAccounts } from './auth-accounts.ts'
import { categories } from './categories.ts'
import { invites } from './invites.ts'
import { members } from './members.ts'
import { organizations } from './organizations.ts'
import { recurrences } from './recurrences.ts'
import { tokens } from './tokens.ts'
import { transactions } from './transactions.ts'
import { users } from './users.ts'

export const schema = {
  users,
  authAccounts,
  tokens,
  organizations,
  members,
  invites,
  categories,
  transactions,
  recurrences,
}
