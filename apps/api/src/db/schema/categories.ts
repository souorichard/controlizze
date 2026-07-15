import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { organizations } from './organizations.ts'
import { users } from './users.ts'

export const categories = pgTable(
  'categories',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    name: text().notNull(),
    slug: text().notNull(),

    color: text().notNull(),

    ownerId: uuid().references(() => users.id, { onDelete: 'set null' }),

    orgId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique('categories_org_id_name_unique').on(table.orgId, table.name),
  ],
)
