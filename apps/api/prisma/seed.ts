import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'

import { PrismaClient, TransactionStatus, Type } from '../src/generated'

const categories = [
  { name: 'Housing', color: '#ef4444', type: Type.EXPENSE },
  {
    name: 'Utilities (water, electricity, internet)',
    color: '#f97316',
    type: Type.EXPENSE,
  },
  { name: 'Transportation', color: '#eab308', type: Type.EXPENSE },
  { name: 'Food', color: '#84cc16', type: Type.EXPENSE },
  { name: 'Health', color: '#10b981', type: Type.EXPENSE },
  { name: 'Education', color: '#06b6d4', type: Type.EXPENSE },
  { name: 'Leisure and Entertainment', color: '#3b82f6', type: Type.EXPENSE },
  { name: 'Subscriptions and Services', color: '#6366f1', type: Type.EXPENSE },
  { name: 'General Shopping', color: '#8b5cf6', type: Type.EXPENSE },
  { name: 'Debts and Loans', color: '#a855f7', type: Type.EXPENSE },
  { name: 'Investments', color: '#ec4899', type: Type.EXPENSE },
  { name: 'Others', color: '#9ca3af', type: Type.EXPENSE },

  { name: 'Salary', color: '#22c55e', type: Type.REVENUE },
  { name: 'Freelance / Services', color: '#0ea5e9', type: Type.REVENUE },
  { name: 'Own Business', color: '#8b5cf6', type: Type.REVENUE },
  { name: 'Investments', color: '#f59e0b', type: Type.REVENUE },
  { name: 'Rentals', color: '#14b8a6', type: Type.REVENUE },
  { name: 'Refunds', color: '#3b82f6', type: Type.REVENUE },
  { name: 'Gifts / Donations received', color: '#ec4899', type: Type.REVENUE },
  { name: 'Others', color: '#9ca3af', type: Type.REVENUE },
]

const prisma = new PrismaClient()

async function seed() {
  await prisma.transaction.deleteMany()
  await prisma.category.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const hashPassword = await hash('123456', 1)

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@acme.com',
      avatarUrl: faker.image.urlPicsumPhotos(),
      hashPassword,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jenny Doe',
      email: 'jenny@acme.com',
      avatarUrl: faker.image.urlPicsumPhotos(),
      hashPassword,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      name: 'Bill Doe',
      email: 'bill@acme.com',
      avatarUrl: faker.image.urlPicsumPhotos(),
      hashPassword,
    },
  })

  const owners = [user.id, user2.id, user3.id]

  const organization = await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
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

  await prisma.category.createMany({
    data: categories.map((category) => ({
      ...category,
      organizationId: organization.id,
      ownerId: user.id,
    })),
  })

  const createdCategories = await prisma.category.findMany({
    where: {
      organizationId: organization.id,
    },
  })

  await prisma.transaction.createMany({
    data: Array.from({ length: 40 }, (_, i) => {
      const type = faker.helpers.arrayElement([Type.EXPENSE, Type.REVENUE])
      const filteredCategories = createdCategories.filter(
        (category) => category.type === type,
      )

      const daysAgo = faker.number.int({ min: 0, max: 29 })
      const createdAt = dayjs().subtract(daysAgo, 'day').toDate()

      return {
        description: faker.lorem.words(3),
        type,
        categoryId: faker.helpers.arrayElement(filteredCategories).id,
        amount: faker.number.int({ min: 1000, max: 100000 }),
        status: faker.helpers.arrayElement([
          TransactionStatus.PENDING,
          TransactionStatus.COMPLETED,
          TransactionStatus.CANCELLED,
        ]),
        createdAt,
        ownerId: owners[i % owners.length],
        organizationId: organization.id,
      }
    }),
  })
}

seed()
  .then(() => {
    console.log('Database seeded!')
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
