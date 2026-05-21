// src/__tests__/integration/auth/resend-verification.test.ts
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as emailsModule from '../../../services/emails/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeUser } from '../../helpers/factories.ts'

vi.mock('../../../services/emails/index.ts', () => ({
  emails: {
    sendVerifyEmailEmail: vi.fn(),
    sendRecoverPasswordEmail: vi.fn(),
    sendInviteEmail: vi.fn(),
  },
}))

describe('POST /sessions/resend-verification', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    vi.clearAllMocks()
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to resend verification email', async () => {
    await makeUser({ emailVerifiedAt: null })

    const response = await supertest(app.server)
      .post('/sessions/resend-verification')
      .send({ email: 'john@example.com' })

    expect(response.status).toBe(201)
    expect(emailsModule.emails.sendVerifyEmailEmail).toHaveBeenCalledOnce()
    expect(emailsModule.emails.sendVerifyEmailEmail).toHaveBeenCalledWith({
      to: 'john@example.com',
      code: expect.any(String),
      userName: 'John Doe',
    })
  })

  it('should return 201 even when user does not exist', async () => {
    const response = await supertest(app.server)
      .post('/sessions/resend-verification')
      .send({ email: 'nobody@example.com' })

    expect(response.status).toBe(201)
    expect(emailsModule.emails.sendVerifyEmailEmail).not.toHaveBeenCalled()
  })

  it('should return 201 without sending email when already verified', async () => {
    await makeUser({ emailVerifiedAt: new Date() })

    const response = await supertest(app.server)
      .post('/sessions/resend-verification')
      .send({ email: 'john@example.com' })

    expect(response.status).toBe(201)
    expect(emailsModule.emails.sendVerifyEmailEmail).not.toHaveBeenCalled()
  })
})
