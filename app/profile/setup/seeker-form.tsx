'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSeekerProfileAction } from '@/lib/actions/profile.actions'

export default function SeekerProfileForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    skills: [{ name: '', yearsOfExperience: 0, proficiency: 'INTERMEDIATE' as const }],
    workHistory: [{ company: '', role: '', duration: '', description: '' }],
    projects: [{ name: '', role: '', description: '', links: [] as string[] }],
    jobType: [] as string[],
    locationPreference: '',
    remotePreference: 'ANY' as const,
    links: { github: '', portfolio: '', linkedin: '', other: [] as string[] },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await createSeekerProfileAction(userId, formData)

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

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Skills & Experience</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Primary Skill</label>
            <input
              type="text"
              value={formData.skills[0].name}
              onChange={(e) => setFormData({
                ...formData,
                skills: [{ ...formData.skills[0], name: e.target.value }]
              })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Years of Experience</label>
            <input
              type="number"
              value={formData.skills[0].yearsOfExperience}
              onChange={(e) => setFormData({
                ...formData,
                skills: [{ ...formData.skills[0], yearsOfExperience: Number(e.target.value) }]
              })}
              className="w-full px-3 py-2 border rounded-lg"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Job Type Preferences</label>
            <div className="space-y-2">
              {['FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONSULTING', 'STARTUP'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.jobType.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, jobType: [...formData.jobType, type] })
                      } else {
                        setFormData({ ...formData, jobType: formData.jobType.filter(t => t !== type) })
                      }
                    }}
                    className="mr-2"
                  />
                  {type.replace('_', ' ')}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Remote Preference</label>
            <select
              value={formData.remotePreference}
              onChange={(e) => setFormData({ ...formData, remotePreference: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="ANY">Any</option>
              <option value="REMOTE">Remote Only</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || formData.jobType.length === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </div>
      )}
    </form>
  )
}
