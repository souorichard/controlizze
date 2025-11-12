import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import dayjs from 'dayjs'

import { PrismaClient, TransactionStatus, Type } from '../src/generated'

const categories = [
  {
    name: 'Housing',
    slug: 'housing',
    color: '#06b6d4', // cyan
    type: Type.EXPENSE,
  },
  {
    name: 'Utilities (water, electricity, internet)',
    slug: 'utilities-water-electricity-internet',
    color: '#0ea5e9', // sky
    type: Type.EXPENSE,
  },
  {
    name: 'Transportation',
    slug: 'transportation',
    color: '#f59e0b', // amber
    type: Type.EXPENSE,
  },
  {
    name: 'Food',
    slug: 'food',
    color: '#22c55e', // green
    type: Type.EXPENSE,
  },
  {
    name: 'Health',
    slug: 'health',
    color: '#f43f5e', // rose
    type: Type.EXPENSE,
  },
  {
    name: 'Education',
    slug: 'education',
    color: '#6366f1', // indigo
    type: Type.EXPENSE,
  },
  {
    name: 'Leisure and Entertainment',
    slug: 'leisure-and-entertainment',
    color: '#8b5cf6', // violet
    type: Type.EXPENSE,
  },
  {
    name: 'Subscriptions and Services',
    slug: 'subscriptions-and-services',
    color: '#3b82f6', // blue
    type: Type.EXPENSE,
  },
  {
    name: 'General Shopping',
    slug: 'general-shopping',
    color: '#eab308', // yellow
    type: Type.EXPENSE,
  },
  {
    name: 'Debts and Loans',
    slug: 'debts-and-loans',
    color: '#10b981', // emerald
    type: Type.EXPENSE,
  },
  {
    name: 'Investments',
    slug: 'investments',
    color: '#a855f7', // purple
    type: Type.EXPENSE,
  },
  {
    name: 'Others',
    slug: 'others',
    color: '#737373', // neutral
    type: Type.EXPENSE,
  },
  {
    name: 'Salary',
    slug: 'salary',
    color: '#84cc16', // lime
    type: Type.REVENUE,
  },
  {
    name: 'Freelance / Services',
    slug: 'freelance-services',
    color: '#f97316', // orange
    type: Type.REVENUE,
  },
  {
    name: 'Own Business',
    slug: 'own-business',
    color: '#d946ef', // fuchsia
    type: Type.REVENUE,
  },
  {
    name: 'Investments',
    slug: 'investments',
    color: '#22c55e', // green
    type: Type.REVENUE,
  },
  {
    name: 'Rentals',
    slug: 'rentals',
    color: '#ef4444', // red
    type: Type.REVENUE,
  },
  {
    name: 'Refunds',
    slug: 'refunds',
    color: '#3b82f6', // blue
    type: Type.REVENUE,
  },
  {
    name: 'Gifts / Donations received',
    slug: 'gifts-donations-received',
    color: '#10b981', // emerald
    type: Type.REVENUE,
  },
  {
    name: 'Others',
    slug: 'others',
    color: '#71717a', // zinc
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
