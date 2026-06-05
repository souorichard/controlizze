// src/__tests__/integration/recurrences/update-recurrence.test.ts
import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTestApp } from '../../helpers/app.ts'
import { authenticate } from '../../helpers/auth.ts'
import { cleanDatabase } from '../../helpers/db.ts'
import {
  makeCategory,
  makeMember,
  makeOrganization,
  makeRecurrence,
  makeUser,
} from '../../helpers/factories.ts'

describe('PUT /orgs/:slug/recurrences/:recurrenceId', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeEach(async () => {
    app = await createTestApp()
    await cleanDatabase()
  })

  afterEach(async () => {
    await app.close()
  })

  it('should be able to update a recurrence as OWNER', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, { type: 'INCOME' })
    const recurrence = await makeRecurrence(user.id, org.id, category.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/recurrences/${recurrence.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Salary',
        type: 'INCOME',
        categoryId: category.id,
        amount: 6000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: new Date().toISOString(),
      })

    expect(response.status).toBe(204)
  })

  it('should be able to update own recurrence as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const category = await makeCategory(owner.id, org.id, { type: 'INCOME' })

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const recurrence = await makeRecurrence(member.id, org.id, category.id)

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/recurrences/${recurrence.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Salary',
        type: 'INCOME',
        categoryId: category.id,
        amount: 6000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: new Date().toISOString(),
      })

    expect(response.status).toBe(204)
  })

  it('should not be able to update another member recurrence as MEMBER', async () => {
    const owner = await makeUser()
    const org = await makeOrganization(owner.id)
    const category = await makeCategory(owner.id, org.id, { type: 'INCOME' })

    const member = await makeUser({ email: 'member@example.com' })
    await makeMember(member.id, org.id, 'MEMBER')

    const recurrence = await makeRecurrence(owner.id, org.id, category.id)

    const token = await authenticate(app, 'member@example.com')

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/recurrences/${recurrence.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Salary',
        type: 'INCOME',
        categoryId: category.id,
        amount: 6000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: new Date().toISOString(),
      })

    expect(response.status).toBe(401)
  })

  it('should not be able to update with mismatched category type', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const incomeCategory = await makeCategory(user.id, org.id, {
      type: 'INCOME',
    })
    const expenseCategory = await makeCategory(user.id, org.id, {
      name: 'Rent',
      type: 'EXPENSE',
    })
    const recurrence = await makeRecurrence(user.id, org.id, incomeCategory.id)

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/recurrences/${recurrence.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated',
        type: 'INCOME',
        categoryId: expenseCategory.id,
        amount: 6000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: new Date().toISOString(),
      })

    expect(response.status).toBe(400)
  })

  it('should not be able to update a non existing recurrence', async () => {
    const user = await makeUser()
    const org = await makeOrganization(user.id)
    const category = await makeCategory(user.id, org.id, { type: 'INCOME' })

    const token = await authenticate(app)

    const response = await supertest(app.server)
      .put(`/orgs/${org.slug}/recurrences/00000000-0000-0000-0000-000000000000`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated',
        type: 'INCOME',
        categoryId: category.id,
        amount: 6000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: new Date().toISOString(),
      })

    expect(response.status).toBe(404)
  })

  it('should not be able to update a recurrence without authentication', async () => {
    const response = await supertest(app.server)
      .put('/orgs/any-slug/recurrences/00000000-0000-0000-0000-000000000000')
      .send({
        title: 'Updated',
        type: 'INCOME',
        categoryId: '00000000-0000-0000-0000-000000000000',
        amount: 6000,
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate: new Date().toISOString(),
      })

    expect(response.status).toBe(401)
  })
})
