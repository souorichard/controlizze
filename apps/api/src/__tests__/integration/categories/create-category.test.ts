import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeMember,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('POST /orgs/:slug/categories', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create a category', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/categories`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Food', color: '#ff0000', type: 'EXPENSE' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('categoryId')
  })

  it('should not be able to create a category without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/categories`)
      .send({ name: 'Food', color: '#ff0000', type: 'EXPENSE' })

    expect(response.status).toBe(401)
  })

  it('should not be able to create a category as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com', '12345678')

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/categories`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Food', color: '#ff0000', type: 'EXPENSE' })

    expect(response.status).toBe(401)
  })
})
