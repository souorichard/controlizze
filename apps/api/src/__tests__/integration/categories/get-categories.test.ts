import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createSlug } from '../../../utils/create-slug.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeOrganization, makeUser } from '../../helpers/factories.ts'

describe('GET /orgs/:slug/categories', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get categories', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.categories).values([
      {
        name: 'Food',
        slug: createSlug('Food'),
        color: '#ff0000',
        ownerId: user.id,
        orgId: org.id,
      },
      {
        name: 'Salary',
        slug: createSlug('Salary'),
        color: '#00ff00',
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/categories`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.categories).toHaveLength(2)
    expect(response.body.meta).toMatchObject({
      page: 1,
      perPage: 10,
      total: 2,
      totalPages: 1,
    })
  })

  it('should be able to filter categories by name', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.categories).values([
      {
        name: 'Food',
        slug: createSlug('Food'),
        color: '#ff0000',
        ownerId: user.id,
        orgId: org.id,
      },
      {
        name: 'Salary',
        slug: createSlug('Salary'),
        color: '#00ff00',
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/categories?name=sal`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.categories).toHaveLength(1)
    expect(response.body.categories[0].name).toBe('Salary')
  })

  it('should not be able to get categories without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/categories`,
    )

    expect(response.status).toBe(401)
  })
})
