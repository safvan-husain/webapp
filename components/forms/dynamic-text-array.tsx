'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DynamicTextArrayProps {
  label: string
  values: string[]
  placeholder?: string
  description?: string
  onChange: (values: string[]) => void
}

export function DynamicTextArray({ label, values, onChange, placeholder, description }: DynamicTextArrayProps) {
  const updateValue = (index: number, value: string) => {
    const updated = [...values]
    updated[index] = value
    onChange(updated)
  }

  const addValue = () => {
    onChange([...values, ''])
  }

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addValue}>
          + Add
        </Button>
      </div>

      {values.length === 0 && (
        <p className="text-xs text-muted-foreground">Start by adding your first entry.</p>
      )}

      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => updateValue(index, e.target.value)}
              placeholder={placeholder}
            />
            <Button type="button" variant="ghost" className="shrink-0" onClick={() => removeValue(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
