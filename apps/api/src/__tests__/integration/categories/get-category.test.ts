import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('GET /orgs/:slug/categories/:categoryId', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get category details', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const category = await makeCategory(user.id, org.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/categories/${category.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.category).toMatchObject({
      id: category.id,
      name: 'Food',
      color: '#ff0000',
      type: 'EXPENSE',
    })
    expect(response.body.category.owner).toBeDefined()
  })

  it('should not be able to get category from another org', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)

    const anotherUser = await makeUser({ email: 'another@example.com' })
    const anotherOrg = await makeOrganization(anotherUser.id, {
      name: 'Another Org',
      slug: 'another-org',
    })

    const category = await makeCategory(anotherUser.id, anotherOrg.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/categories/${category.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(404)
    expect(response.body.category).toBeUndefined()
  })

  it('should not be able to get category without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const category = await makeCategory(user.id, org.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/categories/${category.id}`,
    )

    expect(response.status).toBe(401)
  })
})
