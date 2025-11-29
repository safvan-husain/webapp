import { prisma } from '@/lib/db/prisma'
import { AppError } from '@/lib/errors/app-error'
import type {
  CreateSeekerProfileInput,
  UpdateSeekerProfileInput,
  CreateCompanyProfileInput,
  UpdateCompanyProfileInput,
} from '@/lib/validations/profile.schema'

// Seeker Profile Services
export async function createSeekerProfile(userId: string, data: CreateSeekerProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found')
  }

  if (user.userType !== 'SEEKER') {
    throw new AppError(403, 'INVALID_USER_TYPE', 'Only seekers can create seeker profiles')
  }

  if (user.refObjectId) {
    throw new AppError(409, 'PROFILE_EXISTS', 'Profile already exists')
  }

  const profile = await prisma.seekerProfile.create({
    data: {
      skills: data.skills as any,
      workHistory: data.workHistory as any,
      projects: data.projects as any,
      jobType: data.jobType,
      locationPreference: data.locationPreference,
      remotePreference: data.remotePreference,
      links: data.links as any,
      vision: data.vision,
      longTermGoals: data.longTermGoals,
      workingStyle: data.workingStyle,
      culturePreferences: data.culturePreferences,
      problemSolvingApproach: data.problemSolvingApproach,
      pastProjectStories: [],
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { refObjectId: profile.id },
  })

  return profile
}

export async function getSeekerProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { seekerProfile: true },
  })

  if (!user || !user.seekerProfile) {
    throw new AppError(404, 'PROFILE_NOT_FOUND', 'Profile not found')
  }

  return user.seekerProfile
}

export async function updateSeekerProfile(userId: string, data: UpdateSeekerProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user || !user.refObjectId) {
    throw new AppError(404, 'PROFILE_NOT_FOUND', 'Profile not found')
  }

  return await prisma.seekerProfile.update({
    where: { id: user.refObjectId },
    data: {
      ...(data.skills && { skills: data.skills as any }),
      ...(data.workHistory && { workHistory: data.workHistory as any }),
      ...(data.projects && { projects: data.projects as any }),
      ...(data.jobType && { jobType: data.jobType }),
      ...(data.locationPreference !== undefined && { locationPreference: data.locationPreference }),
      ...(data.remotePreference && { remotePreference: data.remotePreference }),
      ...(data.links && { links: data.links as any }),
      ...(data.vision !== undefined && { vision: data.vision }),
      ...(data.longTermGoals !== undefined && { longTermGoals: data.longTermGoals }),
      ...(data.workingStyle !== undefined && { workingStyle: data.workingStyle }),
      ...(data.culturePreferences !== undefined && { culturePreferences: data.culturePreferences }),
      ...(data.problemSolvingApproach !== undefined && { problemSolvingApproach: data.problemSolvingApproach }),
    },
  })
}

// Company Profile Services
export async function createCompanyProfile(userId: string, data: CreateCompanyProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found')
  }

  if (user.userType !== 'COMPANY') {
    throw new AppError(403, 'INVALID_USER_TYPE', 'Only companies can create company profiles')
  }

  if (user.refObjectId) {
    throw new AppError(409, 'PROFILE_EXISTS', 'Profile already exists')
  }

  const profile = await prisma.companyProfile.create({
    data: {
      companyName: data.companyName,
      companyType: data.companyType,
      industry: data.industry,
      teamSize: data.teamSize,
      website: data.website,
      productService: data.productService,
      workModel: data.workModel,
      links: data.links as any,
      companyOverview: data.companyOverview,
      teamStructure: data.teamStructure,
      workCulture: data.workCulture,
      expectations: data.expectations,
      constraints: data.constraints,
      founderProfile: data.founderProfile as any,
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { refObjectId: profile.id },
  })

  return profile
}

export async function getCompanyProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { companyProfile: true },
  })

  if (!user || !user.companyProfile) {
    throw new AppError(404, 'PROFILE_NOT_FOUND', 'Profile not found')
  }

  return user.companyProfile
}

export async function updateCompanyProfile(userId: string, data: UpdateCompanyProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user || !user.refObjectId) {
    throw new AppError(404, 'PROFILE_NOT_FOUND', 'Profile not found')
  }

  return await prisma.companyProfile.update({
    where: { id: user.refObjectId },
    data: {
      ...(data.companyName && { companyName: data.companyName }),
      ...(data.companyType && { companyType: data.companyType }),
      ...(data.industry && { industry: data.industry }),
      ...(data.teamSize !== undefined && { teamSize: data.teamSize }),
      ...(data.website !== undefined && { website: data.website }),
      ...(data.productService !== undefined && { productService: data.productService }),
      ...(data.workModel && { workModel: data.workModel }),
      ...(data.links && { links: data.links as any }),
      ...(data.companyOverview !== undefined && { companyOverview: data.companyOverview }),
      ...(data.teamStructure !== undefined && { teamStructure: data.teamStructure }),
      ...(data.workCulture !== undefined && { workCulture: data.workCulture }),
      ...(data.expectations !== undefined && { expectations: data.expectations }),
      ...(data.constraints !== undefined && { constraints: data.constraints }),
      ...(data.founderProfile && { founderProfile: data.founderProfile as any }),
    },
  })
}
