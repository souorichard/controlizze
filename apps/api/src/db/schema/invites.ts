import { pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { inviteStatusEnum, roleEnum } from './enums.ts'
import { organizations } from './organizations.ts'
import { users } from './users.ts'

export const invites = pgTable(
  'invites',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    tokenHash: text().notNull(),

    email: text().notNull(),
    role: roleEnum().notNull().default('MEMBER'),

    status: inviteStatusEnum().notNull().default('PENDING'),

    expiresAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),

    authorId: uuid().references(() => users.id, { onDelete: 'set null' }),

    orgId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
  },
  (table) => [
    unique('invites_token_hash_unique').on(table.tokenHash),
    unique('invites_email_org_id_unique').on(table.email, table.orgId),
  ],
)
