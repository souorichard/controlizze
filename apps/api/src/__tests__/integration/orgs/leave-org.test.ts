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

describe('DELETE /orgs/:slug/leave', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to leave an organization', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/leave`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should not be able to leave an organization as OWNER', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/leave`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to leave an organization without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).delete(
      `/orgs/${org.slug}/leave`,
    )

    expect(response.status).toBe(401)
  })
})
