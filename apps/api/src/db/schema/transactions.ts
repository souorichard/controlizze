import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { categories } from './categories.ts'
import { statusEnum, typeEnum } from './enums.ts'

export const transactions = pgTable('transactions', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  title: text().notNull(),
  description: text(),
  type: typeEnum().notNull().default('EXPENSE'),
  categoryId: uuid()
    .notNull()
    .references(() => categories.id),
  amount: numeric().notNull(),
  status: statusEnum().notNull().default('PENDING'),
  transactionDate: timestamp().notNull().defaultNow(),
  createdAt: timestamp().notNull().defaultNow(),
})
