import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'

import { PrismaClient } from '../src/generated'

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

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      transacions: {
        createMany: {
          data: [
            {
              description: faker.lorem.words(5),
              type: 'EXPENSE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'PENDING',
              ownerId: user.id,
            },
            {
              description: faker.lorem.words(5),
              type: 'REVENUE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'COMPLETED',
              ownerId: user3.id,
            },
            {
              description: faker.lorem.words(5),
              type: 'EXPENSE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'CANCELLED',
              ownerId: user2.id,
            },
          ],
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
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user2.id,
      transacions: {
        createMany: {
          data: [
            {
              description: faker.lorem.words(5),
              type: 'EXPENSE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'PENDING',
              ownerId: user.id,
            },
            {
              description: faker.lorem.words(5),
              type: 'REVENUE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'COMPLETED',
              ownerId: user3.id,
            },
            {
              description: faker.lorem.words(5),
              type: 'EXPENSE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'CANCELLED',
              ownerId: user2.id,
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user2.id,
              role: 'ADMIN',
            },
            {
              userId: user.id,
              role: 'MEMBER',
            },
            {
              userId: user3.id,
              role: 'MEMBER',
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user3.id,
      transacions: {
        createMany: {
          data: [
            {
              description: faker.lorem.words(5),
              type: 'EXPENSE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'PENDING',
              ownerId: user2.id,
            },
            {
              description: faker.lorem.words(5),
              type: 'REVENUE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'COMPLETED',
              ownerId: user3.id,
            },
            {
              description: faker.lorem.words(5),
              type: 'EXPENSE',
              category: faker.lorem.word(),
              amount: faker.number.int({ max: 1000000 }),
              status: 'CANCELLED',
              ownerId: user2.id,
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user3.id,
              role: 'ADMIN',
            },
            {
              userId: user2.id,
              role: 'MEMBER',
            },
            {
              userId: user.id,
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
