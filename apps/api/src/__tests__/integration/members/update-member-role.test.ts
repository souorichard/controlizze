// src/__tests__/integration/members/update-member-role.test.ts
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeMember,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('PUT /orgs/:slug/members/:memberId', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to update a member role', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    const memberRecord = await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/members/${memberRecord.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' })

    expect(response.status).toBe(204)
  })

  it('should not be able to update a non existing member', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/members/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' })

    expect(response.status).toBe(404)
  })

  it('should not be able to update a member role as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const anotherMember = await makeUser({ email: 'another@example.com' })
    const anotherMemberRecord = await makeMember(
      anotherMember.id,
      org.id,
      'MEMBER',
    )

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/members/${anotherMemberRecord.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' })

    expect(response.status).toBe(401)
  })

  it('should not be able to update a member role without authentication', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    const memberRecord = await makeMember(member.id, org.id, 'MEMBER')

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/members/${memberRecord.id}`)
      .send({ role: 'ADMIN' })

    expect(response.status).toBe(401)
  })
})
