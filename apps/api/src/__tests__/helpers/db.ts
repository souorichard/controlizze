import { db } from '../../db/index.ts'
import { schema } from '../../db/schema/index.ts'

export async function cleanDatabase() {
  await db.delete(schema.invites)
  await db.delete(schema.tokens)
  await db.delete(schema.transactions)
  await db.delete(schema.recurringTransactions)
  await db.delete(schema.categories)
  await db.delete(schema.members)
  await db.delete(schema.organizations)
  await db.delete(schema.users)
}
