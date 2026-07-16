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

describe('PATCH /orgs/:slug/owner', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to transfer organization ownership', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .patch(`/orgs/${org.slug}/owner`)
      .set('Authorization', `Bearer ${token}`)
      .send({ transferToUserId: member.id })

    console.log(response.error)

    expect(response.status).toBe(204)

    const [updatedOrg] = await db
      .select({ ownerId: schema.organizations.ownerId })
      .from(schema.organizations)
      .where(eq(schema.organizations.id, org.id))

    expect(updatedOrg.ownerId).toBe(member.id)
  })

  it('should not be able to transfer ownership to a non member', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const nonMember = await makeUser({ email: 'nonmember@example.com' })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .patch(`/orgs/${org.slug}/owner`)
      .set('Authorization', `Bearer ${token}`)
      .send({ transferToUserId: nonMember.id })

    expect(response.status).toBe(400)
  })

  it('should not be able to transfer ownership as ADMIN', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const admin = await makeUser({ email: 'admin@example.com' })
    await makeMember(admin.id, org.id, 'ADMIN')

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'admin@example.com')

    const response = await supertest(app.server)
      .patch(`/orgs/${org.slug}/owner`)
      .set('Authorization', `Bearer ${token}`)
      .send({ transferToUserId: member.id })

    expect(response.status).toBe(401)
  })

  it('should not be able to transfer ownership without authentication', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const response = await supertest(app.server)
      .patch(`/orgs/${org.slug}/owner`)
      .send({ transferToUserId: member.id })

    expect(response.status).toBe(401)
  })
})
