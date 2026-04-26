import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { tokenTypeEnum } from './enums.ts'
import { users } from './users.ts'

export const tokens = pgTable(
  'tokens',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    tokenHash: text().notNull(),

    type: tokenTypeEnum().notNull(),

    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    expiresAt: timestamp().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    unique('tokens_token_hash_unique').on(table.tokenHash),
    index('tokens_user_id_idx').on(table.userId),
    index('tokens_type_idx').on(table.type),
  ],
)
