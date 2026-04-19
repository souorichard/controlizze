import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { typeEnum } from './enums.ts'
import { organizations } from './organizations.ts'
import { users } from './users.ts'

export const categories = pgTable(
  'categories',
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuidv7()),
    name: text().notNull(),
    slug: text().notNull().unique(),
    color: text().notNull(),
    type: typeEnum().notNull().default('EXPENSE'),
    ownerId: uuid()
      .notNull()
      .references(() => users.id),
    orgId: uuid()
      .notNull()
      .references(() => organizations.id),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    unique('slug_type').on(table.slug, table.type),
    unique('name_slug_type_orgid').on(
      table.name,
      table.slug,
      table.type,
      table.orgId,
    ),
  ],
)
