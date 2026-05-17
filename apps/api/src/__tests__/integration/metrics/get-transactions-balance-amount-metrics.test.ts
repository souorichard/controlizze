import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeOrganization, makeUser } from '../../helpers/factories.ts'

describe('GET /orgs/:slug/metrics/transactions-balance', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get balance amount', async () => {
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
        title: 'Rent',
        type: 'EXPENSE',
        amount: 200000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/transactions-balance`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.amount).toBe(3000) // 5000 - 2000
  })

  it('should return negative balance when expenses exceed income', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.transactions).values([
      {
        title: 'Salary',
        type: 'INCOME',
        amount: 100000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Rent',
        type: 'EXPENSE',
        amount: 300000,
        status: 'PAID',
        transactionDate: new Date(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/transactions-balance`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.amount).toBe(-2000)
  })

  it('should return null diff when no previous balance', async () => {
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
      .get(`/orgs/${org.slug}/metrics/transactions-balance`)
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
      .get(`/orgs/${org.slug}/metrics/transactions-balance`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.amount).toBe(5000)
  })

  it('should not be able to get balance without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/metrics/transactions-balance`,
    )

    expect(response.status).toBe(401)
  })
})
