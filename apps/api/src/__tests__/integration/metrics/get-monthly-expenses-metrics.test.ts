import dayjs from 'dayjs'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../../db/index.ts'
import { schema } from '../../../db/schema/index.ts'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import { makeOrganization, makeUser } from '../../helpers/factories.ts'

describe('GET /orgs/:slug/metrics/monthly-expenses', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to get last 6 months expenses', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const now = dayjs()

    await db.insert(schema.transactions).values([
      {
        title: 'Recent Expense',
        type: 'EXPENSE',
        amount: 150000,
        status: 'PAID',
        transactionDate: now.toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Old Expense',
        type: 'EXPENSE',
        amount: 50000,
        status: 'PAID',
        transactionDate: now.subtract(2, 'month').toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
      {
        title: 'Income Ignored',
        type: 'INCOME',
        amount: 200000,
        status: 'PAID',
        transactionDate: now.toDate(),
        ownerId: user.id,
        orgId: org.id,
      },
    ])

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .get(`/orgs/${org.slug}/metrics/monthly-expenses`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.expenses).toHaveLength(6)

    // current month should include Recent Expense (150000 -> 1500.00)
    const currentMonth = response.body.expenses[5]
    expect(currentMonth).toHaveProperty('date')
    expect(currentMonth.amount).toBe(1500)
  })
})
