import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { categories } from './categories.ts'
import { statusEnum, typeEnum } from './enums.ts'
import { organizations } from './organizations.ts'
import { recurrences } from './recurrences.ts'
import { users } from './users.ts'

export const transactions = pgTable(
  'transactions',
  {
    id: uuid()
      .primaryKey()
      .$defaultFn(() => uuidv7()),

    title: text().notNull(),
    description: text(),
    type: typeEnum().notNull().default('EXPENSE'),

    categoryId: uuid().references(() => categories.id, {
      onDelete: 'set null',
    }),

    amount: integer().notNull(),
    status: statusEnum().notNull().default('PENDING'),

    transactionDate: timestamp({ withTimezone: true }).notNull().defaultNow(),

    recurrenceId: uuid().references(() => recurrences.id, {
      onDelete: 'set null',
    }),

    ownerId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    orgId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('transactions_org_id_transaction_date_idx').on(
      table.orgId,
      table.transactionDate,
    ),
    index('transactions_org_id_status_idx').on(table.orgId, table.status),
    unique('transactions_recurrence_execution_unique').on(
      table.recurrenceId,
      table.transactionDate,
    ),
  ],
)
