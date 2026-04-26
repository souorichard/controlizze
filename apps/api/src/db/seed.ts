import { createSlug } from '../utils/create-slug.ts'
import { db } from './index.ts'
import { schema } from './schema/index.ts'

async function cleanDatabase() {
  console.log('🧹 Cleaning existing data...')

  try {
    // Delete in reverse order of creation (respecting foreign keys)
    await db.delete(schema.transactions)
    await db.delete(schema.recurringTransactions)
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
    const user1 = await db
      .insert(schema.users)
      .values({
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashed_password_123',
        avatarUrl: 'https://api.example.com/avatars/john.jpg',
      })
      .returning()
      .then((result) => result[0])

    const user2 = await db
      .insert(schema.users)
      .values({
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: 'hashed_password_456',
        avatarUrl: 'https://api.example.com/avatars/jane.jpg',
      })
      .returning()
      .then((result) => result[0])

    const user3 = await db
      .insert(schema.users)
      .values({
        name: 'Bob Johnson',
        email: 'bob@example.com',
        passwordHash: 'hashed_password_789',
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
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    await db.insert(schema.transactions).values([
      {
        title: 'Lunch at Restaurant',
        description: 'Team lunch',
        type: 'EXPENSE',
        categoryId: categoryExpenseFood.id,
        amount: 4500, // $45.00
        status: 'COMPLETED',
        transactionDate: oneWeekAgo,
        ownerId: user1.id,
        orgId: org1.id,
      },
      {
        title: 'Monthly Salary',
        description: 'Monthly salary payment',
        type: 'INCOME',
        categoryId: categoryIncomeSalary.id,
        amount: 500000, // $5000.00
        status: 'COMPLETED',
        transactionDate: twoWeeksAgo,
        ownerId: user1.id,
        orgId: org1.id,
      },
      {
        title: 'Gas for car',
        description: 'Weekly fuel',
        type: 'EXPENSE',
        categoryId: categoryExpenseTransport.id,
        amount: 6000, // $60.00
        status: 'COMPLETED',
        transactionDate: now,
        ownerId: user2.id,
        orgId: org1.id,
      },
      {
        title: 'Electric Bill',
        description: 'Monthly electricity payment',
        type: 'EXPENSE',
        categoryId: categoryExpenseUtilities.id,
        amount: 15000, // $150.00
        status: 'PENDING',
        transactionDate: now,
        ownerId: user1.id,
        orgId: org1.id,
      },
      {
        title: 'Project Bonus',
        description: 'Bonus for project completion',
        type: 'INCOME',
        categoryId: categoryIncomeBonuses.id,
        amount: 50000, // $500.00
        status: 'COMPLETED',
        transactionDate: oneWeekAgo,
        ownerId: user3.id,
        orgId: org1.id,
      },
    ])

    console.log(`✅ Created ${5} transactions`)

    // 6. Create test recurring transactions
    console.log('🔄 Creating test recurring transactions...')
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year from now

    // Calculate next execution dates
    const monthlyNextExecution = new Date(startDate)
    monthlyNextExecution.setMonth(monthlyNextExecution.getMonth() + 1)

    const weeklyNextExecution = new Date(startDate)
    weeklyNextExecution.setDate(weeklyNextExecution.getDate() + 7)

    const dailyNextExecution = new Date(startDate)
    dailyNextExecution.setDate(dailyNextExecution.getDate() + 1)

    await db.insert(schema.recurringTransactions).values([
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

    console.log(`✅ Created ${4} recurring transactions`)

    console.log('✨ Database seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

seed().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
