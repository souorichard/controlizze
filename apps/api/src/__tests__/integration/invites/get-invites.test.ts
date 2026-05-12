import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeInvite,
  makeMember,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('GET /orgs/:slug/invites', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get organization invites', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    await makeInvite(org.id, owner.id, 'invited1@example.com')
    await makeInvite(org.id, owner.id, 'invited2@example.com')

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/invites`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.invites).toHaveLength(2)
    expect(response.body.meta).toMatchObject({
      page: 1,
      perPage: 10,
      total: 2,
      totalPages: 1,
    })
  })

  it('should not be able to get invites as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/invites`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to get invites without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/invites`,
    )

    expect(response.status).toBe(401)
  })
})
