import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeInvite,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('GET /pending-invites', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get pending invites', async () => {
    const owner = await makeUser()
    const org1 = await makeOrganization(owner.id)
    const org2 = await makeOrganization(owner.id, {
      slug: 'test-org-2',
      name: 'Test Org 2',
    })

    const member = await makeUser({ email: 'member@example.com' })

    await makeInvite(org1.id, owner.id, member.email)
    await makeInvite(org2.id, owner.id, member.email)

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .get('/pending-invites')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.invites).toHaveLength(2)
  })

  it('should not return accepted or rejected invites', async () => {
    const owner = await makeUser()
    const org1 = await makeOrganization(owner.id)
    const org2 = await makeOrganization(owner.id, {
      slug: 'test-org-2',
      name: 'Test Org 2',
    })
    const org3 = await makeOrganization(owner.id, {
      slug: 'test-org-3',
      name: 'Test Org 3',
    })

    const member = await makeUser({ email: 'member@example.com' })

    await makeInvite(org1.id, owner.id, member.email)
    await makeInvite(org2.id, owner.id, member.email, { status: 'ACCEPTED' })
    await makeInvite(org3.id, owner.id, member.email, { status: 'REJECTED' })

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .get('/pending-invites')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.invites).toHaveLength(1)
  })

  it('should not be able to get pending invites without authentication', async () => {
    const response = await supertest(app.server).get('/pending-invites')

    expect(response.status).toBe(401)
  })
})
