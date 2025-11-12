import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'

import { PrismaClient, TransactionStatus, Type } from '../src/generated'

const categories = [
  {
    name: 'Housing',
    slug: 'housing',
    color: 'oklch(70.4% 0.14 182.53)',
    type: Type.EXPENSE,
  },
  {
    name: 'Utilities (water, electricity, internet)',
    slug: 'utilities-water-electricity-internet',
    color: 'oklch(68.5% 0.19 237.32)',
    type: Type.EXPENSE,
  },
  {
    name: 'Transportation',
    slug: 'transportation',
    color: 'oklch(76.9% 0.21 37.60)',
    type: Type.EXPENSE,
  },
  {
    name: 'Food',
    slug: 'food',
    color: 'oklch(72.3% 0.19 149.57)',
    type: Type.EXPENSE,
  },
  {
    name: 'Health',
    slug: 'health',
    color: 'oklch(64.5% 0.25 16.43)',
    type: Type.EXPENSE,
  },
  {
    name: 'Education',
    slug: 'education',
    color: 'oklch(55.4% 0.25 267.41)',
    type: Type.EXPENSE,
  },
  {
    name: 'Leisure and Entertainment',
    slug: 'leisure-and-entertainment',
    color: 'oklch(58.5% 0.23 272.17)',
    type: Type.EXPENSE,
  },
  {
    name: 'Subscriptions and Services',
    slug: 'subscriptions-and-services',
    color: 'oklch(71.5% 0.18 250.39)',
    type: Type.EXPENSE,
  },
  {
    name: 'General Shopping',
    slug: 'general-shopping',
    color: 'oklch(79.5% 0.18 86.04)',
    type: Type.EXPENSE,
  },
  {
    name: 'Debts and Loans',
    slug: 'debts-and-loans',
    color: 'oklch(76.8% 0.23 130.85)',
    type: Type.EXPENSE,
  },
  {
    name: 'Investments',
    slug: 'investments',
    color: 'oklch(60.6% 0.25 292.17)',
    type: Type.EXPENSE,
  },
  {
    name: 'Others',
    slug: 'others',
    color: 'oklch(55.2% 0.01 285.94)',
    type: Type.EXPENSE,
  },

  {
    name: 'Salary',
    slug: 'salary',
    color: 'oklch(55.5% 0.01 58.07)',
    type: Type.REVENUE,
  },
  {
    name: 'Freelance / Services',
    slug: 'freelance-services',
    color: 'oklch(65.6% 0.24 354.30)',
    type: Type.REVENUE,
  },
  {
    name: 'Own Business',
    slug: 'own-business',
    color: 'oklch(62.7% 0.26 302.93)',
    type: Type.REVENUE,
  },
  {
    name: 'Investments',
    slug: 'investments',
    color: 'oklch(72.3% 0.19 149.57)',
    type: Type.REVENUE,
  },
  {
    name: 'Rentals',
    slug: 'rentals',
    color: 'oklch(64.5% 0.25 16.43)',
    type: Type.REVENUE,
  },
  {
    name: 'Refunds',
    slug: 'refunds',
    color: 'oklch(68.5% 0.19 237.32)',
    type: Type.REVENUE,
  },
  {
    name: 'Gifts / Donations received',
    slug: 'gifts-donations-received',
    color: 'oklch(76.8% 0.23 130.85)',
    type: Type.REVENUE,
  },
  {
    name: 'Others',
    slug: 'others',
    color: 'oklch(55.1% 0.02 264.36)',
    type: Type.REVENUE,
  },
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
      createdAt: faker.date.recent({
        days: 180,
        refDate: dayjs().toDate(),
      }),
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
    data: Array.from({ length: 80 }, (_, i) => {
      const type = faker.helpers.arrayElement([Type.EXPENSE, Type.REVENUE])
      const filteredCategories = createdCategories.filter(
        (category) => category.type === type,
      )

      const date = faker.date.recent({
        days: 180,
        refDate: dayjs().toDate(),
      })
      const createdAt = dayjs(date).toDate()

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
