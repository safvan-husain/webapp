'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface CompanyLinksInput {
  website: string
  product: string
  other: string[]
}

interface DynamicLinkInputProps {
  links: CompanyLinksInput
  onChange: (links: CompanyLinksInput) => void
  title?: string
  description?: string
}

export function DynamicLinkInput({
  links,
  onChange,
  title = 'Links (Optional)',
  description = 'Share your primary website, product demo, and any additional links.',
}: DynamicLinkInputProps) {
  const updateLinks = (updated: Partial<CompanyLinksInput>) => {
    onChange({ ...links, ...updated })
  }

  const updateOtherLink = (index: number, value: string) => {
    const updatedOther = [...links.other]
    updatedOther[index] = value
    updateLinks({ other: updatedOther })
  }

  const addOtherLink = () => {
    updateLinks({ other: [...links.other, ''] })
  }

  const removeOtherLink = (index: number) => {
    const updatedOther = links.other.filter((_, i) => i !== index)
    updateLinks({ other: updatedOther })
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <Label>Website URL</Label>
          <Input
            type="url"
            value={links.website}
            onChange={(e) => updateLinks({ website: e.target.value })}
            placeholder="https://company.com"
          />
        </div>

        <div className="space-y-1">
          <Label>Product or Demo URL</Label>
          <Input
            type="url"
            value={links.product}
            onChange={(e) => updateLinks({ product: e.target.value })}
            placeholder="https://demo.company.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Additional Links</Label>
            <Button type="button" variant="outline" size="sm" onClick={addOtherLink}>
              + Add Link
            </Button>
          </div>

          {links.other.length === 0 && (
            <p className="text-xs text-muted-foreground">Optional: add more links like blogs or press.</p>
          )}

          <div className="space-y-2">
            {links.other.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => updateOtherLink(index, e.target.value)}
                  placeholder="https://example.com/article"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => removeOtherLink(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
