import { index, pgTable, unique, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { roleEnum } from './enums.ts'
import { organizations } from './organizations.ts'
import { users } from './users.ts'

export const members = pgTable(
  'members',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    role: roleEnum().notNull().default('MEMBER'),

    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    orgId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
  },
  (table) => [
    unique('members_user_id_org_id_unique').on(table.userId, table.orgId),
    index('members_org_id_idx').on(table.orgId),
  ],
)
