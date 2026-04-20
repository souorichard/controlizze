import { authAccounts } from './auth-accounts.ts'
import { categories } from './categories.ts'
import { members } from './members.ts'
import { organizations } from './organizations.ts'
import { recurringTransactions } from './recurring-transactions.ts'
import { tokens } from './tokens.ts'
import { transactions } from './transactions.ts'
import { users } from './users.ts'

export const schema = {
  users,
  authAccounts,
  tokens,
  organizations,
  members,
  categories,
  transactions,
  recurringTransactions,
}
