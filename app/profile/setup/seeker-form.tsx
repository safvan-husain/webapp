'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSeekerProfileAction } from '@/lib/actions/profile.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function SeekerProfileForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

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

    const result = await createSeekerProfileAction(userId, formData)

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
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Skills & Experience</h2>
          
          <div>
            <Label>Primary Skill</Label>
            <Input
              type="text"
              value={formData.skills[0].name}
              onChange={(e) => setFormData({
                ...formData,
                skills: [{ ...formData.skills[0], name: e.target.value }]
              })}
              placeholder="e.g., React, Node.js, Python"
              required
            />
          </div>

          <div>
            <Label>Years of Experience</Label>
            <Input
              type="number"
              value={formData.skills[0].yearsOfExperience}
              onChange={(e) => setFormData({
                ...formData,
                skills: [{ ...formData.skills[0], yearsOfExperience: Number(e.target.value) }]
              })}
              min="0"
              required
            />
          </div>

          <div>
            <Label className="mb-2">Job Type Preferences</Label>
            <div className="space-y-2">
              {['FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONSULTING', 'STARTUP'].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
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
                    className="mr-2 cursor-pointer"
                  />
                  <span className="text-sm">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Remote Preference</Label>
            <select
              value={formData.remotePreference}
              onChange={(e) => setFormData({ ...formData, remotePreference: e.target.value as any })}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            >
              <option value="ANY">Any</option>
              <option value="REMOTE">Remote Only</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading || formData.jobType.length === 0}
            className="w-full"
          >
            {loading ? 'Creating Profile...' : 'Complete Profile'}
          </Button>
        </div>
      )}
    </form>
  )
}
