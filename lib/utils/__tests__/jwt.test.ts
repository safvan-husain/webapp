import { describe, it, expect } from 'vitest'
import { generateToken, verifyToken } from '../jwt'

describe('JWT Utils', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
        userType: 'SEEKER',
      }

      const token = generateToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })
  })

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
        userType: 'SEEKER',
      }

      const token = generateToken(payload)
      const decoded = verifyToken(token)

      expect(decoded.userId).toBe(payload.userId)
      expect(decoded.email).toBe(payload.email)
      expect(decoded.userType).toBe(payload.userType)
    })

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid.token.here')).toThrow()
    })
  })
})
