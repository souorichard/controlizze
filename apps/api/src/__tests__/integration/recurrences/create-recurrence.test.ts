// src/__tests__/integration/recurrences/create-recurrence.test.ts
import dayjs from 'dayjs'
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeMember,
  makeOrganization,
  makeUser,
} from '../../helpers/factories.ts'

describe('POST /orgs/:slug/recurrences', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to create a recurrence', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, {
      name: 'Salary',
      type: 'INCOME',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/recurrences`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Monthly Salary',
        type: 'INCOME',
        categoryId: category.id,
        amount: 5000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: dayjs().subtract(1, 'month').toISOString(),
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('recurrenceId')
  })

  it('should not be able to create a recurrence with mismatched category type', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, {
      name: 'Food',
      type: 'EXPENSE',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/recurrences`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Monthly Salary',
        type: 'INCOME',
        categoryId: category.id,
        amount: 5000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: dayjs().toISOString(),
      })

    expect(response.status).toBe(400)
  })

  it('should not be able to create a recurrence with endDate before startDate', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, {
      name: 'Salary',
      type: 'INCOME',
    })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/recurrences`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Monthly Salary',
        type: 'INCOME',
        categoryId: category.id,
        amount: 5000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: dayjs().toISOString(),
        endDate: dayjs().subtract(1, 'month').toISOString(),
      })

    expect(response.status).toBe(400)
  })

  it('should be able to create a recurrence as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const category = await makeCategory(owner.id, org.id, {
      name: 'Salary',
      type: 'INCOME',
    })

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/recurrences`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Monthly Salary',
        type: 'INCOME',
        categoryId: category.id,
        amount: 5000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: dayjs().toISOString(),
      })

    expect(response.status).toBe(201)
  })

  it('should not be able to create a recurrence without authentication', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)

    const response = await supertest(app.server)
      .post(`/orgs/${org.slug}/recurrences`)
      .send({
        title: 'Monthly Salary',
        type: 'INCOME',
        categoryId: '00000000-0000-0000-0000-000000000000',
        amount: 5000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: dayjs().toISOString(),
      })

    expect(response.status).toBe(401)
  })
})
