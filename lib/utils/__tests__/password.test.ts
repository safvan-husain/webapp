import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../password'

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'password123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash).toMatch(/^\$2[aby]\$/)
    })

    it('should generate different hashes for same password', async () => {
      const password = 'password123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'password123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'password123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword('wrongpassword', hash)

      expect(isValid).toBe(false)
    })
  })
})
