import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { UserType } from '@prisma/client'

function getEncodedKey(): Uint8Array {
  const secretKey = process.env.SESSION_SECRET
  if (!secretKey) {
    throw new Error('SESSION_SECRET environment variable is not set')
  }
  // Use Buffer in Node.js environment, TextEncoder in browser/edge
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(secretKey, 'utf-8'))
  }
  return new TextEncoder().encode(secretKey)
}

export type SessionPayload = {
  userId: string
  userType: UserType
  expiresAt: Date
}

/**
 * Encrypts a session payload into a JWT token
 * @param payload - Session data to encrypt
 * @returns Signed JWT token
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    userType: payload.userType,
    expiresAt: payload.expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getEncodedKey())
}

/**
 * Decrypts and verifies a JWT token
 * @param session - JWT token string
 * @returns Decrypted session payload or undefined if invalid
 */
export async function decrypt(
  session: string | undefined
): Promise<SessionPayload | undefined> {
  if (!session) return undefined

  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ['HS256'],
    })

    return {
      userId: payload.userId as string,
      userType: payload.userType as UserType,
      expiresAt: new Date(payload.expiresAt as string),
    }
  } catch (error) {
    console.error('Failed to verify session:', error)
    return undefined
  }
}

/**
 * Creates a new session for a user and sets HTTP-only cookie
 * @param userId - User ID
 * @param userType - User type (SEEKER or COMPANY)
 */
export async function createSession(
  userId: string,
  userType: UserType
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({ userId, userType, expiresAt })

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Updates the session expiration time (refreshes the session)
 */
export async function updateSession(): Promise<void> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  const payload = await decrypt(session)

  if (!payload) {
    return
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const newSession = await encrypt({
    userId: payload.userId,
    userType: payload.userType,
    expiresAt,
  })

  cookieStore.set('session', newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Deletes the session cookie (logout)
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

/**
 * Gets the current session from cookies
 * @returns Session payload or undefined if no valid session
 */
export async function getSession(): Promise<SessionPayload | undefined> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  return await decrypt(session)
}
