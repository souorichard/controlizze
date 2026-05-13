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

describe('GET /orgs/:slug/membership', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get membership as OWNER', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/membership`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.membership).toMatchObject({
      role: 'OWNER',
      userId: user.id,
      orgId: org.id,
    })
  })

  it('should be able to get membership as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/membership`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.membership).toMatchObject({
      role: 'MEMBER',
      userId: member.id,
      orgId: org.id,
    })
  })

  it('should not be able to get membership without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/membership`,
    )

    expect(response.status).toBe(401)
  })

  it('should not be able to get membership of org user does not belong to', async () => {
    const owner = await makeUser()
    await makeOrganization(owner.id)

    const other = await makeUser({ email: 'other@example.com' })
    const otherOrg = await makeOrganization(other.id, {
      slug: 'other-org',
      name: 'Other Org',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${otherOrg.slug}/membership`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })
})
