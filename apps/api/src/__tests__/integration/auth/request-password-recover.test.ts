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

describe('POST /sessions/forgot-password', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    vi.clearAllMocks()
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to send recovery email when user exists', async () => {
    await makeUser()

    const response = await supertest(app.server)
      .post('/sessions/forgot-password')
      .send({ email: 'john@example.com' })

    expect(response.status).toBe(201)
    expect(emailsModule.emails.sendRecoverPasswordEmail).toHaveBeenCalledOnce()
    expect(emailsModule.emails.sendRecoverPasswordEmail).toHaveBeenCalledWith({
      to: 'john@example.com',
      code: expect.any(String),
      userName: 'John Doe',
    })
  })

  it('should be able to return 201 even when user does not exist', async () => {
    const response = await supertest(app.server)
      .post('/sessions/forgot-password')
      .send({ email: 'nobody@example.com' })

    expect(response.status).toBe(201)
    expect(emailsModule.emails.sendRecoverPasswordEmail).not.toHaveBeenCalled()
  })
})
