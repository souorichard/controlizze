import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { hashToken } from '../../../utils/hash-token.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeInvite,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('POST /invites/reject', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to reject an invite', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const member = await makeUser({ email: 'member@example.com' })

    const { code } = await makeInvite(org.id, owner.id, member.email)

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .post(`/invites/reject?code=${code}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)

    const [invite] = await db
      .select({ status: schema.invites.status })
      .from(schema.invites)
      .where(eq(schema.invites.tokenHash, hashToken(code)))

    expect(invite.status).toBe('REJECTED')
  })

  it('should not be able to reject an invite with invalid code', async () => {
    await makeUser()
    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post('/invites/reject?code=invalidcode')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
  })

  it('should not be able to reject an invite belonging to another user', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const { code } = await makeInvite(org.id, owner.id, 'another@example.com')

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/invites/reject?code=${code}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
  })

  it('should not be able to reject an expired invite', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const member = await makeUser({ email: 'member@example.com' })

    const { code } = await makeInvite(org.id, owner.id, member.email, {
      expiresAt: dayjs().subtract(1, 'day').toDate(),
    })

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .post(`/invites/reject?code=${code}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(400)
  })

  it('should not be able to reject an invite without authentication', async () => {
    const response = await supertest(app.server).post(
      '/invites/reject?code=anycode',
    )

    expect(response.status).toBe(401)
  })
})
