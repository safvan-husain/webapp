import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerAction, loginAction } from '@/lib/actions/auth.actions'
import { prisma } from '@/lib/db/prisma'

// Mock Next.js functions
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`)
  }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  })),
}))

// Mock session management
vi.mock('@/lib/session', () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  getSession: vi.fn(),
  updateSession: vi.fn(),
  encrypt: vi.fn(),
  decrypt: vi.fn(),
}))

describe('Auth Actions Integration Tests', () => {

  describe('registerAction', () => {
    it('should register a new user successfully', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('fullName', 'Test User')
      formData.append('userType', 'SEEKER')

      try {
        await registerAction(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
        expect(error.message).toContain('/profile/setup')
      }

      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      })

      expect(user).toBeDefined()
      expect(user?.fullName).toBe('Test User')
      expect(user?.userType).toBe('SEEKER')
      expect(user?.isActive).toBe(true)

      // Verify createSession was called with correct arguments
      const { createSession } = await import('@/lib/session')
      expect(createSession).toHaveBeenCalledWith(
        expect.any(String),
        'SEEKER'
      )
    })

    it('should return validation errors for invalid input', async () => {
      const formData = new FormData()
      formData.append('email', 'invalid-email')
      formData.append('password', 'short')
      formData.append('fullName', 'T')
      formData.append('userType', 'INVALID')

      const result = await registerAction(null, formData)

      expect(result?.error).toBe('Validation failed')
      expect(result?.fieldErrors).toBeDefined()
      expect(result?.fieldErrors?.email).toBeDefined()
      expect(result?.fieldErrors?.password).toBeDefined()
      expect(result?.fieldErrors?.fullName).toBeDefined()
    })

    it('should return error for duplicate email', async () => {
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hash',
          fullName: 'Existing User',
          userType: 'SEEKER',
        }
      })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('fullName', 'Test User')
      formData.append('userType', 'SEEKER')

      const result = await registerAction(null, formData)

      expect(result?.error).toBeDefined()
      expect(result?.error).toContain('already registered')
    })

    it('should create COMPANY user type', async () => {
      const formData = new FormData()
      formData.append('email', 'company@test.com')
      formData.append('password', 'password123')
      formData.append('fullName', 'Company User')
      formData.append('userType', 'COMPANY')

      try {
        await registerAction(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      const user = await prisma.user.findUnique({
        where: { email: 'company@test.com' }
      })

      expect(user?.userType).toBe('COMPANY')
    })
  })

  describe('loginAction', () => {
    beforeEach(async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('fullName', 'Test User')
      formData.append('userType', 'SEEKER')

      try {
        await registerAction(null, formData)
      } catch {}
    })

    it('should login with valid credentials', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      try {
        await loginAction(null, formData)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
        // Should redirect to profile/setup since no profile exists
        expect(error.message).toContain('/profile/setup')
      }

      // Verify createSession was called
      const { createSession } = await import('@/lib/session')
      expect(createSession).toHaveBeenCalled()
    })

    it('should return validation errors for invalid input', async () => {
      const formData = new FormData()
      formData.append('email', 'invalid-email')
      formData.append('password', '')

      const result = await loginAction(null, formData)

      expect(result?.error).toBe('Validation failed')
      expect(result?.fieldErrors).toBeDefined()
    })

    it('should return error for invalid credentials', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      const result = await loginAction(null, formData)

      expect(result?.error).toBeDefined()
    })

    it('should return error for non-existent user', async () => {
      const formData = new FormData()
      formData.append('email', 'nonexistent@test.com')
      formData.append('password', 'password123')

      const result = await loginAction(null, formData)

      expect(result?.error).toBeDefined()
    })
  })
})
