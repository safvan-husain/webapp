import '@testing-library/jest-dom'
import { beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { config } from 'dotenv'
import { prisma } from './lib/db/prisma'

// Mock server-only to allow testing server-side code
vi.mock('server-only', () => ({}))

// Load test environment variables (override existing .env)
config({ path: '.env.test', override: true })

// Verify we're using test database
beforeAll(() => {
  const dbUrl = process.env.DATABASE_URL || ''
  if (!dbUrl.includes('_test') && !dbUrl.includes('test')) {
    console.warn('⚠️  Warning: Not using a test database! Current DB:', dbUrl)
  } else {
    console.log('✅ Using test database:', dbUrl.split('@')[1]?.split('?')[0])
  }
})

// Clean up database before each test
beforeEach(async () => {
  await prisma.user.deleteMany({})
})

// Disconnect after all tests
afterAll(async () => {
  await prisma.$disconnect()
})
