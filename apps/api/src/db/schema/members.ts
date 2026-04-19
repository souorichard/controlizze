import { pgTable, unique, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { roleEnum } from './enums.ts'
import { organizations } from './organizations.ts'
import { users } from './users.ts'

export const members = pgTable(
  'members',
  {
    id: uuid()
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuidv7()),
    role: roleEnum().notNull().default('MEMBER'),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    orgId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
  },
  (table) => [unique('userid_orgid').on(table.userId, table.orgId)],
)
