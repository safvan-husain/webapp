# Session Management Implementation Plan

## Overview

Implement secure, HTTP-only cookie-based session management for the job portal platform.

**Goal:** Maintain user authentication state across requests without exposing sensitive data to client-side JavaScript.

**Tech Stack:**
- Next.js 16 Server Actions
- HTTP-only cookies
- JWT (JSON Web Tokens) for session tokens
- jose library for JWT operations

---

## 1. Architecture Design

### 1.1 Session Flow

```
[Login/Register] 
    ↓
Server Action validates credentials
    ↓
Create JWT with user payload
    ↓
Set HTTP-only cookie
    ↓
Redirect to /profile/setup or /dashboard
    ↓
[Protected Pages]
    ↓
Read cookie in Server Component
    ↓
Verify JWT
    ↓
Get user session data
    ↓
Render page or redirect to /login
```

### 1.2 Cookie Strategy

**Cookie Name:** `session`

**Properties:**
- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` - HTTPS only (production)
- `sameSite: 'lax'` - CSRF protection
- `maxAge: 7 days` - Session expiration
- `path: '/'` - Available across entire app

---

## 2. Implementation Steps

### 2.1 Install Dependencies

```bash
npm install jose server-only
```

**Why jose?**
- Recommended by Next.js docs
- Works in Edge Runtime (Next.js Proxy)
- Built-in TypeScript support
- Secure by default

**Why server-only?**
- Prevents accidental client-side imports of session logic
- Recommended by Next.js for security-critical code

---

### 2.2 Environment Variables

Add to `.env`:

```env
# Session Management
SESSION_SECRET=your-super-secret-key-min-32-characters-long
```

**Security Note:** Generate a strong random secret using openssl (Next.js recommended):
```bash
openssl rand -base64 32
```

**Note:** Changed from `JWT_SECRET` to `SESSION_SECRET` to match Next.js docs convention

---

### 2.3 Create Session Utilities

**File:** `lib/session.ts` (following Next.js convention)

**Functions:**
- `encrypt(payload)` - Sign JWT with jose
- `decrypt(session)` - Verify and decode JWT
- `createSession(userId, userType)` - Create JWT and set cookie
- `updateSession()` - Refresh session expiration
- `deleteSession()` - Clear session cookie

**JWT Payload:**
```ts
{
  userId: string
  userType: 'SEEKER' | 'COMPANY'
  expiresAt: Date
}
```

**Note:** Following Next.js docs pattern with `encrypt`/`decrypt` helpers

---

### 2.4 Update Auth Actions

**File:** `lib/actions/auth.actions.ts`

**Changes:**
- `loginAction` → Call `createSession()` after successful login
- `registerAction` → Call `createSession()` after user creation
- Add `logoutAction` → Call `deleteSession()` and redirect to `/`

**Example:**
```ts
export async function loginAction(formData: FormData) {
  // ... existing validation ...
  
  const user = await loginUser(result.data)
  
  // Create session
  await createSession(user.id, user.userType)
  
  // Redirect based on profile completion
  if (!user.refObjectId) {
    redirect('/profile/setup')
  } else {
    redirect('/dashboard')
  }
}
```

---

### 2.5 Update Protected Pages

**Files:**
- `app/dashboard/page.tsx`
- `app/profile/setup/page.tsx`
- `app/profile/edit/page.tsx` (future)

**Pattern:**
```ts
import { getSession } from '@/lib/utils/session'

export default async function ProtectedPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  const user = await getUserWithProfile(session.userId)
  
  // ... render page
}
```

---

### 2.6 Create Data Access Layer (DAL)

**File:** `lib/dal.ts` (following Next.js best practices)

**Purpose:** Centralize authorization logic and data requests

**Functions:**
- `verifySession()` - Check session validity, redirect if invalid
- `getUser()` - Fetch user data with auth check

**Example:**
```ts
import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId, userType: session.userType }
})
```

**Note:** Next.js recommends DAL over middleware for most auth checks

### 2.7 Create Proxy (Optional)

**File:** `proxy.ts` (Next.js 16+ replaces middleware.ts)

**Purpose:** Optimistic checks for route protection (runs on prefetch)

**When to use:**
- Protect static routes
- Quick redirects based on auth state
- **Only read from cookies** (no database checks)

**Example:**
```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

const protectedRoutes = ['/dashboard', '/profile']
const publicRoutes = ['/login', '/register', '/']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isPublicRoute && session?.userId && !path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
```

**Important:** Proxy is for optimistic checks only. Always verify in DAL/Server Actions.

---

## 3. Security Considerations

### 3.1 XSS Protection
- ✅ HTTP-only cookies prevent JavaScript access
- ✅ No session data in localStorage/sessionStorage
- ✅ JWT payload contains minimal data (no sensitive info)

### 3.2 CSRF Protection
- ✅ `sameSite: 'lax'` prevents cross-site requests
- ✅ Server Actions have built-in CSRF protection

### 3.3 Session Hijacking Prevention
- ✅ Secure flag for HTTPS-only transmission
- ✅ Short session duration (7 days)
- ✅ Logout clears cookie immediately

### 3.4 Token Validation
- ✅ Verify JWT signature on every request
- ✅ Check expiration timestamp
- ✅ Validate user still exists in database (optional)

---

## 4. Testing Strategy

### 4.1 Unit Tests

**File:** `__tests__/unit/session.test.ts`

**Test Cases:**
- Create session with valid user data
- Get session returns correct payload
- Expired session returns null
- Invalid JWT signature returns null
- Delete session clears cookie

### 4.2 Integration Tests

**File:** `__tests__/integration/session-flow.test.ts`

**Test Cases:**
- Login creates session cookie
- Protected page accessible with valid session
- Protected page redirects without session
- Logout clears session
- Session persists across requests

---

## 5. File Structure (Following Next.js Conventions)

```
lib/
  session.ts           # encrypt(), decrypt(), createSession(), updateSession(), deleteSession()
  dal.ts               # verifySession(), getUser() - Data Access Layer
  
  actions/
    auth.actions.ts    # Updated with session creation
  
  queries/
    auth.queries.ts    # User data fetching

proxy.ts               # Optional: Optimistic route protection

__tests__/
  unit/
    session.test.ts
  integration/
    session-flow.test.ts
```

**Key Changes from Standard Pattern:**
- `lib/session.ts` instead of `lib/utils/session.ts` (Next.js convention)
- Added `lib/dal.ts` for centralized auth checks (recommended by Next.js)
- `proxy.ts` instead of `middleware.ts` (Next.js 16+)
- Using `server-only` package to prevent client-side imports

---

## 6. Implementation Checklist (Next.js Best Practices)

### Phase 1: Core Session Management
- [ ] Install `jose` and `server-only` packages
- [ ] Add `SESSION_SECRET` to .env (use openssl to generate)
- [ ] Create `lib/session.ts` with encrypt/decrypt
- [ ] Implement `createSession(userId, userType)`
- [ ] Implement `updateSession()`
- [ ] Implement `deleteSession()`

### Phase 2: Data Access Layer
- [ ] Create `lib/dal.ts`
- [ ] Implement `verifySession()` with React cache()
- [ ] Implement `getUser()` with auth check
- [ ] Use `server-only` to prevent client imports

### Phase 3: Auth Integration
- [ ] Update `loginAction` to call `createSession()`
- [ ] Update `registerAction` to call `createSession()`
- [ ] Add `logoutAction` with `deleteSession()`
- [ ] Test login/register/logout flow

### Phase 4: Protected Pages
- [ ] Update `/dashboard/page.tsx` to use `verifySession()`
- [ ] Update `/profile/setup/page.tsx` to use `verifySession()`
- [ ] Remove demo mode from profile pages
- [ ] Test redirects for unauthenticated users

### Phase 5: Proxy (Optional)
- [ ] Create `proxy.ts` for optimistic checks
- [ ] Configure protected/public routes
- [ ] Test edge-level redirects
- [ ] Ensure no database calls in proxy

### Phase 6: Testing
- [ ] Write unit tests for session utilities
- [ ] Write integration tests for auth flow
- [ ] Test session expiration
- [ ] Test DAL authorization checks

---

## 7. API Reference (Next.js Pattern)

### `encrypt(payload: SessionPayload): Promise<string>`

Signs a JWT using jose.

**Example:**
```ts
const token = await encrypt({ userId: user.id, userType: user.userType, expiresAt })
```

---

### `decrypt(session: string | undefined): Promise<SessionPayload | undefined>`

Verifies and decodes a JWT.

**Example:**
```ts
const payload = await decrypt(cookie)
```

---

### `createSession(userId: string, userType: UserType): Promise<void>`

Creates a JWT and sets it as an HTTP-only cookie.

**Example:**
```ts
await createSession(user.id, user.userType)
```

---

### `updateSession(): Promise<void>`

Refreshes the session expiration time.

**Example:**
```ts
await updateSession() // Call on user activity
```

---

### `deleteSession(): Promise<void>`

Clears the session cookie.

**Example:**
```ts
await deleteSession()
redirect('/')
```

---

### `verifySession(): Promise<{ isAuth: true, userId: string, userType: UserType }>`

Verifies session and redirects if invalid. Use in DAL.

**Example:**
```ts
export async function getUser() {
  const session = await verifySession()
  return await prisma.user.findUnique({ where: { id: session.userId } })
}
```

**Note:** Uses React `cache()` to avoid duplicate checks per render

---

## 8. Migration Path

### Step 1: Implement session utilities (no breaking changes)
### Step 2: Update auth actions (backward compatible)
### Step 3: Update protected pages one by one
### Step 4: Remove demo mode from profile pages
### Step 5: Add middleware for additional security

**No downtime required** - can be rolled out incrementally.

---

## 9. Future Enhancements

- **Refresh Tokens:** Extend sessions without re-login
- **Session Store:** Track active sessions in database
- **Device Management:** Show active sessions, allow logout from all devices
- **Remember Me:** Longer session duration option
- **Rate Limiting:** Prevent brute force attacks

---

## 10. References

- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)
- [jose Documentation](https://github.com/panva/jose)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

**Status:** Ready for implementation
**Priority:** High (blocks profile flow integration)
**Estimated Time:** 4-6 hours
