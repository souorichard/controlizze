import { randomBytes } from 'node:crypto'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'
import { db } from '../../db/index.ts'
import { schema } from '../../db/schema/index.ts'
import { createSlug } from '../../utils/create-slug.ts'
import { hashToken } from '../../utils/hash-token.ts'

export async function makeUser(
  override?: Partial<typeof schema.users.$inferInsert>,
) {
  const [user] = await db
    .insert(schema.users)
    .values({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: await hash('12345678', 8),
      emailVerifiedAt: new Date(),
      ...override,
    })
    .returning()

  return user
}

export async function makeOrganization(
  userId: string,
  override?: Partial<typeof schema.organizations.$inferInsert>,
) {
  const [org] = await db
    .insert(schema.organizations)
    .values({
      name: 'Test Org',
      slug: 'test-org',
      ownerId: userId,
      ...override,
    })
    .returning()

  await db.insert(schema.members).values({
    userId,
    orgId: org.id,
    role: 'OWNER',
  })

  return org
}

export async function makeMember(
  userId: string,
  orgId: string,
  role: 'ADMIN' | 'MEMBER' = 'MEMBER',
) {
  const [member] = await db
    .insert(schema.members)
    .values({ userId, orgId, role })
    .returning()

  return member
}

export async function makeCategory(
  userId: string,
  orgId: string,
  override?: Partial<typeof schema.categories.$inferInsert>,
) {
  const [category] = await db
    .insert(schema.categories)
    .values({
      name: 'Food',
      slug: createSlug('Food'),
      color: '#ff0000',
      ownerId: userId,
      orgId,
      ...override,
    })
    .returning()

  return category
}

export async function makeInvite(
  orgId: string,
  authorId: string,
  email: string,
  override?: Partial<typeof schema.invites.$inferInsert>,
) {
  const code = randomBytes(32).toString('hex')

  const [invite] = await db
    .insert(schema.invites)
    .values({
      email,
      role: 'MEMBER',
      tokenHash: hashToken(code),
      orgId,
      authorId,
      expiresAt: dayjs().add(7, 'days').toDate(),
      ...override,
    })
    .returning()

  return { invite, code }
}

export async function makeRecurrence(
  userId: string,
  orgId: string,
  categoryId: string,
  override?: Partial<typeof schema.recurrences.$inferInsert>,
) {
  const [recurrence] = await db
    .insert(schema.recurrences)
    .values({
      title: 'Monthly Salary',
      type: 'INCOME',
      amount: 500000,
      status: 'ACTIVE',
      frequency: 'MONTHLY',
      interval: 1,
      startDate: dayjs().toDate(),
      nextExecutionDate: dayjs().add(1, 'month').toDate(),
      ownerId: userId,
      orgId,
      categoryId,
      ...override,
    })
    .returning()

  return recurrence
}

export async function makeTransaction(
  userId: string,
  orgId: string,
  override?: Partial<typeof schema.transactions.$inferInsert>,
) {
  const [transaction] = await db
    .insert(schema.transactions)
    .values({
      title: 'Test Transaction',
      type: 'EXPENSE',
      amount: 10000,
      status: 'PAID',
      transactionDate: new Date(),
      ownerId: userId,
      orgId,
      ...override,
    })
    .returning()

  return transaction
}
