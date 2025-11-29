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
import { handleServerError } from '@/lib/utils/error-handler'
import type { ActionResult } from '@/lib/errors/types'

// Seeker Profile Actions
export async function createSeekerProfileAction(userId: string, data: unknown): Promise<ActionResult> {
  const result = CreateSeekerProfileSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        details: result.error.flatten().fieldErrors,
        timestamp: new Date().toISOString(),
      }
    }
  }

  try {
    const profile = await createSeekerProfile(userId, result.data)
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true, data: profile }
  } catch (error) {
    return {
      success: false,
      error: handleServerError(error)
    }
  }
}

export async function updateSeekerProfileAction(userId: string, data: unknown): Promise<ActionResult> {
  const result = UpdateSeekerProfileSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        details: result.error.flatten().fieldErrors,
        timestamp: new Date().toISOString(),
      }
    }
  }

  try {
    const profile = await updateSeekerProfile(userId, result.data)
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true, data: profile }
  } catch (error) {
    return {
      success: false,
      error: handleServerError(error)
    }
  }
}

// Company Profile Actions
export async function createCompanyProfileAction(userId: string, data: unknown): Promise<ActionResult> {
  const result = CreateCompanyProfileSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        details: result.error.flatten().fieldErrors,
        timestamp: new Date().toISOString(),
      }
    }
  }

  try {
    const profile = await createCompanyProfile(userId, result.data)
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true, data: profile }
  } catch (error) {
    return {
      success: false,
      error: handleServerError(error)
    }
  }
}

export async function updateCompanyProfileAction(userId: string, data: unknown): Promise<ActionResult> {
  const result = UpdateCompanyProfileSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        details: result.error.flatten().fieldErrors,
        timestamp: new Date().toISOString(),
      }
    }
  }

  try {
    const profile = await updateCompanyProfile(userId, result.data)
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    return { success: true, data: profile }
  } catch (error) {
    return {
      success: false,
      error: handleServerError(error)
    }
  }
}
