import { hash } from 'bcryptjs'
import { db } from '../../db/index.ts'
import { schema } from '../../db/schema/index.ts'

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
  await db.insert(schema.members).values({ userId, orgId, role })
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
      color: '#ff0000',
      type: 'EXPENSE',
      ownerId: userId,
      orgId,
      ...override,
    })
    .returning()

  return category
}
