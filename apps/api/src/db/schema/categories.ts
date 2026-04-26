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
      .$defaultFn(() => uuidv7()),

    name: text().notNull(),
    color: text().notNull(),
    type: typeEnum().notNull().default('EXPENSE'),

    ownerId: uuid().references(() => users.id, { onDelete: 'set null' }),

    orgId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [
    unique('categories_org_id_name_type_unique').on(
      table.orgId,
      table.name,
      table.type,
    ),
  ],
)
