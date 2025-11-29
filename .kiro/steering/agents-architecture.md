---
inclusion: always
---

# Core Architecture Rules

This document defines the **architecture rules and conventions** for this Next.js project.

**Goal:** Clean separation of concerns, feature-based organization, and reusable business logic.

**Tech Stack:**
- Next.js 16+ with App Router
- Prisma ORM for database access
- Zod for validation
- Server Actions (no HTTP endpoints)

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

**Responsibilities:**
- Marked with `'use server'` directive
- Validate input using Zod schemas
- Call service functions for business logic
- Handle errors and return user-friendly messages
- Trigger cache revalidation (`revalidatePath`, `revalidateTag`)
- Handle redirects after mutations

**Server Actions DO NOT:**
- Contain business logic (delegate to services)
- Access database directly (use services)
- Return sensitive data

**Example:**

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

**Responsibilities:**
- Fetch data from database via Prisma
- Can be cached using `'use cache'` directive
- Return domain objects
- Can use `cache()` from React for deduplication

**Queries DO NOT:**
- Mutate data
- Validate user input (read-only)
- Handle form submissions

**Example:**

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

**Responsibilities:**
- Domain rules and validation
- Complex business operations
- Communicate with database via Prisma
- Throw `AppError` on rule failures
- Return domain objects

**Services DO NOT:**
- Validate raw form input (use Zod in actions)
- Know about HTTP or forms
- Handle cache revalidation

**Example:**

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

**Responsibilities:**
- Define validation rules
- Type inference for TypeScript
- Reusable across actions and components

**Example:**

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

- Services import and use `prisma` directly
- Queries use `prisma` for data fetching
- All database operations go through Prisma

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
Actions translate them to user-friendly responses.

---

## 🔄 Flow Diagrams

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

**File names:**

```
lib/actions/auth.actions.ts
lib/queries/auth.queries.ts
lib/services/auth.service.ts
lib/validations/auth.schema.ts
prisma/schema.prisma
```

**Functions:**

- Server Actions → `xxxAction`: `loginAction`, `registerAction`
- Queries → `getXxx`: `getUserById`, `getProducts`
- Services → verbs: `createUser`, `loginUser`, `validateCredentials`
- Schemas → PascalCase: `LoginSchema`, `RegisterSchema`

---

## 📥 Import & Dependency Rules

1. **`app/*` must never be imported inside `lib/*`.**

2. **Pages/Components** import from:
   - Server Actions (`lib/actions`)
   - Queries (`lib/queries`)
   - UI components

3. **Server Actions** import from:
   - Validation schemas (`lib/validations`)
   - Services (`lib/services`)
   - Next.js cache functions (`next/cache`)

4. **Queries** import from:
   - Prisma client (`lib/db/prisma`)
   - React cache (`react`)

5. **Services** import from:
   - Prisma client (`lib/db/prisma`)
   - Utils
   - Error classes

6. **No circular imports allowed.**

### **Import Flow**

```
app/* → lib/actions → lib/services → prisma
app/* → lib/queries → prisma
```

---

## 🧩 Adding a New Feature (Checklist)

1. **Define Prisma Schema**:
   - Add models to `prisma/schema.prisma`
   - Run `npx prisma migrate dev`

2. **Create Validation Schemas**:
   - Add `lib/validations/<feature>.schema.ts`

3. **Create Service Layer**:
   - Add `lib/services/<feature>.service.ts`
   - Implement business logic with Prisma

4. **Create Server Actions** (for mutations):
   - Add `lib/actions/<feature>.actions.ts`
   - Mark with `'use server'`
   - Validate input, call services, revalidate cache

5. **Create Query Functions** (for reads):
   - Add `lib/queries/<feature>.queries.ts`
   - Use `cache()` for deduplication

6. **Add UI Pages**:
   - Create pages in `app/`
   - Import and use Server Actions in forms
   - Call query functions for data fetching

7. **Add Shared Components**:
   - Put reusable UI in `/components`

---

## ✅ Core Rules

* **Use Server Actions for all mutations (no API routes).**
* **All validation must use Zod.**
* **Database access only through Prisma.**
* **Never import from `app/*` inside `lib/*`.**
* **No circular imports allowed.**
* **Follow this structure unless explicitly overridden.**
