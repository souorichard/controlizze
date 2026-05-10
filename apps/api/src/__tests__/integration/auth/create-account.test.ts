import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emails } from '../../../services/emails/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { cleanDatabase } from '../../helpers/db.ts'

vi.mock('../../../services/emails/index.ts', () => ({
  emails: {
    sendVerifyEmailEmail: vi.fn(),
    sendRecoverPasswordEmail: vi.fn(),
    sendInviteEmail: vi.fn(),
  },
}))

describe('POST /accounts', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    vi.clearAllMocks()
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create a new account', async () => {
    const response = await supertest(app.server).post('/accounts').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345678',
    })

    expect(response.status).toBe(201)
    expect(emails.sendVerifyEmailEmail).toHaveBeenCalledOnce()
    expect(emails.sendVerifyEmailEmail).toHaveBeenCalledWith({
      to: 'john@example.com',
      code: expect.any(String),
      userName: 'John Doe',
    })
  })

  it('should not be able to create account with duplicate email', async () => {
    await supertest(app.server).post('/accounts').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345678',
    })

    const response = await supertest(app.server).post('/accounts').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '12345678',
    })

    expect(response.status).toBe(409)
  })

  it('should not be able to create account with invalid email', async () => {
    const response = await supertest(app.server).post('/accounts').send({
      name: 'John Doe',
      email: 'invalid-email',
      password: '12345678',
    })

    expect(response.status).toBe(400)
  })

  it('should not be able to create account with short password', async () => {
    const response = await supertest(app.server).post('/accounts').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123',
    })

    expect(response.status).toBe(400)
  })
})
