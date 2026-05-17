import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeOrganization, makeUser } from '../../helpers/factories.ts'

describe('GET /orgs/:slug/metrics/transactions-amount', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get current month income amount', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.transactions).values([
      {
        title: 'Salary',
        type: 'INCOME',
        amount: 500000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Bonus',
        type: 'INCOME',
        amount: 300000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Rent',
        type: 'EXPENSE',
        amount: 100000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/transactions-amount?type=INCOME`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.amount).toBe(8000)
  })

  it('should be able to get current month expense amount', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.transactions).values([
      {
        title: 'Rent',
        type: 'EXPENSE',
        amount: 200000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Salary',
        type: 'INCOME',
        amount: 500000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/transactions-amount?type=EXPENSE`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.amount).toBe(2000)
  })

  it('should return null diff when no last month transactions', async () => {
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
      .get(`/orgs/${org.slug}/metrics/transactions-amount?type=INCOME`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.diffFromLastMonth).toBeNull()
  })

  it('should ignore canceled transactions', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.transactions).values([
      {
        title: 'Salary',
        type: 'INCOME',
        amount: 500000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Canceled',
        type: 'INCOME',
        amount: 100000,
        status: 'CANCELED',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/transactions-amount?type=INCOME`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.amount).toBe(5000)
  })

  it('should not be able to get metrics without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/metrics/transactions-amount?type=INCOME`,
    )

    expect(response.status).toBe(401)
  })
})
