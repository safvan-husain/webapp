---
inclusion: fileMatch
fileMatchPattern: '**/__tests__/**/*|**/*.test.ts|**/*.test.tsx|vitest.config.ts'
---

# Testing Strategy

This document defines testing patterns and best practices.

---

## 🧪 Testing Approach

### **Integration Tests**

Integration tests directly test Server Actions and services.

**Location:** `__tests__/integration/`

**Approach:**
- Import Server Actions directly from `lib/actions`
- Create mock `FormData` objects
- Call actions and assert on results
- Use Prisma with test database or in-memory SQLite

**Example:**

```ts
import { registerAction } from '@/lib/actions/auth.actions'
import { prisma } from '@/lib/db/prisma'

beforeEach(async () => {
  await prisma.user.deleteMany() // Clean database
})

it('should register a new user', async () => {
  const formData = new FormData()
  formData.append('email', 'test@test.com')
  formData.append('password', 'password123')
  formData.append('fullName', 'Test User')
  formData.append('userType', 'seeker')

  const result = await registerAction(formData)

  expect(result.success).toBe(true)
  expect(result.user.email).toBe('test@test.com')
  
  const user = await prisma.user.findUnique({
    where: { email: 'test@test.com' }
  })
  expect(user).toBeDefined()
})
```

---

### **Unit Tests**

Unit tests for services, controllers, and utilities.

**Location:** `lib/**/*.test.ts`

**Guidelines:**
- Test business logic in services
- Test validation in controllers
- Mock external dependencies
- Keep tests focused and isolated

**Example:**

```ts
import { registerUser } from '@/lib/services/auth.service'
import { prisma } from '@/lib/db/prisma'
import { AppError } from '@/lib/errors/app-error'

describe('Auth Service', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should hash password when creating user', async () => {
    const result = await registerUser({
      email: 'test@test.com',
      password: 'password123',
      fullName: 'Test User',
      userType: 'SEEKER',
    })

    const user = await prisma.user.findUnique({
      where: { id: result.user.id }
    })

    expect(user?.passwordHash).not.toBe('password123')
    expect(user?.passwordHash).toMatch(/^\$2[aby]\$/)
  })

  it('should throw error for duplicate email', async () => {
    await registerUser({
      email: 'test@test.com',
      password: 'password123',
      fullName: 'Test User',
      userType: 'SEEKER',
    })

    await expect(
      registerUser({
        email: 'test@test.com',
        password: 'password456',
        fullName: 'Another User',
        userType: 'COMPANY',
      })
    ).rejects.toThrow(AppError)
  })
})
```

---

## 📋 Test Commands

```bash
npm test                  # Run all tests
npm run test:unit         # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

---

## ✅ Testing Principles

* Pure functions where possible
* Minimal side effects
* Separated concerns
* **No tests required by default** (add when needed)
* Clean database before each test
* Use real database operations (not mocks)
* Test happy paths and error cases
