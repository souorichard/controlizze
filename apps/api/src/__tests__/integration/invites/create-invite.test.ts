import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as emailsModule from '../../../services/emails/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeInvite,
  makeMember,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

vi.mock('../../../services/emails/index.ts', () => ({
  emails: {
    sendVerifyEmailEmail: vi.fn(),
    sendRecoverPasswordEmail: vi.fn(),
    sendInviteEmail: vi.fn(),
  },
}))

describe('POST /orgs/:slug/invites', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    vi.clearAllMocks()
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create an invite', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/invites`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'invited@example.com', role: 'MEMBER' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('inviteId')
    expect(emailsModule.emails.sendInviteEmail).toHaveBeenCalledOnce()
    expect(emailsModule.emails.sendInviteEmail).toHaveBeenCalledWith({
      to: 'invited@example.com',
      code: expect.any(String),
      orgName: org.name,
      authorName: user.name,
      role: 'MEMBER',
    })
  })

  it('should not be able to create a duplicate invite', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await makeInvite(org.id, user.id, 'invited@example.com')

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/invites`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'invited@example.com', role: 'MEMBER' })

    expect(response.status).toBe(409)
  })

  it('should not be able to invite an existing member', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/invites`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'member@example.com', role: 'MEMBER' })

    expect(response.status).toBe(409)
  })

  it('should not be able to create an invite as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/invites`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'invited@example.com', role: 'MEMBER' })

    expect(response.status).toBe(401)
  })

  it('should not be able to create an invite without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/invites`)
      .send({ email: 'invited@example.com', role: 'MEMBER' })

    expect(response.status).toBe(401)
  })
})
