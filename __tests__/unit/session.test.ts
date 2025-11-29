import { describe, it, expect, vi } from 'vitest'
import { UserType } from '@prisma/client'

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

// Mock server-only at the test level as well
vi.mock('server-only', () => ({}))

describe('Session Utilities', () => {
  it('should export session management functions', async () => {
    // This test verifies that the module can be imported without errors
    // Full integration tests will be done in integration tests
    const session = await import('@/lib/session')
    
    expect(session.encrypt).toBeDefined()
    expect(session.decrypt).toBeDefined()
    expect(session.createSession).toBeDefined()
    expect(session.updateSession).toBeDefined()
    expect(session.deleteSession).toBeDefined()
    expect(session.getSession).toBeDefined()
  })

  describe('Cookie operations', () => {
    it('should call cookies API for deleteSession', async () => {
      const mockDelete = vi.fn()
      const mockCookies = {
        set: vi.fn(),
        get: vi.fn(),
        delete: mockDelete,
      }

      const { cookies } = await import('next/headers')
      vi.mocked(cookies).mockResolvedValue(mockCookies as any)

      const { deleteSession } = await import('@/lib/session')
      await deleteSession()

      expect(mockDelete).toHaveBeenCalledWith('session')
    })

    it('should return undefined when no cookie exists', async () => {
      const mockGet = vi.fn().mockReturnValue(undefined)
      const mockCookies = {
        set: vi.fn(),
        get: mockGet,
        delete: vi.fn(),
      }

      const { cookies } = await import('next/headers')
      vi.mocked(cookies).mockResolvedValue(mockCookies as any)

      const { getSession } = await import('@/lib/session')
      const session = await getSession()

      expect(session).toBeUndefined()
    })
  })
})

// Note: Full encryption/decryption tests are skipped due to jose/vitest compatibility issues
// These will be covered by integration tests when the session is used in actual auth flow
