import { cache } from 'react'
import { prisma } from '@/lib/db/prisma'

export const getUserWithProfile = cache(async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      seekerProfile: true,
      companyProfile: true,
    },
  })
})

export const getSeekerProfileById = cache(async (profileId: string) => {
  return await prisma.seekerProfile.findUnique({
    where: { id: profileId },
  })
})

export const getCompanyProfileById = cache(async (profileId: string) => {
  return await prisma.companyProfile.findUnique({
    where: { id: profileId },
  })
})

export const checkProfileExists = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { refObjectId: true, userType: true },
  })
  
  return {
    exists: !!user?.refObjectId,
    userType: user?.userType,
  }
})
