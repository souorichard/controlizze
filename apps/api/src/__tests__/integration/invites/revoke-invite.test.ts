// src/__tests__/integration/invites/revoke-invite.test.ts
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

describe('DELETE /orgs/:slug/invites/:inviteId', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to revoke an invite', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const { invite } = await makeInvite(org.id, owner.id, 'invited@example.com')

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/invites/${invite.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should not be able to revoke a non existing invite', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/invites/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
  })

  it('should not be able to revoke an invite as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const { invite } = await makeInvite(org.id, owner.id, 'invited@example.com')

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .delete(`/orgs/${org.slug}/invites/${invite.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(401)
  })

  it('should not be able to revoke an invite without authentication', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const { invite } = await makeInvite(org.id, owner.id, 'invited@example.com')

    const response = await supertest(app.server).delete(
      `/orgs/${org.slug}/invites/${invite.id}`,
    )

    expect(response.status).toBe(401)
  })
})
