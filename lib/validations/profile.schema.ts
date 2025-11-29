import { z } from 'zod'

// Seeker Profile Schemas
export const SkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  yearsOfExperience: z.number().min(0).max(50),
  proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
})

export const WorkHistorySchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  duration: z.string().min(1, 'Duration is required'),
  description: z.string().optional(),
})

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  role: z.string().min(1, 'Role is required'),
  description: z.string().min(1, 'Description is required'),
  links: z.array(z.string().url()).optional().default([]),
})

export const LinksSchema = z.object({
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  other: z.array(z.string().url()).optional().default([]),
})

export const CreateSeekerProfileSchema = z.object({
  skills: z.array(SkillSchema).min(1, 'Add at least one skill'),
  workHistory: z.array(WorkHistorySchema).optional().default([]),
  projects: z.array(ProjectSchema).optional().default([]),
  jobType: z.array(z.enum(['FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONSULTING', 'STARTUP'])).min(1),
  locationPreference: z.string().optional(),
  remotePreference: z.enum(['REMOTE', 'HYBRID', 'ONSITE', 'ANY']).optional(),
  links: LinksSchema.optional(),
  vision: z.string().optional(),
  longTermGoals: z.string().optional(),
  workingStyle: z.string().optional(),
  culturePreferences: z.string().optional(),
  problemSolvingApproach: z.string().optional(),
})

export const UpdateSeekerProfileSchema = CreateSeekerProfileSchema.partial()

// Company Profile Schemas
export const FounderProfileSchema = z.object({
  name: z.string().min(1, 'Founder name is required'),
  background: z.string().optional(),
  vision: z.string().optional(),
  pastProjects: z.array(z.string()).optional().default([]),
  philosophy: z.string().optional(),
  links: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    other: z.array(z.string().url()).optional().default([]),
  }).optional(),
})

export const CompanyLinksSchema = z.object({
  website: z.string().url().optional().or(z.literal('')),
  product: z.string().url().optional().or(z.literal('')),
  other: z.array(z.string().url()).optional().default([]),
})

export const CreateCompanyProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyType: z.enum(['BUSINESS', 'STARTUP', 'SOLO_FOUNDER', 'CLIENT']),
  industry: z.string().min(1, 'Industry is required'),
  teamSize: z.number().min(1).max(10000),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  productService: z.string().optional(),
  workModel: z.enum(['REMOTE', 'HYBRID', 'ONSITE']).optional(),
  links: CompanyLinksSchema.optional(),
  companyOverview: z.string().optional(),
  teamStructure: z.string().optional(),
  workCulture: z.string().optional(),
  expectations: z.string().optional(),
  constraints: z.string().optional(),
  founderProfile: FounderProfileSchema.optional(),
})

export const UpdateCompanyProfileSchema = CreateCompanyProfileSchema.partial()

// Type exports
export type CreateSeekerProfileInput = z.infer<typeof CreateSeekerProfileSchema>
export type UpdateSeekerProfileInput = z.infer<typeof UpdateSeekerProfileSchema>
export type CreateCompanyProfileInput = z.infer<typeof CreateCompanyProfileSchema>
export type UpdateCompanyProfileInput = z.infer<typeof UpdateCompanyProfileSchema>
