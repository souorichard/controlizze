import { hash } from 'bcryptjs'
import { createSlug } from '../utils/create-slug.ts'
import { db } from './index.ts'
import { schema } from './schema/index.ts'

async function cleanDatabase() {
  console.log('🧹 Cleaning existing data...')

  try {
    // Delete in reverse order of creation (respecting foreign keys)
    await db.delete(schema.transactions)
    await db.delete(schema.recurrences)
    await db.delete(schema.members)
    await db.delete(schema.categories)
    await db.delete(schema.organizations)
    await db.delete(schema.authAccounts)
    await db.delete(schema.tokens)
    await db.delete(schema.users)

    console.log('✅ Database cleaned successfully')
  } catch (error) {
    console.error('❌ Error cleaning database:', error)
    throw error
  }
}

async function seed() {
  console.log('🌱 Starting database seed...')

  await cleanDatabase()

  try {
    // 1. Create test users
    console.log('📝 Creating test users...')

    const passwordHash = await hash('hashed_password_123', 8)

    const user1 = await db
      .insert(schema.users)
      .values({
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash,
        avatarUrl: 'https://api.example.com/avatars/john.jpg',
      })
      .returning()
      .then((result) => result[0])

    const user2 = await db
      .insert(schema.users)
      .values({
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash,
        avatarUrl: 'https://api.example.com/avatars/jane.jpg',
      })
      .returning()
      .then((result) => result[0])

    const user3 = await db
      .insert(schema.users)
      .values({
        name: 'Bob Johnson',
        email: 'bob@example.com',
        passwordHash,
      })
      .returning()
      .then((result) => result[0])

    console.log(`✅ Created ${3} users`)

    // 2. Create test organizations
    console.log('🏢 Creating test organizations...')
    const orgSlug1 = createSlug('Acme Corp')
    const org1 = await db
      .insert(schema.organizations)
      .values({
        name: 'Acme Corp',
        slug: orgSlug1,
        ownerId: user1.id,
        avatarUrl: 'https://api.example.com/orgs/acme.jpg',
      })
      .returning()
      .then((result) => result[0])

    const orgSlug2 = createSlug('Tech Startup')
    const org2 = await db
      .insert(schema.organizations)
      .values({
        name: 'Tech Startup',
        slug: orgSlug2,
        ownerId: user2.id,
      })
      .returning()
      .then((result) => result[0])

    console.log(`✅ Created ${2} organizations`)

    // 3. Create test members
    console.log('👥 Creating test members...')
    await db.insert(schema.members).values([
      { userId: user1.id, orgId: org1.id, role: 'OWNER' },
      { userId: user2.id, orgId: org1.id, role: 'ADMIN' },
      { userId: user3.id, orgId: org1.id, role: 'MEMBER' },
      { userId: user2.id, orgId: org2.id, role: 'OWNER' },
      { userId: user1.id, orgId: org2.id, role: 'MEMBER' },
    ])

    console.log(`✅ Created ${5} members`)

    // 4. Create test categories
    console.log('📂 Creating test categories...')
    const categoryExpenseFood = await db
      .insert(schema.categories)
      .values({
        name: 'Food',
        color: '#FF6B6B',
        type: 'EXPENSE',
        orgId: org1.id,
        ownerId: user1.id,
      })
      .returning()
      .then((result) => result[0])

    const categoryExpenseTransport = await db
      .insert(schema.categories)
      .values({
        name: 'Transportation',
        color: '#4ECDC4',
        type: 'EXPENSE',
        orgId: org1.id,
        ownerId: user1.id,
      })
      .returning()
      .then((result) => result[0])

    const categoryExpenseUtilities = await db
      .insert(schema.categories)
      .values({
        name: 'Utilities',
        color: '#45B7D1',
        type: 'EXPENSE',
        orgId: org1.id,
        ownerId: user1.id,
      })
      .returning()
      .then((result) => result[0])

    const categoryIncomeSalary = await db
      .insert(schema.categories)
      .values({
        name: 'Salary',
        color: '#96CEB4',
        type: 'INCOME',
        orgId: org1.id,
        ownerId: user1.id,
      })
      .returning()
      .then((result) => result[0])

    const categoryIncomeBonuses = await db
      .insert(schema.categories)
      .values({
        name: 'Bonuses',
        color: '#FFEAA7',
        type: 'INCOME',
        orgId: org1.id,
        ownerId: user1.id,
      })
      .returning()
      .then((result) => result[0])

    console.log(`✅ Created ${5} categories`)

    // 5. Create test transactions
    console.log('💳 Creating test transactions...')

    const transactions = []
    const startSeedDate = new Date()
    startSeedDate.setFullYear(startSeedDate.getFullYear() - 1)

    for (let i = 0; i < 36; i++) {
      const month = new Date(startSeedDate)
      month.setMonth(month.getMonth() + i)

      // Salary - every month
      transactions.push({
        title: 'Monthly Salary',
        type: 'INCOME' as const,
        categoryId: categoryIncomeSalary.id,
        amount: 500000,
        status: 'PAID' as const,
        transactionDate: new Date(month.getFullYear(), month.getMonth(), 5),
        ownerId: user1.id,
        orgId: org1.id,
      })

      // Bonus - every 3 months
      if (i % 3 === 0) {
        transactions.push({
          title: 'Project Bonus',
          type: 'INCOME' as const,
          categoryId: categoryIncomeBonuses.id,
          amount: 50000,
          status: 'PAID' as const,
          transactionDate: new Date(month.getFullYear(), month.getMonth(), 10),
          ownerId: user1.id,
          orgId: org1.id,
        })
      }

      // Food expense - every month
      transactions.push({
        title: 'Lunch at Restaurant',
        type: 'EXPENSE' as const,
        categoryId: categoryExpenseFood.id,
        amount: Math.floor(Math.random() * 3000) + 3000,
        status: 'PAID' as const,
        transactionDate: new Date(month.getFullYear(), month.getMonth(), 12),
        ownerId: user1.id,
        orgId: org1.id,
      })

      // Transport - every month
      transactions.push({
        title: 'Gas for car',
        type: 'EXPENSE' as const,
        categoryId: categoryExpenseTransport.id,
        amount: Math.floor(Math.random() * 2000) + 5000,
        status: 'PAID' as const,
        transactionDate: new Date(month.getFullYear(), month.getMonth(), 15),
        ownerId: user2.id,
        orgId: org1.id,
      })

      // Utilities - every month
      transactions.push({
        title: 'Electric Bill',
        type: 'EXPENSE' as const,
        categoryId: categoryExpenseUtilities.id,
        amount: Math.floor(Math.random() * 5000) + 10000,
        status: i === 23 ? ('PENDING' as const) : ('PAID' as const),
        transactionDate: new Date(month.getFullYear(), month.getMonth(), 20),
        ownerId: user1.id,
        orgId: org1.id,
      })
    }

    await db.insert(schema.transactions).values(transactions)

    console.log(`✅ Created ${transactions.length} transactions`)

    // 6. Create test recurrences
    console.log('🔄 Creating test recurrences...')
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now

    // Calculate next execution dates
    const monthlyNextExecution = new Date(startDate)
    monthlyNextExecution.setMonth(monthlyNextExecution.getMonth() + 1)

    const weeklyNextExecution = new Date(startDate)
    weeklyNextExecution.setDate(weeklyNextExecution.getDate() + 7)

    const dailyNextExecution = new Date(startDate)
    dailyNextExecution.setDate(dailyNextExecution.getDate() + 1)

    await db.insert(schema.recurrences).values([
      {
        title: 'Monthly Rent',
        description: 'House rent payment',
        type: 'EXPENSE',
        categoryId: categoryExpenseUtilities.id,
        amount: 150000, // $1500.00
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        interval: 1,
        startDate,
        endDate,
        nextExecutionDate: monthlyNextExecution,
        lastGeneratedAt: null,
        ownerId: user1.id,
        orgId: org1.id,
      },
      {
        title: 'Weekly Groceries',
        description: 'Grocery shopping',
        type: 'EXPENSE',
        categoryId: categoryExpenseFood.id,
        amount: 12000, // $120.00
        status: 'ACTIVE',
        frequency: 'WEEKLY',
        interval: 1,
        startDate,
        endDate,
        nextExecutionDate: weeklyNextExecution,
        lastGeneratedAt: null,
        ownerId: user1.id,
        orgId: org1.id,
      },
      {
        title: 'Daily Coffee',
        description: 'Morning coffee',
        type: 'EXPENSE',
        categoryId: categoryExpenseFood.id,
        amount: 500, // $5.00
        status: 'ACTIVE',
        frequency: 'DAILY',
        interval: 1,
        startDate,
        endDate,
        nextExecutionDate: dailyNextExecution,
        lastGeneratedAt: null,
        ownerId: user2.id,
        orgId: org1.id,
      },
      {
        title: 'Monthly Subscription',
        description: 'Gym membership',
        type: 'EXPENSE',
        categoryId: categoryExpenseUtilities.id,
        amount: 5000, // $50.00
        status: 'PAUSED',
        frequency: 'MONTHLY',
        interval: 1,
        startDate,
        nextExecutionDate: monthlyNextExecution,
        lastGeneratedAt: null,
        ownerId: user2.id,
        orgId: org1.id,
      },
    ])

    console.log(`✅ Created ${4} recurrences`)

    console.log('✨ Database seed paid successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

seed()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$client.end()
  })
