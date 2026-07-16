import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('GET /orgs/:slug/metrics/top-expense-categories', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get top expense categories', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const food = await makeCategory(user.id, org.id, {
      name: 'Food',
    })
    const rent = await makeCategory(user.id, org.id, {
      name: 'Rent',
    })

    await db.insert(schema.transactions).values([
      {
        title: 'Supermarket',
        type: 'EXPENSE',
        amount: 30000,
        status: 'PAID',
        transactionDate: new Date(),
        categoryId: food.id,
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Rent',
        type: 'EXPENSE',
        amount: 150000,
        status: 'PAID',
        transactionDate: new Date(),
        categoryId: rent.id,
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/top-expense-categories`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.categories).toHaveLength(2)
    expect(response.body.categories[0].category).toBe('Rent')
    expect(response.body.categories[0].amount).toBe(1500)
    expect(response.body.categories[1].category).toBe('Food')
    expect(response.body.categories[1].amount).toBe(300)
  })

  it('should ignore canceled transactions', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const food = await makeCategory(user.id, org.id, {
      name: 'Food',
    })

    await db.insert(schema.transactions).values([
      {
        title: 'Supermarket',
        type: 'EXPENSE',
        amount: 30000,
        status: 'PAID',
        transactionDate: new Date(),
        categoryId: food.id,
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Canceled',
        type: 'EXPENSE',
        amount: 100000,
        status: 'CANCELED',
        transactionDate: new Date(),
        categoryId: food.id,
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/top-expense-categories`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.categories[0].amount).toBe(300)
  })

  it('should not include income transactions', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.transactions).values({
      title: 'Salary',
      type: 'INCOME',
      amount: 500000,
      status: 'PAID',
      transactionDate: new Date(),
      ownerId: user.id,
      orgId: org.id,
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/top-expense-categories`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.categories).toHaveLength(0)
  })

  it('should not be able to get top expense categories without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/metrics/top-expense-categories`,
    )

    expect(response.status).toBe(401)
  })
})
