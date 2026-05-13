import dayjs from 'dayjs'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeOrganization, makeUser } from '../../helpers/factories.ts'

describe('GET /orgs/:slug/metrics/balance-evolution', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get balance evolution', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.transactions).values([
      {
        title: 'Salary',
        type: 'INCOME',
        amount: 500000,
        status: 'COMPLETED',
        transactionDate: dayjs().month(0).toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Rent',
        type: 'EXPENSE',
        amount: 200000,
        status: 'COMPLETED',
        transactionDate: dayjs().month(0).toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Salary',
        type: 'INCOME',
        amount: 500000,
        status: 'COMPLETED',
        transactionDate: dayjs().month(1).toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/balance-evolution`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.evolutions).toHaveLength(12)

    const january = response.body.evolutions[0]
    const february = response.body.evolutions[1]

    expect(january.balance).toBe(3000)
    expect(february.balance).toBe(8000)
  })

  it('should ignore canceled transactions', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    await db.insert(schema.transactions).values([
      {
        title: 'Salary',
        type: 'INCOME',
        amount: 500000,
        status: 'COMPLETED',
        transactionDate: dayjs().month(0).toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Canceled',
        type: 'INCOME',
        amount: 100000,
        status: 'CANCELED',
        transactionDate: dayjs().month(0).toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/balance-evolution`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.evolutions[0].balance).toBe(5000)
  })

  it('should not be able to get balance evolution without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server).get(
      `/orgs/${org.slug}/metrics/balance-evolution`,
    )

    expect(response.status).toBe(401)
  })
})
