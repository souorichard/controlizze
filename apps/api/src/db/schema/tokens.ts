import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { tokenTypeEnum } from './enums.ts'
import { users } from './users.ts'

export const tokens = pgTable('tokens', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  type: tokenTypeEnum().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp().notNull().defaultNow(),
})
