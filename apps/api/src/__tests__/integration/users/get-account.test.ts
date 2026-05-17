// get-account.test.ts
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeUser } from '../../helpers/factories.ts'

describe('GET /account', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get account information', async () => {
    const user = await makeUser()

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    console.log(response.body)

    expect(response.status).toBe(200)
    expect(response.body.user).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    })
  })

  it('should not be able to get account information without authentication', async () => {
    const response = await supertest(app.server).get('/me')

    expect(response.status).toBe(401)
  })
})
