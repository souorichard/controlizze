import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { billingCycleEnum, planEnum } from './enums.ts'
import { users } from './users.ts'

export const organizations = pgTable(
  'organizations',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    name: text().notNull(),
    slug: text().notNull(),

    description: text(),

    avatarUrl: text(),
    avatarKey: text(),

    plan: planEnum().notNull().default('FREE'),
    billingCycle: billingCycleEnum().default('MONTHLY'),

    ownerId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique('organizations_slug_unique').on(table.slug),
    index('organizations_owner_id_idx').on(table.ownerId),
  ],
)
