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

describe('GET /orgs/:slug/members', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get organization members', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/members`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.members).toHaveLength(2)
    expect(response.body.meta).toMatchObject({
      page: 1,
      perPage: 10,
      total: 2,
      totalPages: 1,
    })
  })

  it('should be able to get members as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/members`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.members).toHaveLength(2)
  })

  it('should not be able to get members without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/members`,
    )

    expect(response.status).toBe(401)
  })
})
