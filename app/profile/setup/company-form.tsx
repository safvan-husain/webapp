'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompanyProfileAction } from '@/lib/actions/profile.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DynamicLinkInput } from '@/components/forms/dynamic-link-input'
import type { CompanyLinksInput } from '@/components/forms/dynamic-link-input'
import { toast } from 'sonner'

export default function CompanyProfileForm({ userId, teamSize }: { userId: string; teamSize: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'BUSINESS' as const,
    industry: '',
    teamSize: 1,
    workModel: 'HYBRID' as const,
    links: {
      website: '',
      product: '',
      other: [],
    } as CompanyLinksInput,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const sanitizedLinks = {
      website: formData.links.website.trim(),
      product: formData.links.product.trim(),
      other: formData.links.other.filter((link) => link.trim() !== ''),
    }

    const result = await createCompanyProfileAction(userId, {
      ...formData,
      links: sanitizedLinks,
    })

    if (!result.success) {
      showErrorToast(result.error!)
      setLoading(false)
    } else {
      toast.success('Profile created successfully!')
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Company Information</h2>
        
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

        <DynamicLinkInput
          links={formData.links}
          onChange={(links) => setFormData((prev) => ({ ...prev, links }))}
        />

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

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Profile...' : 'Complete Profile'}
        </Button>
      </div>
    </form>
  )
}
