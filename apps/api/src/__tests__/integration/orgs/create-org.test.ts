import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeUser } from '../../helpers/factories.ts'

describe('POST /orgs', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create an organization', async () => {
    await makeUser()
    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'My Organization' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('orgId')
    expect(response.body).toHaveProperty('orgSlug')
    expect(response.body.orgSlug).toContain('my-organization')
  })

  it('should not be able to create an organization without authentication', async () => {
    const response = await supertest(app.server)
      .post('/orgs')
      .send({ name: 'My Organization' })

    expect(response.status).toBe(401)
  })

  it('should not be able to create an organization without a name', async () => {
    await makeUser()
    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })

    expect(response.status).toBe(400)
  })
})
