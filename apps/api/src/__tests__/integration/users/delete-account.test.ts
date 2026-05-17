// src/__tests__/integration/users/delete-account.test.ts
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeUser } from '../../helpers/factories.ts'

describe('DELETE /me', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to delete account', async () => {
    await makeUser()
    const token = await authenticate(app)

    const response = await supertest(app.server)
      .delete('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })

  it('should not be able to delete account without authentication', async () => {
    const response = await supertest(app.server).delete('/me')

    expect(response.status).toBe(401)
  })
})
