import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { users } from './users.ts'

export const organizations = pgTable('organizations', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),

  name: text().notNull(),
  slug: text().notNull().unique(),

  avatarUrl: text(),
  avatarKey: text(),

  ownerId: uuid()
    .notNull()
    .references(() => users.id),

  createdAt: timestamp().notNull().defaultNow(),
})
