// update-account-avatar.test.ts
import { eq } from 'drizzle-orm'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeUser } from '../../helpers/factories.ts'

describe('PATCH /me/avatar', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to update account avatar', async () => {
    const user = await makeUser()

    const token = await authenticate(app)

    const avatarUrl = 'https://example.com/avatar.png'

    const response = await supertest(app.server)
      .patch('/me/avatar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        avatarUrl,
      })

    expect(response.status).toBe(204)

    const [updatedUser] = await db
      .select({
        avatarUrl: schema.users.avatarUrl,
      })
      .from(schema.users)
      .where(eq(schema.users.id, user.id))

    expect(updatedUser.avatarUrl).toBe(avatarUrl)
  })

  it('should not be able to update account avatar without authentication', async () => {
    const response = await supertest(app.server).patch('/me/avatar').send({
      avatarUrl: 'https://example.com/avatar.png',
    })

    expect(response.status).toBe(401)
  })

  it('should not be able to update account avatar with invalid avatar url', async () => {
    await makeUser()

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .patch('/me/avatar')
      .set('Authorization', `Bearer ${token}`)
      .send({
        avatarUrl: 'invalid-url',
      })

    expect(response.status).toBe(400)
  })
})
