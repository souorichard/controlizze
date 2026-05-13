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

describe('PATCH /orgs/:slug/avatar', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to update organization avatar', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const token = await authenticate(app)

    const avatarUrl = 'https://example.com/avatar.png'

    const response = await supertest(app.server)
      .patch(`/orgs/${org.slug}/avatar`)
      .set('Authorization', `Bearer ${token}`)
      .send({ avatarUrl })

    expect(response.status).toBe(204)

    const [updatedOrg] = await db
      .select({ avatarUrl: schema.organizations.avatarUrl })
      .from(schema.organizations)
      .where(eq(schema.organizations.id, org.id))

    expect(updatedOrg.avatarUrl).toBe(avatarUrl)
  })

  it('should not be able to update organization avatar as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .patch(`/orgs/${org.slug}/avatar`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        avatarUrl: 'https://example.com/avatar.png',
      })

    expect(response.status).toBe(401)
  })

  it('should not be able to update organization avatar without authentication', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const response = await supertest(app.server)
      .patch(`/orgs/${org.slug}/avatar`)
      .send({
        avatarUrl: 'https://example.com/avatar.png',
      })

    expect(response.status).toBe(401)
  })

  it('should not be able to update organization avatar with invalid avatar url', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .patch(`/orgs/${org.slug}/avatar`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        avatarUrl: 'invalid-url',
      })

    expect(response.status).toBe(400)
  })
})
