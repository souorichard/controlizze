import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeUser } from '../../helpers/factories.ts'

describe('POST /sessions/password', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to authenticate with valid credentials', async () => {
    await makeUser()

    const response = await supertest(app.server).post('/sessions').send({
      email: 'john@example.com',
      password: '12345678',
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(typeof response.body.token).toBe('string')
  })

  it('should not be able to authenticate with wrong password', async () => {
    await makeUser()

    const response = await supertest(app.server).post('/sessions').send({
      email: 'john@example.com',
      password: 'wrong-password',
    })

    expect(response.status).toBe(400)
  })

  it('should not be able to authenticate with non existing email', async () => {
    const response = await supertest(app.server).post('/sessions').send({
      email: 'nobody@example.com',
      password: '12345678',
    })

    expect(response.status).toBe(400)
  })

  it('should not be able to authenticate without password set', async () => {
    await makeUser({ email: 'nopassword@example.com', passwordHash: null })

    const response = await supertest(app.server).post('/sessions').send({
      email: 'nopassword@example.com',
      password: '12345678',
    })

    expect(response.status).toBe(400)
  })
})
