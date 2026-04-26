import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const users = pgTable(
  'users',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    name: text(),

    email: text().notNull(),

    passwordHash: text(),

    avatarUrl: text(),
    avatarKey: text(),

    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [unique('users_email_unique').on(table.email)],
)
