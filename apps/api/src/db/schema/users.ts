import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const users = pgTable('users', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),

  name: text().notNull(),
  email: text().notNull().unique(),
  hashPassword: text(),

  avatarUrl: text(),
  avatarKey: text(),

  createdAt: timestamp().notNull().defaultNow(),
})
