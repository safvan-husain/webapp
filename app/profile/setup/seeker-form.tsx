'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSeekerProfileAction } from '@/lib/actions/profile.actions'
import { showErrorToast } from '@/components/ui/error-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

type WorkHistory = { company: string; role: string; duration: string; description: string }
type Project = { name: string; role: string; description: string; links: string[] }

export default function SeekerProfileForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    skills: [{ name: '', yearsOfExperience: 0, proficiency: 'INTERMEDIATE' as const }],
    workHistory: [] as WorkHistory[],
    projects: [] as Project[],
    jobType: [] as string[],
    locationPreference: '',
    remotePreference: 'ANY' as const,
    links: { github: '', portfolio: '', linkedin: '', other: [] as string[] },
  })

  const addWorkHistory = () => {
    setFormData({
      ...formData,
      workHistory: [...formData.workHistory, { company: '', role: '', duration: '', description: '' }]
    })
  }

  const removeWorkHistory = (index: number) => {
    setFormData({
      ...formData,
      workHistory: formData.workHistory.filter((_, i) => i !== index)
    })
  }

  const updateWorkHistory = (index: number, field: keyof WorkHistory, value: string) => {
    const updated = [...formData.workHistory]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, workHistory: updated })
  }

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', role: '', description: '', links: [] }]
    })
  }

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    })
  }

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updated = [...formData.projects]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, projects: updated })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Clean up data - only include non-empty work history and projects
    const cleanedData = {
      ...formData,
      workHistory: formData.workHistory.filter(wh => wh.company && wh.role && wh.duration),
      projects: formData.projects.filter(p => p.name && p.role && p.description),
    }

    const result = await createSeekerProfileAction(userId, cleanedData)

    if (!result.success) {
      showErrorToast(result.error!)
      setLoading(false)
    } else {
      toast.success('Profile created successfully!')
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-8">
      {/* Step 1: Skills & Preferences */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Skills & Preferences</h2>
          
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
            type="button"
            onClick={() => setStep(2)}
            disabled={formData.jobType.length === 0}
            className="w-full"
          >
            Next: Work History
          </Button>
        </div>
      )}

      {/* Step 2: Work History */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Work History</h2>
            <Button type="button" onClick={addWorkHistory} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {formData.workHistory.length === 0 && (
            <p className="text-sm text-muted-foreground">No work history added yet. Click "Add" to include your experience.</p>
          )}

          {formData.workHistory.map((wh, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3 relative">
              <Button
                type="button"
                onClick={() => removeWorkHistory(index)}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>

              <div>
                <Label>Company</Label>
                <Input
                  type="text"
                  value={wh.company}
                  onChange={(e) => updateWorkHistory(index, 'company', e.target.value)}
                  placeholder="Company name"
                  required
                />
              </div>

              <div>
                <Label>Role</Label>
                <Input
                  type="text"
                  value={wh.role}
                  onChange={(e) => updateWorkHistory(index, 'role', e.target.value)}
                  placeholder="Your role"
                  required
                />
              </div>

              <div>
                <Label>Duration</Label>
                <Input
                  type="text"
                  value={wh.duration}
                  onChange={(e) => updateWorkHistory(index, 'duration', e.target.value)}
                  placeholder="e.g., 2020-2023 or 2 years"
                  required
                />
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <textarea
                  value={wh.description}
                  onChange={(e) => updateWorkHistory(index, 'description', e.target.value)}
                  placeholder="Brief description of your responsibilities"
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
                />
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1">
              Back
            </Button>
            <Button type="button" onClick={() => setStep(3)} className="flex-1">
              Next: Projects
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Projects */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projects</h2>
            <Button type="button" onClick={addProject} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {formData.projects.length === 0 && (
            <p className="text-sm text-muted-foreground">No projects added yet. Click "Add" to showcase your work.</p>
          )}

          {formData.projects.map((project, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3 relative">
              <Button
                type="button"
                onClick={() => removeProject(index)}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>

              <div>
                <Label>Project Name</Label>
                <Input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  placeholder="Project name"
                  required
                />
              </div>

              <div>
                <Label>Your Role</Label>
                <Input
                  type="text"
                  value={project.role}
                  onChange={(e) => updateProject(index, 'role', e.target.value)}
                  placeholder="e.g., Lead Developer, Designer"
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  placeholder="Describe the project and your contributions"
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors min-h-[80px]"
                  required
                />
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(2)} variant="outline" className="flex-1">
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
