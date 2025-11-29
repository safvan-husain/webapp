# Testing Documentation

## ✅ Test Suite Complete

All authentication tests are passing: **22/22 tests**

### Test Coverage

#### Unit Tests (14 tests)

**Password Utils** (`lib/utils/__tests__/password.test.ts`)
- ✅ Hash password correctly
- ✅ Generate different hashes for same password
- ✅ Verify correct password
- ✅ Reject incorrect password

**JWT Utils** (`lib/utils/__tests__/jwt.test.ts`)
- ✅ Generate valid JWT token
- ✅ Verify and decode valid token
- ✅ Throw error for invalid token

**Auth Service** (`lib/services/__tests__/auth.service.test.ts`)
- ✅ Create new user with hashed password
- ✅ Throw error for duplicate email
- ✅ Create users with different user types (COMPANY/SEEKER)
- ✅ Login with valid credentials
- ✅ Throw error for invalid email
- ✅ Throw error for invalid password
- ✅ Throw error for inactive user

#### Integration Tests (8 tests)

**Auth Actions** (`__tests__/integration/auth.actions.test.ts`)
- ✅ Register new user successfully
- ✅ Return validation errors for invalid input
- ✅ Return error for duplicate email
- ✅ Create COMPANY user type
- ✅ Login with valid credentials
- ✅ Return validation errors for invalid login input
- ✅ Return error for invalid credentials
- ✅ Return error for non-existent user

### Test Commands

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Configuration

**Framework:** Vitest
**Environment:** jsdom (for React components)
**Database:** MongoDB Atlas with separate test database (`jobs_test`)

**Why not MongoDB Memory Server?**
While MongoDB Memory Server is great for many use cases, Prisma with MongoDB requires collections to be created via `prisma db push`, which adds complexity. Using a separate test database on Atlas is simpler and more reliable for this setup.

**Important:** Tests use a separate test database to avoid interfering with development data. The test database is automatically cleaned before each test.

### Test Structure

```
__tests__/
  integration/
    auth.actions.test.ts       # Server Actions integration tests

lib/
  services/
    __tests__/
      auth.service.test.ts     # Service layer unit tests
  utils/
    __tests__/
      password.test.ts         # Password utility tests
      jwt.test.ts              # JWT utility tests

vitest.config.ts               # Vitest configuration
vitest.setup.ts                # Test setup and cleanup
```

### Test Features

1. **Separate Test Database**
   - Uses `jobs_test` database (separate from development)
   - Configured via `.env.test` file
   - Automatic cleanup before each test (deletes all users)
   - Ensures test isolation and no data conflicts

2. **Database Cleanup**
   - Automatic cleanup before each test
   - Removes all users from test database
   - Ensures test isolation

3. **Mocked Next.js Functions**
   - `redirect()` - Mocked to throw error with redirect URL
   - `revalidatePath()` - Mocked to prevent cache operations
   - `cookies()` - Mocked to prevent cookie operations

4. **Real Database Testing**
   - Tests run against actual MongoDB Atlas (test database)
   - Verifies Prisma operations work correctly
   - Tests password hashing and JWT generation

### Test Database Setup

The tests use a separate database to avoid conflicts:

**Development Database:** `jobs`
**Test Database:** `jobs_test`

Configuration in `.env.test`:
```env
DATABASE_URL="mongodb+srv://...mongodb.net/jobs_test?..."
JWT_SECRET="test-jwt-secret-for-testing-only"
NODE_ENV="test"
```

**Benefits:**
- ✅ No interference with development data
- ✅ Safe to run tests anytime
- ✅ Automatic cleanup between tests
- ✅ Real database operations tested

### Test Results

```
Test Files  4 passed (4)
Tests       22 passed (22)
Duration    ~12s
```

### What's Tested

✅ User registration flow
✅ User login flow
✅ Password hashing (bcrypt)
✅ JWT token generation and verification
✅ Input validation (Zod schemas)
✅ Error handling (AppError)
✅ Database operations (Prisma)
✅ Duplicate email prevention
✅ User type support (COMPANY/SEEKER)
✅ Inactive user handling
✅ Invalid credentials handling

### What's NOT Tested (Future Work)

- ❌ Frontend component tests
- ❌ E2E browser tests
- ❌ Cookie handling in real browser
- ❌ Session management
- ❌ Rate limiting
- ❌ Password reset flow (not implemented yet)

### Running Tests in CI/CD

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm run test:run
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

### Debugging Tests

```bash
# Run specific test file
npx vitest lib/services/__tests__/auth.service.test.ts

# Run tests in watch mode
npm test

# Run with verbose output
npx vitest --reporter=verbose
```

### Test Best Practices

1. **Isolation**: Each test cleans up after itself
2. **Real Data**: Tests use actual database operations
3. **Comprehensive**: Cover happy paths and error cases
4. **Fast**: Complete suite runs in ~12 seconds
5. **Maintainable**: Clear test descriptions and structure

---

**Status:** ✅ All tests passing
**Coverage:** Core authentication functionality fully tested
**Next Steps:** Add frontend component tests and E2E tests
