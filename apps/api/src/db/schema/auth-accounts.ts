import { pgTable, text, unique, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { accountProviderEnum } from './enums.ts'
import { users } from './users.ts'

export const authAccounts = pgTable(
  'auth_accounts',
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuidv7()),

    provider: accountProviderEnum().notNull(),
    providerAccountId: text().notNull().unique(),

    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [unique('provider_userid').on(table.provider, table.userId)],
)
