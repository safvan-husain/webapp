import { cache } from 'react'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { verifyToken } from '@/lib/utils/jwt'

export const getUserById = cache(async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      userType: true,
      refObjectId: true,
      createdAt: true,
    }
  })
})

export const getUserByEmail = cache(async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      fullName: true,
      userType: true,
      refObjectId: true,
      createdAt: true,
    }
  })
})

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) {
    return null
  }

  try {
    const payload = verifyToken(token)
    return await getUserById(payload.userId)
  } catch {
    return null
  }
}
