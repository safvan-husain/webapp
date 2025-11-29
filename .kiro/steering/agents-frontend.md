---
inclusion: fileMatch
fileMatchPattern: 'app/**/*'
---

# Frontend Architecture Rules

This document defines frontend-specific rules for Next.js 16 with Cache Components.

---

## 🎨 Next.js 16 with Cache Components

This project uses Next.js 16 with Cache Components enabled for optimal performance.

**Key Principles:**
- **Dynamic by default**: All pages are dynamic unless explicitly cached
- **Use `use cache` directive**: Cache components/functions that don't need runtime data
- **Suspense boundaries**: Wrap dynamic content in `<Suspense>` for streaming
- **Server Components first**: Use Server Components by default, Client Components only when needed

---

## 🔄 Runtime APIs and Suspense

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

---

## 💾 Caching Strategy

### **Cache Static Data with cacheLife**

```ts
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

---

## 🖥️ Client Components

Use `"use client"` only when needed:

**When to use Client Components:**
- User interactions (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- React hooks (useState, useEffect, etc.)
- Third-party libraries requiring client-side

**Example:**

```tsx
'use client'

import { useActionState } from 'react'
import { loginAction } from '@/lib/actions/auth.actions'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <form action={formAction}>
      {/* form fields */}
    </form>
  )
}
```

---

## 📂 Folder Structure

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
```

---

## 📝 Server Actions in Forms

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

## 🧩 Component Structure

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

## ✅ Frontend Rules

* **Use Cache Components for optimal performance.**
* **Server Components by default, Client Components when needed.**
* **Use `'use server'` directive for all Server Actions.**
* **Use `cache()` from React for query deduplication.**
* **Always revalidate cache after mutations.**
* **Wrap dynamic content in Suspense boundaries.**
