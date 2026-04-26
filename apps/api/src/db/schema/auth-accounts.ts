import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { accountProviderEnum } from './enums.ts'
import { users } from './users.ts'

export const authAccounts = pgTable(
  'auth_accounts',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    provider: accountProviderEnum().notNull(),
    providerAccountId: text().notNull(),

    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [
    unique('auth_accounts_provider_provider_account_id_unique').on(
      table.provider,
      table.providerAccountId,
    ),
    unique('auth_accounts_provider_user_id_unique').on(
      table.provider,
      table.userId,
    ),
  ],
)
