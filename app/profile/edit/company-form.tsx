'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCompanyProfileAction } from '@/lib/actions/profile.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DynamicLinkInput, type CompanyLinksInput } from '@/components/forms/dynamic-link-input'
import { DynamicTextArray } from '@/components/forms/dynamic-text-array'
import { toast } from 'sonner'

interface CompanyProfile {
  companyName: string
  companyType: string
  industry: string
  teamSize: number
  productService?: string | null
  workModel?: string | null
  companyOverview?: string | null
  teamStructure?: string | null
  workCulture?: string | null
  expectations?: string | null
  constraints?: string | null
  links?: {
    website?: string | null
    product?: string | null
    other?: string[] | null
  } | null
  founderProfile?: {
    name?: string | null
    background?: string | null
    vision?: string | null
    pastProjects?: string[] | null
    philosophy?: string | null
    links?: {
      linkedin?: string | null
      twitter?: string | null
      other?: string[] | null
    } | null
  } | null
}

type CompanyType = 'BUSINESS' | 'STARTUP' | 'SOLO_FOUNDER' | 'CLIENT'
type WorkModel = 'REMOTE' | 'HYBRID' | 'ONSITE'

interface FounderLinksInput {
  linkedin: string
  twitter: string
  other: string[]
}

interface FounderProfileInput {
  name: string
  background: string
  vision: string
  pastProjects: string[]
  philosophy: string
  links: FounderLinksInput
}

interface CompanyFormState {
  companyName: string
  companyType: CompanyType
  industry: string
  teamSize: number
  productService: string
  workModel: WorkModel
  companyOverview: string
  teamStructure: string
  workCulture: string
  expectations: string
  constraints: string
  links: CompanyLinksInput
  founderProfile: FounderProfileInput
}

export default function CompanyEditForm({ userId, profile }: { userId: string; profile: CompanyProfile }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<CompanyFormState>({
    companyName: profile.companyName || '',
    companyType: (profile.companyType || 'BUSINESS') as CompanyType,
    industry: profile.industry || '',
    teamSize: profile.teamSize || 1,
    productService: profile.productService || '',
    workModel: (profile.workModel || 'HYBRID') as WorkModel,
    companyOverview: profile.companyOverview || '',
    teamStructure: profile.teamStructure || '',
    workCulture: profile.workCulture || '',
    expectations: profile.expectations || '',
    constraints: profile.constraints || '',
    links: {
      website: profile.links?.website || '',
      product: profile.links?.product || '',
      other: profile.links?.other || [],
    },
    founderProfile: {
      name: profile.founderProfile?.name || '',
      background: profile.founderProfile?.background || '',
      vision: profile.founderProfile?.vision || '',
      pastProjects: profile.founderProfile?.pastProjects || [],
      philosophy: profile.founderProfile?.philosophy || '',
      links: {
        linkedin: profile.founderProfile?.links?.linkedin || '',
        twitter: profile.founderProfile?.links?.twitter || '',
        other: profile.founderProfile?.links?.other || [],
      },
    },
  })

  const hasFounderStep = formData.teamSize <= 200
  const totalSteps = hasFounderStep ? 4 : 3

  const handleTeamSizeChange = (value: number) => {
    setFormData((prev) => ({ ...prev, teamSize: value }))
    if (value > 200 && step === 4) {
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const sanitizedLinks: CompanyLinksInput = {
      website: formData.links.website.trim(),
      product: formData.links.product.trim(),
      other: formData.links.other.filter((link) => link.trim() !== ''),
    }

    const sanitizedFounderLinks: FounderLinksInput = {
      linkedin: formData.founderProfile.links.linkedin.trim(),
      twitter: formData.founderProfile.links.twitter.trim(),
      other: formData.founderProfile.links.other.filter((link) => link.trim() !== ''),
    }

    const founderProfilePayload = hasFounderStep
      ? {
          name: formData.founderProfile.name.trim(),
          background: formData.founderProfile.background.trim(),
          vision: formData.founderProfile.vision.trim(),
          philosophy: formData.founderProfile.philosophy.trim(),
          pastProjects: formData.founderProfile.pastProjects.map((project) => project.trim()).filter(Boolean),
          links: sanitizedFounderLinks,
        }
      : undefined

    const result = await updateCompanyProfileAction(userId, {
      ...formData,
      links: sanitizedLinks,
      founderProfile: founderProfilePayload,
    })

    if (!result.success) {
      showErrorToast(result.error!)
      setLoading(false)
    } else {
      toast.success('Profile updated successfully!')
      router.push('/profile')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-8">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Step {step} of {totalSteps}
        </span>
        <span>{hasFounderStep ? 'Includes founder profile' : 'Founder profile not required'}</span>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div>
            <Label>Company Name</Label>
            <Input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Company Type</Label>
            <select
              value={formData.companyType}
              onChange={(e) => setFormData({ ...formData, companyType: e.target.value as CompanyType })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            >
              <option value="BUSINESS">Business</option>
              <option value="STARTUP">Startup</option>
              <option value="SOLO_FOUNDER">Solo Founder</option>
              <option value="CLIENT">Client</option>
            </select>
          </div>

          <div>
            <Label>Industry</Label>
            <Input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Team Size</Label>
            <Input
              type="number"
              value={formData.teamSize}
              onChange={(e) => handleTeamSizeChange(Number(e.target.value))}
              min="1"
              required
            />
            {hasFounderStep ? (
              <p className="text-xs text-muted-foreground mt-1">Founder profile will be requested for teams of 200 or fewer.</p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">No founder profile needed for larger teams.</p>
            )}
          </div>

          <Button type="button" onClick={() => setStep(2)} className="w-full">
            Next: Work Details
          </Button>
        </div>
      )}

      {/* Step 2: Work Details */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Work Details</h2>

          <div>
            <Label>Work Model</Label>
            <select
              value={formData.workModel}
              onChange={(e) => setFormData({ ...formData, workModel: e.target.value as WorkModel })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            >
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </select>
          </div>

          <div>
            <Label>Product/Service (Optional)</Label>
            <textarea
              value={formData.productService}
              onChange={(e) => setFormData({ ...formData, productService: e.target.value })}
              placeholder="Describe your product or service"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>

          <DynamicLinkInput
            links={formData.links}
            onChange={(links) => setFormData((prev) => ({ ...prev, links }))}
            title="Links (Optional)"
            description="Share your website, product demo, and any supporting links that showcase your work."
          />

          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1">
              Back
            </Button>
            <Button type="button" onClick={() => setStep(3)} className="flex-1">
              Next: Culture & Expectations
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Culture & Expectations */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Culture & Expectations</h2>

          <div>
            <Label>Company Overview (Optional)</Label>
            <textarea
              value={formData.companyOverview}
              onChange={(e) => setFormData({ ...formData, companyOverview: e.target.value })}
              placeholder="Brief overview of your company"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>

          <div>
            <Label>Work Culture (Optional)</Label>
            <textarea
              value={formData.workCulture}
              onChange={(e) => setFormData({ ...formData, workCulture: e.target.value })}
              placeholder="Describe your work culture and values"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>

          <div>
            <Label>Team Structure (Optional)</Label>
            <textarea
              value={formData.teamStructure}
              onChange={(e) => setFormData({ ...formData, teamStructure: e.target.value })}
              placeholder="How is your team organized?"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>

          <div>
            <Label>Expectations (Optional)</Label>
            <textarea
              value={formData.expectations}
              onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
              placeholder="What do you expect from candidates?"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>

          <div>
            <Label>Constraints (Optional)</Label>
            <textarea
              value={formData.constraints}
              onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              placeholder="Any constraints or limitations to be aware of?"
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(2)} variant="outline" className="flex-1">
              Back
            </Button>
            {hasFounderStep ? (
              <Button type="button" onClick={() => setStep(4)} className="flex-1">
                Next: Founder Profile
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Updating Profile...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Founder Profile */}
      {hasFounderStep && step === 4 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Founder Profile</h2>
            <p className="text-sm text-muted-foreground">
              For companies with 200 or fewer employees, founder information helps candidates understand your vision.
            </p>
          </div>

          <div>
            <Label>Founder Name</Label>
            <Input
              value={formData.founderProfile.name}
              onChange={(e) => setFormData({ ...formData, founderProfile: { ...formData.founderProfile, name: e.target.value } })}
              placeholder="Full name"
              required
            />
          </div>

          <details className="rounded-lg border border-border bg-muted/30 p-4 space-y-4" open>
            <summary className="cursor-pointer text-sm font-medium">Optional founder details</summary>

            <div>
              <Label>Background</Label>
              <textarea
                value={formData.founderProfile.background}
                onChange={(e) =>
                  setFormData({ ...formData, founderProfile: { ...formData.founderProfile, background: e.target.value } })
                }
                placeholder="Your professional background"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
              />
            </div>

            <div>
              <Label>Vision</Label>
              <textarea
                value={formData.founderProfile.vision}
                onChange={(e) => setFormData({ ...formData, founderProfile: { ...formData.founderProfile, vision: e.target.value } })}
                placeholder="Where are you taking the company?"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
              />
            </div>

            <DynamicTextArray
              label="Past Projects"
              values={formData.founderProfile.pastProjects}
              onChange={(pastProjects) =>
                setFormData((prev) => ({ ...prev, founderProfile: { ...prev.founderProfile, pastProjects } }))
              }
              placeholder="Notable project or company"
              description="Highlight previous projects that demonstrate expertise."
            />

            <div>
              <Label>Philosophy</Label>
              <textarea
                value={formData.founderProfile.philosophy}
                onChange={(e) =>
                  setFormData({ ...formData, founderProfile: { ...formData.founderProfile, philosophy: e.target.value } })
                }
                placeholder="Guiding principles or leadership philosophy"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Founder Links</Label>
              <div className="space-y-2">
                <Input
                  type="url"
                  value={formData.founderProfile.links.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      founderProfile: {
                        ...formData.founderProfile,
                        links: { ...formData.founderProfile.links, linkedin: e.target.value },
                      },
                    })
                  }
                  placeholder="LinkedIn profile"
                />
                <Input
                  type="url"
                  value={formData.founderProfile.links.twitter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      founderProfile: {
                        ...formData.founderProfile,
                        links: { ...formData.founderProfile.links, twitter: e.target.value },
                      },
                    })
                  }
                  placeholder="Twitter/X profile"
                />
                <DynamicTextArray
                  label="Other Links"
                  values={formData.founderProfile.links.other}
                  onChange={(otherLinks) =>
                    setFormData((prev) => ({
                      ...prev,
                      founderProfile: { ...prev.founderProfile, links: { ...prev.founderProfile.links, other: otherLinks } },
                    }))
                  }
                  placeholder="Personal site, podcasts, or interviews"
                />
              </div>
            </div>
          </details>

          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(3)} variant="outline" className="flex-1">
              Back
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating Profile...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
