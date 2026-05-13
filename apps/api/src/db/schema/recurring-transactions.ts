import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { categories } from './categories.ts'
import { frequencyEnum, recurringStatusEnum, typeEnum } from './enums.ts'
import { organizations } from './organizations.ts'
import { users } from './users.ts'

export const recurringTransactions = pgTable(
  'recurring_transactions',
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
    status: recurringStatusEnum().notNull().default('ACTIVE'),

    frequency: frequencyEnum().notNull().default('MONTHLY'),
    interval: integer().notNull().default(1),

    startDate: timestamp({ withTimezone: true }).notNull(),
    endDate: timestamp({ withTimezone: true }),

    nextExecutionDate: timestamp({ withTimezone: true }).notNull(),
    lastGeneratedAt: timestamp({ withTimezone: true }),

    ownerId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    orgId: uuid()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('recurring_transactions_org_id_idx').on(table.orgId),
    index('recurring_transactions_status_next_execution_date_idx').on(
      table.status,
      table.nextExecutionDate,
    ),
  ],
)
