// src/__tests__/integration/orgs/get-orgs.test.ts
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

describe('GET /orgs', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get organizations', async () => {
    const user = await makeUser()
    await makeOrganization(user.id)
    await makeOrganization(user.id, { slug: 'test-org-2', name: 'Test Org 2' })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get('/orgs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.orgs).toHaveLength(2)
    expect(response.body.orgs[0]).toMatchObject({
      role: 'OWNER',
    })
  })

  it('should return only orgs where user is a member', async () => {
    const owner = await makeUser()
    const org1 = await makeOrganization(owner.id)
    await makeOrganization(owner.id, { slug: 'test-org-2', name: 'Test Org 2' })

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org1.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .get('/orgs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.orgs).toHaveLength(1)
    expect(response.body.orgs[0].id).toBe(org1.id)
    expect(response.body.orgs[0].role).toBe('MEMBER')
  })

  it('should return empty array when user has no organizations', async () => {
    await makeUser()
    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get('/orgs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.orgs).toHaveLength(0)
  })

  it('should not be able to get organizations without authentication', async () => {
    const response = await supertest(app.server).get('/orgs')

    expect(response.status).toBe(401)
  })
})
