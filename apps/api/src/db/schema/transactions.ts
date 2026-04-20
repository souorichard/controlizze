import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { categories } from './categories.ts'
import { statusEnum, typeEnum } from './enums.ts'
import { organizations } from './organizations.ts'
import { recurringTransactions } from './recurring-transactions.ts'
import { users } from './users.ts'

export const transactions = pgTable('transactions', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),

  title: text().notNull(),
  description: text(),
  type: typeEnum().notNull().default('EXPENSE'),

  categoryId: uuid().references(() => categories.id, { onDelete: 'set null' }),

  amount: numeric().notNull(),
  status: statusEnum().notNull().default('PENDING'),

  transactionDate: timestamp().notNull().defaultNow(),

  recurringTransactionId: uuid().references(() => recurringTransactions.id, {
    onDelete: 'set null',
  }),
  ownerId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  orgId: uuid()
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),

  createdAt: timestamp().notNull().defaultNow(),
})
