'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompanyProfileAction } from '@/lib/actions/profile.actions'
import { Alert } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function CompanyProfileForm({ userId, teamSize }: { userId: string; teamSize: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    companyName: '',
    companyType: 'BUSINESS' as const,
    industry: '',
    teamSize: 1,
    website: '',
    workModel: 'HYBRID' as const,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await createCompanyProfileAction(userId, formData)

    if ('error' in result) {
      setError(typeof result.error === 'string' ? result.error : 'Failed to create profile')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-6">
      {error && (
        <Alert variant="destructive" title="Error">
          {error}
        </Alert>
      )}

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

        <div>
          <Label>Website (optional)</Label>
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
