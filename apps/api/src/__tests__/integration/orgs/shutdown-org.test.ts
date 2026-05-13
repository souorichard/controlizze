// src/__tests__/integration/orgs/shutdown-org.test.ts
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

describe('DELETE /orgs/:slug', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to shutdown an organization as OWNER', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should not be able to shutdown an organization as ADMIN', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const admin = await makeUser({ email: 'admin@example.com' })
    await makeMember(admin.id, org.id, 'ADMIN')

    const token = await authenticate(app, 'admin@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to shutdown an organization as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to shutdown an organization without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).delete(`/orgs/${org.slug}`)

    expect(response.status).toBe(401)
  })
})
