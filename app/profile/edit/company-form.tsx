'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCompanyProfileAction } from '@/lib/actions/profile.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface CompanyProfile {
  companyName: string
  companyType: string
  industry: string
  teamSize: number
  website?: string | null
  productService?: string | null
  workModel?: string | null
  companyOverview?: string | null
  teamStructure?: string | null
  workCulture?: string | null
  expectations?: string | null
  constraints?: string | null
}

export default function CompanyEditForm({ userId, profile }: { userId: string; profile: CompanyProfile }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    companyName: profile.companyName || '',
    companyType: (profile.companyType || 'BUSINESS') as 'BUSINESS' | 'STARTUP' | 'SOLO_FOUNDER' | 'CLIENT',
    industry: profile.industry || '',
    teamSize: profile.teamSize || 1,
    website: profile.website || '',
    productService: profile.productService || '',
    workModel: (profile.workModel || 'HYBRID') as 'REMOTE' | 'HYBRID' | 'ONSITE',
    companyOverview: profile.companyOverview || '',
    teamStructure: profile.teamStructure || '',
    workCulture: profile.workCulture || '',
    expectations: profile.expectations || '',
    constraints: profile.constraints || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await updateCompanyProfileAction(userId, formData)

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
              onChange={(e) => setFormData({ ...formData, companyType: e.target.value as any })}
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
              onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })}
              min="1"
              required
            />
          </div>

          <Button
            type="button"
            onClick={() => setStep(2)}
            className="w-full"
          >
            Next: Work Details
          </Button>
        </div>
      )}

      {/* Step 2: Work Details */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Work Details</h2>

          <div>
            <Label>Website (Optional)</Label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label>Work Model</Label>
            <select
              value={formData.workModel}
              onChange={(e) => setFormData({ ...formData, workModel: e.target.value as any })}
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
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Updating Profile...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
