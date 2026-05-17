// update-account-name.test.ts
import { eq } from 'drizzle-orm'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeUser } from '../../helpers/factories.ts'

describe('PATCH /me/name', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to update account name', async () => {
    const user = await makeUser()

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .patch('/me/name')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
      })

    expect(response.status).toBe(204)

    const [updatedUser] = await db
      .select({
        name: schema.users.name,
      })
      .from(schema.users)
      .where(eq(schema.users.id, user.id))

    expect(updatedUser.name).toBe('Updated Name')
  })

  it('should not be able to update account name without authentication', async () => {
    const response = await supertest(app.server).patch('/me/name').send({
      name: 'Updated Name',
    })

    expect(response.status).toBe(401)
  })

  it('should not be able to update account name with empty name', async () => {
    await makeUser()

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .patch('/me/name')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '',
      })

    expect(response.status).toBe(400)
  })
})
