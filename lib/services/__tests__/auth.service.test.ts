import { describe, it, expect } from 'vitest'
import { registerUser, loginUser } from '../auth.service'
import { prisma } from '@/lib/db/prisma'
import { AppError } from '@/lib/errors/app-error'

describe('Auth Service', () => {

  describe('registerUser', () => {
    it('should create a new user with hashed password', async () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        userType: 'SEEKER' as const,
      }

      const result = await registerUser(input)

      expect(result.user).toBeDefined()
      expect(result.user.email).toBe('test@example.com')
      expect(result.user.fullName).toBe('Test User')
      expect(result.user.userType).toBe('SEEKER')
      expect(result.token).toBeDefined()

      const dbUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      })

      expect(dbUser).toBeDefined()
      expect(dbUser?.passwordHash).not.toBe('password123')
      expect(dbUser?.passwordHash).toMatch(/^\$2[aby]\$/)
    })

    it('should throw error for duplicate email', async () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        userType: 'SEEKER' as const,
      }

      await registerUser(input)

      await expect(
        registerUser({
          ...input,
          fullName: 'Another User',
        })
      ).rejects.toThrow(AppError)
    })

    it('should create users with different user types', async () => {
      const seeker = await registerUser({
        email: 'seeker@test.com',
        password: 'password123',
        fullName: 'Job Seeker',
        userType: 'SEEKER',
      })

      const company = await registerUser({
        email: 'company@test.com',
        password: 'password123',
        fullName: 'Company User',
        userType: 'COMPANY',
      })

      expect(seeker.user.userType).toBe('SEEKER')
      expect(company.user.userType).toBe('COMPANY')
    })
  })

  describe('loginUser', () => {
    beforeEach(async () => {
      await registerUser({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        userType: 'SEEKER',
      })
    })

    it('should login with valid credentials', async () => {
      const result = await loginUser({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.user).toBeDefined()
      expect(result.user.email).toBe('test@example.com')
      expect(result.token).toBeDefined()
    })

    it('should throw error for invalid email', async () => {
      await expect(
        loginUser({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError)
    })

    it('should throw error for invalid password', async () => {
      await expect(
        loginUser({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AppError)
    })

    it('should throw error for inactive user', async () => {
      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: { isActive: false }
      })

      await expect(
        loginUser({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError)
    })
  })
})
