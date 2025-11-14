import { PrismaClient } from '../generated'

export const prisma = new PrismaClient({
  // log: ['query'],
})
