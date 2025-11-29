import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from '@/lib/session'
import { prisma } from '@/lib/db/prisma'
import { UserType } from '@prisma/client'

export type SessionData = {
  isAuth: true
  userId: string
  userType: UserType
}

/**
 * Verifies the current session and redirects to login if invalid
 * Uses React cache() to avoid duplicate checks per render
 * @returns Session data with userId and userType
 */
export const verifySession = cache(async (): Promise<SessionData> => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return {
    isAuth: true,
    userId: session.userId,
    userType: session.userType,
  }
})

/**
 * Gets the current user with session verification
 * Redirects to login if session is invalid
 * @returns User object or null if not found
 */
export const getUser = cache(async () => {
  const session = await verifySession()

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      userType: true,
      refObjectId: true,
      createdAt: true,
    },
  })

  return user
})

/**
 * Gets the current user with their profile (Seeker or Company)
 * Redirects to login if session is invalid
 * @returns User with profile data
 */
export const getUserWithProfile = cache(async () => {
  const session = await verifySession()

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      seekerProfile: session.userType === UserType.SEEKER,
      companyProfile: session.userType === UserType.COMPANY,
    },
  })

  return user
})
