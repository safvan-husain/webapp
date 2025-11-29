## 🧠 Overview

This document defines the **architecture rules and conventions** the coding agent must follow while generating, updating, or refactoring code inside this project.
Goal: **clean separation of concerns**, **feature-based organization**, and **reusable business logic** shared across both web UI and external clients.

This project uses:

* **Next.js App Router (Next.js 16+)**
* **Feature-based backend logic inside `/lib`**
* **Zod** for input/output schemas
* **Prisma** as the ORM for database access
* **Server Actions** for data mutations (no HTTP endpoints)

---

## 📁 Folder Structure

```
app/
  (auth)/                    // Route groups for organization
    login/
      page.tsx
    register/
      page.tsx

components/
  ui/                        // Shared UI components
  forms/                     // Form components

lib/
  actions/                   // Server Actions (mutations)
    auth.actions.ts
    product.actions.ts
  
  queries/                   // Data fetching functions
    auth.queries.ts
    product.queries.ts
  
  validations/               // Zod schemas
    auth.schema.ts
    product.schema.ts
  
  services/                  // Business logic
    auth.service.ts
    product.service.ts
  
  db/
    prisma.ts                // Prisma client singleton
  
  errors/
    app-error.ts
  
  utils/
    (...)

prisma/
  schema.prisma              // Prisma schema
  migrations/                // Database migrations
```

---

## 🏛 Layer Responsibilities

### **1. Server Actions (`lib/actions/*.actions.ts`)**

Server Actions handle all data mutations (create, update, delete).

Responsibilities:

* Marked with `'use server'` directive
* Validate input using Zod schemas
* Call service functions for business logic
* Handle errors and return user-friendly messages
* Trigger cache revalidation (`revalidatePath`, `revalidateTag`)
* Handle redirects after mutations

**Server Actions DO NOT:**

* Contain business logic (delegate to services)
* Access database directly (use services)
* Return sensitive data

Example:

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { LoginSchema } from '@/lib/validations/auth.schema'
import { loginUser } from '@/lib/services/auth.service'

export async function loginAction(formData: FormData) {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    const user = await loginUser(result.data)
    revalidatePath('/dashboard')
    return { success: true, user }
  } catch (error) {
    return { error: 'Invalid credentials' }
  }
}
```

---

### **2. Queries (`lib/queries/*.queries.ts`)**

Query functions handle all data fetching (read operations).

Responsibilities:

* Fetch data from database via Prisma
* Can be cached using `'use cache'` directive
* Return domain objects
* Can use `cache()` from React for deduplication

**Queries DO NOT:**

* Mutate data
* Validate user input (read-only)
* Handle form submissions

Example:

```ts
import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'

export const getUserById = cache(async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, fullName: true }
  })
})
```

---

### **3. Services (`lib/services/*.service.ts`)**

All business logic lives here.

Responsibilities:

* Domain rules and validation
* Complex business operations
* Communicate with database via Prisma
* Throw `AppError` on rule failures
* Return domain objects

**Services DO NOT:**

* Validate raw form input (use Zod in actions)
* Know about HTTP or forms
* Handle cache revalidation

Example:

```ts
import { prisma } from '@/lib/db/prisma'
import { AppError } from '@/lib/errors/app-error'
import { hashPassword } from '@/lib/utils/password'

export async function createUser(data: { email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  
  if (existing) {
    throw new AppError(409, 'USER_EXISTS', 'Email already registered')
  }

  const passwordHash = await hashPassword(data.password)
  
  return await prisma.user.create({
    data: { ...data, passwordHash }
  })
}
```

---

### **4. Validation Schemas (`lib/validations/*.schema.ts`)**

Zod schemas define input/output shapes.

Responsibilities:

* Define validation rules
* Type inference for TypeScript
* Reusable across actions and components

Example:

```ts
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginInput = z.infer<typeof LoginSchema>
```

---

## 📡 Data Layer (Prisma)

This project uses **Prisma** as the ORM for database access.

### **Prisma Client Setup**

Create a singleton Prisma client:

```ts
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### **Usage**

* Services import and use `prisma` directly
* Queries use `prisma` for data fetching
* All database operations go through Prisma

Example:

```ts
import { prisma } from '@/lib/db/prisma'

export async function getUsers() {
  return await prisma.user.findMany()
}
```

---

## 🚧 Error Handling

Use a single `AppError` class.

```ts
// lib/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    public details?: any
  ) {
    super(code);
  }
}
```

Services throw `AppError`.
Controllers translate them to HTTP responses.

---

## 🔄 Flow Diagram

### **Data Mutation Flow (Server Actions)**

```
[Form Submission / User Action]
      ↓
lib/actions/*.actions.ts
      ↓
validate input ←──── Zod schema
      ↓
lib/services/*.service.ts
      ↓
Prisma database operations
      ↓
revalidatePath / revalidateTag
      ↓
return result to client
      ↓
[UI Update / Redirect]
```

### **Data Fetching Flow (Queries)**

```
[Page/Component Render]
      ↓
lib/queries/*.queries.ts
      ↓
Prisma database query
      ↓
cache() / 'use cache'
      ↓
return data
      ↓
[Render UI]
```

---

## 📐 Naming Conventions

File names:

```
lib/actions/auth.actions.ts
lib/queries/auth.queries.ts
lib/services/auth.service.ts
lib/validations/auth.schema.ts
prisma/schema.prisma
```

Functions:

* Server Actions → `xxxAction`: `loginAction`, `registerAction`
* Queries → `getXxx`: `getUserById`, `getProducts`
* Services → verbs: `createUser`, `loginUser`, `validateCredentials`
* Schemas → PascalCase: `LoginSchema`, `RegisterSchema`

---

## 📥 Import & Dependency Rules

1. **`app/*` must never be imported inside `lib/*`.**

2. **Pages/Components** import from:
   * Server Actions (`lib/actions`)
   * Queries (`lib/queries`)
   * UI components

3. **Server Actions** import from:
   * Validation schemas (`lib/validations`)
   * Services (`lib/services`)
   * Next.js cache functions (`next/cache`)

4. **Queries** import from:
   * Prisma client (`lib/db/prisma`)
   * React cache (`react`)

5. **Services** import from:
   * Prisma client (`lib/db/prisma`)
   * Utils
   * Error classes

6. **No circular imports allowed.**

### **Import Flow**

```
app/* → lib/actions → lib/services → prisma
app/* → lib/queries → prisma
```

---

## 🧪 Testing Strategy

### **Integration Tests**

Integration tests directly test Server Actions and services.

Location: `__tests__/integration/`

**Approach:**

* Import Server Actions directly from `lib/actions`
* Create mock `FormData` objects
* Call actions and assert on results
* Use Prisma with test database or in-memory SQLite

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

### **Unit Tests**

Unit tests for services, controllers, and utilities.

Location: `lib/**/*.test.ts`

**Guidelines:**

* Test business logic in services
* Test validation in controllers
* Mock external dependencies
* Keep tests focused and isolated

### **Test Commands**

```bash
npm test                  # Run all tests
npm run test:unit         # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

### **General Principles**

* Pure functions where possible
* Minimal side effects
* Separated concerns
* No tests required by default (add when needed)

---

## 📜 Code Snippets

### Server Action

```ts
// lib/actions/auth.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { LoginSchema } from '@/lib/validations/auth.schema'
import { loginUser } from '@/lib/services/auth.service'

export async function loginAction(formData: FormData) {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    const user = await loginUser(result.data)
    revalidatePath('/dashboard')
    redirect('/dashboard')
  } catch (error) {
    return { error: 'Invalid credentials' }
  }
}
```

---

### Query Function

```ts
// lib/queries/auth.queries.ts
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
    }
  })
})
```

---

### Service (Prisma example)

```ts
// lib/services/auth.service.ts
import { prisma } from '@/lib/db/prisma'
import { AppError } from '@/lib/errors/app-error'
import { verifyPassword } from '@/lib/utils/password'

export async function loginUser({ email, password }: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email } })
  
  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  
  if (!isValid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    userType: user.userType,
  }
}
```

---

### Form Component with Server Action

```tsx
// app/(auth)/login/page.tsx
import { loginAction } from '@/lib/actions/auth.actions'

export default function LoginPage() {
  return (
    <form action={loginAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

---

## 🧬 Component Structure

```
components/
  Button.tsx
  Card.tsx

app/
  dashboard/
    page.tsx
    components/
      DashboardCard.tsx
  product/
    page.tsx
    components/
      ProductCard.tsx
```

---

## 🧩 Adding a New Feature (Checklist)

1. **Define Prisma Schema**:
   * Add models to `prisma/schema.prisma`
   * Run `npx prisma migrate dev`

2. **Create Validation Schemas**:
   * Add `lib/validations/<feature>.schema.ts`

3. **Create Service Layer**:
   * Add `lib/services/<feature>.service.ts`
   * Implement business logic with Prisma

4. **Create Server Actions** (for mutations):
   * Add `lib/actions/<feature>.actions.ts`
   * Mark with `'use server'`
   * Validate input, call services, revalidate cache

5. **Create Query Functions** (for reads):
   * Add `lib/queries/<feature>.queries.ts`
   * Use `cache()` for deduplication

6. **Add UI Pages**:
   * Create pages in `app/`
   * Import and use Server Actions in forms
   * Call query functions for data fetching

7. **Add Shared Components**:
   * Put reusable UI in `/components`

---

## 🎨 Frontend Architecture

### **Next.js 16 with Cache Components**

This project uses Next.js 16 with Cache Components enabled for optimal performance.

**Key Principles:**

* **Dynamic by default**: All pages are dynamic unless explicitly cached
* **Use `use cache` directive**: Cache components/functions that don't need runtime data
* **Suspense boundaries**: Wrap dynamic content in `<Suspense>` for streaming
* **Server Components first**: Use Server Components by default, Client Components only when needed

### **Runtime APIs and Suspense**

When using runtime APIs like `searchParams` or `params`, pass them as promises to child components wrapped in Suspense:

```tsx
// ✅ Correct - Pass promise to child wrapped in Suspense
export default function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{page?: string}> 
}) {
  return (
    <Suspense fallback={<Loading />}>
      <Content pagePromise={searchParams.then(p => p.page)} />
    </Suspense>
  )
}

async function Content({ pagePromise }: { pagePromise: Promise<string | undefined> }) {
  const page = await pagePromise
  // Use page...
}
```

### **Caching Strategy**

```ts
// Cache static data with cacheLife
import { cacheLife } from 'next/cache'

async function getProducts() {
  'use cache'
  cacheLife('hours')
  const res = await fetch('/api/products')
  return res.json()
}
```

### **Revalidation with Tags**

```ts
// Tag cached data
import { cacheTag, revalidateTag } from 'next/cache'

async function getProducts() {
  'use cache'
  cacheTag('products')
  // fetch data
}

// Revalidate after mutations
async function createProduct(data: FormData) {
  'use server'
  // create product
  revalidateTag('products')
}
```

### **Client Components**

Use `"use client"` only when needed:

* User interactions (onClick, onChange, etc.)
* Browser APIs (localStorage, window, etc.)
* React hooks (useState, useEffect, etc.)
* Third-party libraries requiring client-side

### **Folder Structure**

```
app/
  (auth)/              # Auth pages group
    login/
      page.tsx
    register/
      page.tsx
  (admin)/             # Admin pages group
    dashboard/
      page.tsx
    products/
      page.tsx
  products/            # Public product pages
    page.tsx
    [id]/
      page.tsx
  components/          # Page-specific components
    ProductCard.tsx

components/            # Shared components
  ui/
    Button.tsx
    Input.tsx
  forms/
    LoginForm.tsx

lib/
  actions/             # Server Actions
    auth.actions.ts
    product.actions.ts
```

### **Server Actions**

Place all mutations in Server Actions:

```ts
// lib/actions/product.actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function createProduct(formData: FormData) {
  const res = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
  })
  
  if (res.ok) {
    revalidateTag('products')
  }
  
  return res.json()
}
```

### **Form Handling**

Use Server Actions with forms:

```tsx
import { createProduct } from '@/lib/actions/product.actions'

export function ProductForm() {
  return (
    <form action={createProduct}>
      <input name="name" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

---

## ✅ Final Notes

* **Use Server Actions for all mutations (no API routes).**
* **All validation must use Zod.**
* **Database access only through Prisma.**
* **Never import from `app/*` inside `lib/*`.**
* **Use Cache Components for optimal performance.**
* **Server Components by default, Client Components when needed.**
* **Use `'use server'` directive for all Server Actions.**
* **Use `cache()` from React for query deduplication.**
* **Always revalidate cache after mutations.**
* **Follow this structure unless explicitly overridden.**

---