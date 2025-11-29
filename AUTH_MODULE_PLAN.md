# 🔐 Auth Module Implementation Plan

## 📋 Overview

Unified authentication system supporting both **Company** and **Seeker** user types with a single auth collection. No OTP verification required. Uses **Prisma** as ORM, **Server Actions** for mutations, and **Next.js 16 Cache Components** for optimal UI performance.

**Key Technologies:**
- Prisma ORM for database access
- Server Actions (no HTTP endpoints)
- Zod for validation
- Next.js 16 with Cache Components
- JWT tokens stored in HTTP-only cookies

---

## 🗄️ Database Schema (Prisma)

### **Prisma Schema** (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  fullName     String
  userType     UserType
  refObjectId  String?   // Reference to company/seeker profile (created later)
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([email])
  @@index([userType])
  @@index([refObjectId])
}

enum UserType {
  COMPANY
  SEEKER
}
```

**Key Features:**
- `email` is unique and indexed
- `userType` enum for type safety
- `refObjectId` nullable for future profile linking
- Automatic timestamps with `@default(now())` and `@updatedAt`

---

## 🏗️ Backend Architecture

### **Folder Structure**

```
lib/
  actions/
    auth.actions.ts          # Server Actions for mutations
  
  queries/
    auth.queries.ts          # Data fetching functions
  
  validations/
    auth.schema.ts           # Zod schemas for validation
  
  services/
    auth.service.ts          # Business logic
  
  db/
    prisma.ts                # Prisma client singleton
  
  errors/
    app-error.ts             # Custom error class
  
  utils/
    jwt.ts                   # JWT token utilities
    password.ts              # Password hashing utilities

app/
  (auth)/                    # Auth route group
    login/
      page.tsx               # Login page
    register/
      page.tsx               # Register page
    components/
      LoginForm.tsx          # Login form (Client Component)
      RegisterForm.tsx       # Register form (Client Component)

prisma/
  schema.prisma              # Database schema
  migrations/                # Database migrations
```

---

## 📝 Implementation Details

### **1. Prisma Client Setup (`lib/db/prisma.ts`)**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

### **2. Validation Schemas (`lib/validations/auth.schema.ts`)**

```typescript
import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  userType: z.enum(['COMPANY', 'SEEKER'], {
    errorMap: () => ({ message: 'User type must be either COMPANY or SEEKER' })
  }),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
```

---

### **3. Service Layer (`lib/services/auth.service.ts`)**

```typescript
import { prisma } from '@/lib/db/prisma'
import { AppError } from '@/lib/errors/app-error'
import { hashPassword, verifyPassword } from '@/lib/utils/password'
import { generateToken } from '@/lib/utils/jwt'
import type { RegisterInput, LoginInput } from '@/lib/validations/auth.schema'

export async function registerUser(input: RegisterInput) {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (existingUser) {
    throw new AppError(409, 'USER_ALREADY_EXISTS', 'Email already registered')
  }

  // Hash password
  const passwordHash = await hashPassword(input.password)

  // Create user
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      userType: input.userType,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      userType: true,
      refObjectId: true,
      createdAt: true,
    }
  })

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    userType: user.userType,
  })

  return { user, token }
}

export async function loginUser(input: LoginInput) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
  }

  // Verify password
  const isValid = await verifyPassword(input.password, user.passwordHash)
  if (!isValid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
  }

  // Check if active
  if (!user.isActive) {
    throw new AppError(403, 'ACCOUNT_SUSPENDED', 'Account has been suspended')
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    userType: user.userType,
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      refObjectId: user.refObjectId,
      createdAt: user.createdAt,
    },
    token,
  }
}
```

---

### **4. Query Functions (`lib/queries/auth.queries.ts`)**

```typescript
import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'

export const getUserById = cache(async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      userType: true,
      refObjectId: true,
      createdAt: true,
    }
  })
})

export const getUserByEmail = cache(async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      fullName: true,
      userType: true,
      refObjectId: true,
      createdAt: true,
    }
  })
})
```

---

### **5. Server Actions (`lib/actions/auth.actions.ts`)**

```typescript
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { RegisterSchema, LoginSchema } from '@/lib/validations/auth.schema'
import { registerUser, loginUser } from '@/lib/services/auth.service'
import { AppError } from '@/lib/errors/app-error'

export async function registerAction(formData: FormData) {
  const result = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    userType: formData.get('userType'),
  })

  if (!result.success) {
    return { 
      error: 'Validation failed', 
      fieldErrors: result.error.flatten().fieldErrors 
    }
  }

  try {
    const { user, token } = await registerUser(result.data)

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.details }
    }
    return { error: 'Registration failed. Please try again.' }
  }

  redirect('/dashboard')
}

export async function loginAction(formData: FormData) {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { 
      error: 'Validation failed', 
      fieldErrors: result.error.flatten().fieldErrors 
    }
  }

  try {
    const { user, token } = await loginUser(result.data)

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    revalidatePath('/', 'layout')
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.details }
    }
    return { error: 'Login failed. Please try again.' }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  revalidatePath('/', 'layout')
  redirect('/login')
}
```

---

### **6. Utility Functions**

#### **Password Hashing (`lib/utils/password.ts`)**

```typescript
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
```

#### **JWT Utilities (`lib/utils/jwt.ts`)**

```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

export interface JWTPayload {
  userId: string
  email: string
  userType: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}
```

#### **Error Class (`lib/errors/app-error.ts`)**

```typescript
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    public details?: string
  ) {
    super(code)
    this.name = 'AppError'
  }
}
```

---

## 🎨 Frontend Architecture

### **Folder Structure**

```
app/
  (auth)/                    # Auth route group
    login/
      page.tsx               # Login page
    register/
      page.tsx               # Register page
    components/
      LoginForm.tsx          # Client component
      RegisterForm.tsx       # Client component
      AuthLayout.tsx         # Shared layout

  (dashboard)/               # Protected routes
    dashboard/
      page.tsx               # Dashboard (cached)
    profile/
      page.tsx               # Profile page

components/
  ui/
    Button.tsx
    Input.tsx
    Card.tsx
    Alert.tsx

lib/
  actions/
    auth.actions.ts          # Server Actions
  hooks/
    useAuth.ts               # Client-side auth hook
  context/
    AuthContext.tsx          # Auth context provider
```

---

## 🚀 Frontend Implementation with Cache Components

### **1. Get Current User (`lib/queries/auth.queries.ts` - addition)**

```typescript
'use cache'

import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'
import { verifyToken } from '@/lib/utils/jwt'
import { getUserById } from './auth.queries'

export async function getCurrentUser() {
  cacheLife('minutes')
  cacheTag('current-user')

  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return null
  }

  try {
    const payload = verifyToken(token)
    return await getUserById(payload.userId)
  } catch {
    return null
  }
}
```

---

### **2. Register Page (`app/(auth)/register/page.tsx`)**

```typescript
import { Suspense } from 'react'
import { RegisterForm } from '../components/RegisterForm'
import { AuthLayout } from '../components/AuthLayout'

export default function RegisterPage() {
  return (
    <AuthLayout title="Create Account">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  )
}
```

---

### **3. Register Form (`app/(auth)/components/RegisterForm.tsx`)**

```typescript
'use client'

import { useActionState } from 'react'
import { registerAction } from '@/lib/actions/auth.actions'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.fullName && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.fullName[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.email && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Min. 8 characters"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.password && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">I am a:</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="userType"
              value="SEEKER"
              required
              className="mr-2"
            />
            Job Seeker
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="userType"
              value="COMPANY"
              required
              className="mr-2"
            />
            Company
          </label>
        </div>
        {state?.fieldErrors?.userType && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.userType[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  )
}
```

---

### **4. Login Form (`app/(auth)/components/LoginForm.tsx`)**

```typescript
'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth.actions'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.email && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {state?.fieldErrors?.password && (
          <p className="text-red-600 text-sm mt-1">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </form>
  )
}
```

---

### **5. Protected Dashboard (`app/(dashboard)/dashboard/page.tsx`)**

```typescript
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/queries/auth.queries'
import { logoutAction } from '@/lib/actions/auth.actions'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.fullName}!</h1>
          <p className="text-gray-600">User Type: {user.userType}</p>
          <p className="text-gray-600">Email: {user.email}</p>
        </div>
        <form action={logoutAction}>
          <button 
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </form>
      </div>
      
      <Suspense fallback={<div>Loading content...</div>}>
        <DashboardContent userType={user.userType} userId={user.id} />
      </Suspense>
    </div>
  )
}

async function DashboardContent({ 
  userType, 
  userId 
}: { 
  userType: string
  userId: string 
}) {
  'use cache'
  // Cached dashboard content based on user type
  return (
    <div className="grid gap-4">
      {userType === 'COMPANY' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Company Dashboard</h2>
          <p>Post jobs, manage applications, view candidates...</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Job Seeker Dashboard</h2>
          <p>Browse jobs, manage applications, update profile...</p>
        </div>
      )}
    </div>
  )
}
```

---

## ⚡ Cache Strategy with Next.js 16

### **Key Caching Patterns**

1. **User Session Cache**
   - Cache current user data with `cacheLife('minutes')`
   - Tag with `'current-user'` for selective revalidation
   - Revalidate on login/logout

2. **Static Content Cache**
   - Auth layouts and UI components use `'use cache'`
   - Long cache life for unchanging content

3. **Dynamic Content with Suspense**
   - Wrap user-specific content in `<Suspense>`
   - Stream dynamic data while serving cached shell

4. **Revalidation Strategy**
   ```typescript
   // After login/register
   revalidateTag('current-user')
   
   // After profile update
   revalidateTag('current-user')
   revalidateTag('user-profile')
   ```

---

## 🔒 Security Considerations

1. **Password Security**
   - Use bcrypt with salt rounds ≥ 10
   - Never log or expose passwords

2. **JWT Tokens**
   - Store in HTTP-only cookies (not localStorage)
   - Set appropriate expiration (7 days recommended)
   - Include user ID, email, userType in payload

3. **Input Validation**
   - Zod schemas validate all inputs
   - Sanitize email addresses
   - Enforce password complexity

4. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Prevent brute force attacks

5. **HTTPS Only**
   - Enforce HTTPS in production
   - Set secure cookie flags

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "zod": "^3.22.0",
    "@prisma/client": "^6.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "prisma": "^6.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.0.0"
  }
}
```

### **Environment Variables**

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
# or for SQLite: DATABASE_URL="file:./dev.db"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-here"

# Node Environment
NODE_ENV="development"
```

---

## 🧪 Testing Strategy

### **Integration Tests with Prisma**

```typescript
// __tests__/integration/auth.test.ts
import { registerAction, loginAction } from '@/lib/actions/auth.actions'
import { prisma } from '@/lib/db/prisma'

// Setup test database
beforeAll(async () => {
  // Use a test database or in-memory SQLite
  process.env.DATABASE_URL = 'file:./test.db'
})

beforeEach(async () => {
  // Clean database before each test
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Auth Actions', () => {
  it('should register a new user', async () => {
    const formData = new FormData()
    formData.append('email', 'test@test.com')
    formData.append('password', 'password123')
    formData.append('fullName', 'Test User')
    formData.append('userType', 'SEEKER')

    // Note: redirect will throw, so we catch it
    try {
      await registerAction(formData)
    } catch (error) {
      // Next.js redirect throws NEXT_REDIRECT
      expect(error).toBeDefined()
    }

    // Verify user was created
    const user = await prisma.user.findUnique({
      where: { email: 'test@test.com' }
    })
    
    expect(user).toBeDefined()
    expect(user?.fullName).toBe('Test User')
    expect(user?.userType).toBe('SEEKER')
  })

  it('should not register duplicate email', async () => {
    // Create user first
    await prisma.user.create({
      data: {
        email: 'test@test.com',
        passwordHash: 'hash',
        fullName: 'Existing User',
        userType: 'SEEKER',
      }
    })

    const formData = new FormData()
    formData.append('email', 'test@test.com')
    formData.append('password', 'password123')
    formData.append('fullName', 'Test User')
    formData.append('userType', 'SEEKER')

    const result = await registerAction(formData)
    
    expect(result?.error).toBeDefined()
    expect(result?.error).toContain('already registered')
  })

  it('should login existing user', async () => {
    // First register a user
    const registerFormData = new FormData()
    registerFormData.append('email', 'test@test.com')
    registerFormData.append('password', 'password123')
    registerFormData.append('fullName', 'Test User')
    registerFormData.append('userType', 'SEEKER')

    try {
      await registerAction(registerFormData)
    } catch {}

    // Then login
    const loginFormData = new FormData()
    loginFormData.append('email', 'test@test.com')
    loginFormData.append('password', 'password123')

    try {
      await loginAction(loginFormData)
    } catch (error) {
      // Redirect throws
      expect(error).toBeDefined()
    }
  })

  it('should reject invalid credentials', async () => {
    const formData = new FormData()
    formData.append('email', 'nonexistent@test.com')
    formData.append('password', 'wrongpassword')

    const result = await loginAction(formData)
    
    expect(result?.error).toBeDefined()
  })
})
```

### **Unit Tests for Services**

```typescript
// __tests__/unit/auth.service.test.ts
import { registerUser, loginUser } from '@/lib/services/auth.service'
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

## 📋 Implementation Checklist

### **Database Setup**
- [ ] Install Prisma: `npm install @prisma/client && npm install -D prisma`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Define User model in `prisma/schema.prisma`
- [ ] Create migration: `npx prisma migrate dev --name init`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Create Prisma client singleton (`lib/db/prisma.ts`)

### **Backend Implementation**
- [ ] Create validation schemas (`lib/validations/auth.schema.ts`)
- [ ] Implement password utilities (`lib/utils/password.ts`)
- [ ] Implement JWT utilities (`lib/utils/jwt.ts`)
- [ ] Create AppError class (`lib/errors/app-error.ts`)
- [ ] Implement auth service (`lib/services/auth.service.ts`)
- [ ] Create query functions (`lib/queries/auth.queries.ts`)
- [ ] Implement Server Actions (`lib/actions/auth.actions.ts`)
- [ ] Add getCurrentUser cached query
- [ ] Write unit tests for services
- [ ] Write integration tests for actions

### **Frontend Implementation**
- [ ] Create auth route group `app/(auth)`
- [ ] Build register page (`app/(auth)/register/page.tsx`)
- [ ] Build login page (`app/(auth)/login/page.tsx`)
- [ ] Create RegisterForm component (Client Component)
- [ ] Create LoginForm component (Client Component)
- [ ] Implement protected dashboard page
- [ ] Add logout functionality
- [ ] Test form validation and error display
- [ ] Test loading states with `useActionState`
- [ ] Verify cache behavior

### **Security & Configuration**
- [ ] Set up environment variables (`.env`)
- [ ] Generate JWT secret: `openssl rand -base64 32`
- [ ] Configure HTTP-only cookies
- [ ] Set secure cookie flags for production
- [ ] Add rate limiting middleware (optional)
- [ ] Test authentication flow end-to-end
- [ ] Verify token expiration works
- [ ] Test protected route redirects

---

## 🚀 Next Steps After Auth

1. **Profile Creation**
   - Create seeker profile collection
   - Create company profile collection
   - Link via `refObjectId` in auth collection

2. **Middleware**
   - Create auth middleware for protected routes
   - Add role-based access control

3. **Password Reset**
   - Add forgot password flow
   - Implement email verification (optional)

---

## 📚 Resources

- [Next.js 16 Cache Components](https://nextjs.org/docs/app/building-your-application/caching)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Zod Documentation](https://zod.dev/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install @prisma/client bcryptjs jsonwebtoken zod
npm install -D prisma @types/bcryptjs @types/jsonwebtoken

# 2. Initialize Prisma
npx prisma init

# 3. Update DATABASE_URL in .env
# Then create the schema in prisma/schema.prisma

# 4. Create and apply migration
npx prisma migrate dev --name init

# 5. Generate Prisma Client
npx prisma generate

# 6. Start development server
npm run dev

# 7. View database in Prisma Studio (optional)
npx prisma studio
```

---

**This plan follows the architecture rules defined in AGENTS.md:**
- ✅ Uses Prisma ORM instead of direct MongoDB
- ✅ Uses Server Actions instead of HTTP endpoints
- ✅ Follows lib/actions, lib/queries, lib/services structure
- ✅ Leverages Next.js 16 Cache Components for optimal performance
- ✅ Uses `'use server'` directive for all mutations
- ✅ Uses `cache()` from React for query deduplication
- ✅ Implements proper error handling with AppError
- ✅ Validates all inputs with Zod schemas
