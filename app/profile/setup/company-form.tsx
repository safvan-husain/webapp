'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompanyProfileAction } from '@/lib/actions/profile.actions'

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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Company Information</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Company Type</label>
          <select
            value={formData.companyType}
            onChange={(e) => setFormData({ ...formData, companyType: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="BUSINESS">Business</option>
            <option value="STARTUP">Startup</option>
            <option value="SOLO_FOUNDER">Solo Founder</option>
            <option value="CLIENT">Client</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Team Size</label>
          <input
            type="number"
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Website (optional)</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Work Model</label>
          <select
            value={formData.workModel}
            onChange={(e) => setFormData({ ...formData, workModel: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating Profile...' : 'Complete Profile'}
        </button>
      </div>
    </form>
  )
}
