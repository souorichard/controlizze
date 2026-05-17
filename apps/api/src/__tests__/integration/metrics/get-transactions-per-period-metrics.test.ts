import dayjs from 'dayjs'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeOrganization, makeUser } from '../../helpers/factories.ts'

describe('GET /orgs/:slug/metrics/transactions-per-period', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get transactions per period', async () => {
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
      .get(`/orgs/${org.slug}/metrics/transactions-per-period`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(1)
    expect(response.body.transactions[0]).toMatchObject({
      incomes: 5000,
      expenses: 2000,
    })
  })

  it('should be able to filter by last months', async () => {
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
        title: 'Old salary',
        type: 'INCOME',
        amount: 500000,
        status: 'PAID',
        transactionDate: dayjs().subtract(2, 'months').toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/transactions-per-period?lastMonths=1`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions).toHaveLength(1)
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
      .get(`/orgs/${org.slug}/metrics/transactions-per-period`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.transactions[0].incomes).toBe(5000)
  })

  it('should not be able to get transactions per period without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/metrics/transactions-per-period`,
    )

    expect(response.status).toBe(401)
  })
})
