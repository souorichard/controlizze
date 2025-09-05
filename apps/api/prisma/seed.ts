import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'

import { PrismaClient } from '../src/generated'

const categories = {
  expenses: [
    { name: 'Housing' },
    { name: 'Utilities (water, electricity, internet)' },
    { name: 'Transportation' },
    { name: 'Food' },
    { name: 'Health' },
    { name: 'Education' },
    { name: 'Leisure and Entertainment' },
    { name: 'Subscriptions and Services' },
    { name: 'General Shopping' },
    { name: 'Debts and Loans' },
    { name: 'Investments' },
    { name: 'Others' },
  ],
  revenues: [
    { name: 'Salary' },
    { name: 'Freelance / Services' },
    { name: 'Own Business' },
    { name: 'Investments' },
    { name: 'Rentals' },
    { name: 'Refunds' },
    { name: 'Gifts / Donations received' },
    { name: 'Others' },
  ],
}

const prisma = new PrismaClient()

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const hashPassword = await hash('123456', 1)

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      avatarUrl: faker.image.avatar(),
      hashPassword,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jenny Doe',
      email: 'jenny@acme.com',
      avatarUrl: faker.image.avatar(),
      hashPassword,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'Bill Doe',
      email: 'bill@acme.com',
      avatarUrl: faker.image.avatar(),
      hashPassword,
    },
  })

  const owners = [user.id, user2.id, user3.id]

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      transactions: {
        createMany: {
          data: Array.from({ length: 40 }, (_, i) => {
            const type = faker.helpers.arrayElement(['EXPENSE', 'REVENUE'])

            const category =
              type === 'EXPENSE'
                ? faker.helpers.arrayElement(categories.expenses).name
                : faker.helpers.arrayElement(categories.revenues).name

            const daysAgo = faker.number.int({ min: 0, max: 29 })
            const createdAt = dayjs().subtract(daysAgo, 'day').toDate()

            return {
              description: faker.lorem.words(3),
              type,
              category,
              amount: faker.number.int({ min: 1000, max: 100000 }),
              status: faker.helpers.arrayElement([
                'PENDING',
                'COMPLETED',
                'CANCELLED',
              ]),
              createdAt,
              ownerId: owners[i % owners.length],
            }
          }),
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: 'ADMIN',
            },
            {
              userId: user2.id,
              role: 'MEMBER',
            },
            {
              userId: user3.id,
              role: 'BILLING',
            },
          ],
        },
      },
    },
  })
}

seed().then(() => {
  console.log('Database seeded!')
})
