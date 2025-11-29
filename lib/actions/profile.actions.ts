'use server'

import { revalidatePath } from 'next/cache'
import {
  CreateSeekerProfileSchema,
  UpdateSeekerProfileSchema,
  CreateCompanyProfileSchema,
  UpdateCompanyProfileSchema,
} from '@/lib/validations/profile.schema'
import {
  createSeekerProfile,
  updateSeekerProfile,
  createCompanyProfile,
  updateCompanyProfile,
} from '@/lib/services/profile.service'
import { AppError } from '@/lib/errors/app-error'

// Seeker Profile Actions
export async function createSeekerProfileAction(userId: string, data: unknown) {
  const result = CreateSeekerProfileSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    const profile = await createSeekerProfile(userId, result.data)
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true, profile }
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message }
    }
    return { error: 'Failed to create profile' }
  }
}

export async function updateSeekerProfileAction(userId: string, data: unknown) {
  const result = UpdateSeekerProfileSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    const profile = await updateSeekerProfile(userId, result.data)
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true, profile }
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message }
    }
    return { error: 'Failed to update profile' }
  }
}

// Company Profile Actions
export async function createCompanyProfileAction(userId: string, data: unknown) {
  const result = CreateCompanyProfileSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    const profile = await createCompanyProfile(userId, result.data)
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true, profile }
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message }
    }
    return { error: 'Failed to create profile' }
  }
}

export async function updateCompanyProfileAction(userId: string, data: unknown) {
  const result = UpdateCompanyProfileSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  try {
    const profile = await updateCompanyProfile(userId, result.data)
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true, profile }
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message }
    }
    return { error: 'Failed to update profile' }
  }
}
