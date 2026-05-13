import { eq } from 'drizzle-orm'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeMember,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('DELETE /orgs/:slug/members/:memberId', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to remove a member', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const [memberRecord] = await db
      .select({ id: schema.members.id })
      .from(schema.members)
      .where(eq(schema.members.userId, member.id))

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/members/${memberRecord.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should not be able to remove a non existing member', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/members/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should not be able to remove a member as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const anotherMember = await makeUser({ email: 'another@example.com' })
    await makeMember(anotherMember.id, org.id, 'MEMBER')

    const [anotherMemberRecord] = await db
      .select({ id: schema.members.id })
      .from(schema.members)
      .where(eq(schema.members.userId, anotherMember.id))

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/members/${anotherMemberRecord.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to remove a member without authentication', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const [memberRecord] = await db
      .select({ id: schema.members.id })
      .from(schema.members)
      .where(eq(schema.members.userId, member.id))

    const response = await supertest(app.server).delete(
      `/orgs/${org.slug}/members/${memberRecord.id}`,
    )

    expect(response.status).toBe(401)
  })
})
