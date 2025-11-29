# Authentication Module - Setup Guide

## ✅ What's Been Implemented

Complete authentication system with:
- User registration and login
- JWT-based authentication with HTTP-only cookies
- Support for two user types: Company and Job Seeker
- Protected dashboard routes
- MongoDB Atlas database with Prisma ORM v6.19
- Server Actions for mutations (no API routes)
- Zod validation
- TypeScript support
- Database successfully connected and tested

## 📦 Installed Dependencies

- @prisma/client@6.19 - Prisma ORM (v6 for MongoDB support)
- prisma@6.19 (dev) - Prisma CLI
- bcryptjs - Password hashing
- jsonwebtoken - JWT tokens
- zod - Schema validation
- mongodb - MongoDB driver
- @types/bcryptjs (dev)
- @types/jsonwebtoken (dev)
- dotenv (dev)

**Note:** Using Prisma v6.19 because MongoDB support for Prisma v7 is not yet available.

## 🗂️ Project Structure

```
app/
  (auth)/
    login/page.tsx           # Login page
    register/page.tsx        # Register page
    components/
      LoginForm.tsx          # Login form (Client Component)
      RegisterForm.tsx       # Register form (Client Component)
  dashboard/page.tsx         # Protected dashboard
  page.tsx                   # Home page with auth links

lib/
  actions/
    auth.actions.ts          # Server Actions for mutations
  queries/
    auth.queries.ts          # Data fetching functions
  services/
    auth.service.ts          # Business logic
  validations/
    auth.schema.ts           # Zod schemas
  utils/
    jwt.ts                   # JWT utilities
    password.ts              # Password hashing
  db/
    prisma.ts                # Prisma client singleton
  errors/
    app-error.ts             # Custom error class

prisma/
  schema.prisma              # Database schema
  prisma.config.ts           # Prisma configuration
```

## 🚀 Next Steps to Run the Application

### 1. Environment Variables (Already Configured)

Your `.env` file is already set up with:
- MongoDB Atlas connection string
- Secure JWT secret (generated)
- Development environment

### 2. Database Schema (Already Pushed)

The User collection has been created in your MongoDB Atlas database with:
- User authentication fields
- UserType enum (COMPANY/SEEKER)
- Indexes for performance

### 3. Start Development Server

```bash
npm run dev
```

The server is currently running at [http://localhost:3000](http://localhost:3000)

## 📍 Available Routes

- `/` - Home page with login/register links
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard (requires authentication)

## 🔐 Authentication Flow

1. User registers with email, password, full name, and user type (COMPANY or SEEKER)
2. Password is hashed with bcrypt (10 salt rounds)
3. User data is stored in MongoDB via Prisma
4. JWT token is generated (7-day expiration)
5. Token stored in HTTP-only cookie
6. User redirected to dashboard
7. Protected routes check for valid JWT token
8. Logout clears cookie and redirects to login

## 🗄️ Database Schema

```prisma
model User {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  email        String   @unique
  passwordHash String
  fullName     String
  userType     UserType  // COMPANY or SEEKER
  refObjectId  String?   // For future profile linking
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum UserType {
  COMPANY
  SEEKER
}
```

## 🛠️ Development Tools

**View database in Prisma Studio:**
```bash
npx prisma studio
```

**Regenerate Prisma Client (after schema changes):**
```bash
npx prisma generate
```

## 🧪 Testing the Auth System

1. Go to `/register`
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
   - User Type: Job Seeker or Company
3. Submit - you'll be redirected to `/dashboard`
4. Verify you see your user info
5. Click Logout - redirected to `/login`
6. Login with same credentials
7. Verify you're back in dashboard

## 🏗️ Architecture Highlights

Following `AGENTS.md` conventions:

- **Server Actions** (`lib/actions`) - All mutations with `'use server'`
- **Queries** (`lib/queries`) - Data fetching with React `cache()`
- **Services** (`lib/services`) - Business logic with Prisma
- **Validations** (`lib/validations`) - Zod schemas
- **No API routes** - Using Server Actions instead
- **Clean separation** - No circular imports, clear layer boundaries

## 🔒 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens in HTTP-only cookies (not localStorage)
- 7-day token expiration
- Secure cookie flag in production
- SameSite: lax for CSRF protection
- Input validation with Zod
- Custom error handling with AppError class

## 📋 Next Steps for Enhancement

- [ ] Add password reset functionality
- [ ] Implement email verification
- [ ] Create company and seeker profile collections
- [ ] Add middleware for route protection
- [ ] Implement role-based access control
- [ ] Add rate limiting for auth endpoints
- [ ] Write integration tests
- [ ] Add refresh token rotation

## 🐛 Troubleshooting

**Prisma Client not found:**
```bash
npx prisma generate
```

**Database connection error:**
- Check DATABASE_URL in `.env`
- Verify MongoDB cluster is accessible
- Check IP whitelist in MongoDB Atlas

**JWT_SECRET error:**
- Ensure JWT_SECRET is set in `.env`
- Generate a new secret if needed

**TypeScript errors:**
- Restart TypeScript server in your IDE
- Run `npm run build` to check for errors
