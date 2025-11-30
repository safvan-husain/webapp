# Company Profile Enhancement Plan

**Goal:** Implement full backend structure utilization for company profiles, collecting all optional fields that are currently missing from the front-end.

---

## 📊 Current State Analysis

### ✅ Fields Currently Collected

**Setup Form (Initial Creation):**
- `companyName` ✅
- `companyType` ✅
- `industry` ✅
- `teamSize` ✅
- `website` ✅ (optional)
- `workModel` ✅

**Edit Form (3-Step Process):**
- All setup fields ✅
- `productService` ✅ (optional)
- `companyOverview` ✅ (optional)
- `teamStructure` ✅ (optional)
- `workCulture` ✅ (optional)
- `expectations` ✅ (optional)
- `constraints` ✅ (optional)

### ❌ Missing Fields (Not Collected by Front-End)

From Prisma Schema `CompanyProfile` model:

1. **`links` (Json)** - Structured links object
   - Currently: Only `website` as a string field
   - Backend supports: `{ website, product, other[] }`
   - Validation schema exists: `CompanyLinksSchema`

2. **`founderProfile` (Json)** - Founder information for companies ≤ 200 employees
   - Fields: `name`, `background`, `vision`, `pastProjects[]`, `philosophy`, `links`
   - Validation schema exists: `FounderProfileSchema`
   - Should be conditionally shown when `teamSize ≤ 200`

---

## 🎯 Implementation Plan

### Phase 1: Add Links Collection

**Objective:** Replace single `website` field with structured `links` object.

#### 1.1 Update Setup Form (`app/profile/setup/company-form.tsx`)

**Changes:**
- Replace single `website` input with expandable links section
- Add fields:
  - Website URL (primary)
  - Product/Demo URL
  - Additional links (dynamic array)

**UI Pattern:**
```tsx
<div className="space-y-3">
  <Label>Links (Optional)</Label>
  <Input name="links.website" placeholder="Company website" />
  <Input name="links.product" placeholder="Product/demo URL" />
  <Button type="button" onClick={addLink}>+ Add Another Link</Button>
  {/* Dynamic link inputs */}
</div>
```

#### 1.2 Update Edit Form (`app/profile/edit/company-form.tsx`)

**Changes:**
- Add links section to Step 2 (Work Details)
- Same structure as setup form
- Pre-populate existing links from profile

---

### Phase 2: Add Founder Profile Collection

**Objective:** Collect founder information for small companies (≤ 200 employees).

#### 2.1 Add Conditional Step to Edit Form

**Logic:**
- Show "Founder Profile" step only if `teamSize ≤ 200`
- Insert as Step 4 (after Culture & Expectations)

**Fields to Add:**
- Founder Name (required if section shown)
- Background (textarea, optional)
- Vision (textarea, optional)
- Past Projects (dynamic array, optional)
- Philosophy (textarea, optional)
- Founder Links:
  - LinkedIn
  - Twitter/X
  - Other links (dynamic array)

**UI Pattern:**
```tsx
{step === 4 && formData.teamSize <= 200 && (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Founder Profile</h2>
    <p className="text-sm text-muted-foreground">
      For companies with 200 or fewer employees, founder information helps candidates understand your vision.
    </p>
    
    <div>
      <Label>Founder Name</Label>
      <Input required />
    </div>
    
    <div>
      <Label>Background (Optional)</Label>
      <textarea placeholder="Your professional background" />
    </div>
    
    {/* Additional fields */}
  </div>
)}
```

#### 2.2 Update Setup Form

**Decision:** Should founder profile be collected during initial setup?

**Recommendation:** No, keep setup minimal. Add to edit form only.
- Reason: Setup should be quick (< 2 minutes)
- Founder profile is detailed and optional
- Users can complete it later via edit

---

### Phase 3: Update Form State Management

#### 3.1 Update Form Data Structure

**Setup Form:**
```tsx
const [formData, setFormData] = useState({
  companyName: '',
  companyType: 'BUSINESS' as const,
  industry: '',
  teamSize: 1,
  workModel: 'HYBRID' as const,
  links: {
    website: '',
    product: '',
    other: [] as string[],
  },
})
```

**Edit Form:**
```tsx
const [formData, setFormData] = useState({
  // ... existing fields
  links: {
    website: profile.links?.website || '',
    product: profile.links?.product || '',
    other: profile.links?.other || [],
  },
  founderProfile: profile.founderProfile ? {
    name: profile.founderProfile.name || '',
    background: profile.founderProfile.background || '',
    vision: profile.founderProfile.vision || '',
    pastProjects: profile.founderProfile.pastProjects || [],
    philosophy: profile.founderProfile.philosophy || '',
    links: {
      linkedin: profile.founderProfile.links?.linkedin || '',
      twitter: profile.founderProfile.links?.twitter || '',
      other: profile.founderProfile.links?.other || [],
    },
  } : null,
})
```

#### 3.2 Handle Dynamic Arrays

**Pattern for "Add Another Link":**
```tsx
const addOtherLink = () => {
  setFormData({
    ...formData,
    links: {
      ...formData.links,
      other: [...formData.links.other, ''],
    },
  })
}

const updateOtherLink = (index: number, value: string) => {
  const newOther = [...formData.links.other]
  newOther[index] = value
  setFormData({
    ...formData,
    links: { ...formData.links, other: newOther },
  })
}

const removeOtherLink = (index: number) => {
  setFormData({
    ...formData,
    links: {
      ...formData.links,
      other: formData.links.other.filter((_, i) => i !== index),
    },
  })
}
```

---

### Phase 4: Update Validation & Backend

#### 4.1 Validation Schema Updates

**Current State:** ✅ Already complete!
- `CompanyLinksSchema` exists
- `FounderProfileSchema` exists
- Both are optional in `CreateCompanyProfileSchema`

**No changes needed** - validation layer is ready.

#### 4.2 Service Layer Updates

**Current State:** ✅ Already complete!
- `createCompanyProfile` handles `links` and `founderProfile`
- `updateCompanyProfile` handles both fields

**No changes needed** - backend is ready.

---

## 🎨 UI/UX Enhancements

### 1. Collapsible Sections

For optional complex fields (links, founder profile), use collapsible sections:

```tsx
<Collapsible>
  <CollapsibleTrigger>
    <Button variant="outline">+ Add Links (Optional)</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    {/* Links form fields */}
  </CollapsibleContent>
</Collapsible>
```

### 2. Progress Indicator

Update step indicator to show founder profile step conditionally:

```tsx
const totalSteps = formData.teamSize <= 200 ? 4 : 3

<div className="flex justify-center gap-2 mb-6">
  {Array.from({ length: totalSteps }).map((_, i) => (
    <div
      key={i}
      className={cn(
        "h-2 w-12 rounded-full",
        i + 1 === step ? "bg-primary" : "bg-muted"
      )}
    />
  ))}
</div>
```

### 3. Conditional Rendering Logic

```tsx
// Step navigation
const nextStep = () => {
  if (step === 3 && formData.teamSize <= 200) {
    setStep(4) // Go to founder profile
  } else {
    // Submit form
  }
}

const prevStep = () => {
  if (step === 4) {
    setStep(3) // Back to culture
  } else if (step === 3) {
    setStep(2)
  } else {
    setStep(1)
  }
}
```

---

## 📋 Implementation Checklist

### Setup Form Updates
- [ ] Replace `website` string with `links` object
- [ ] Add website input field
- [ ] Add product URL input field
- [ ] Add dynamic "other links" array with add/remove
- [ ] Update form submission to send `links` object
- [ ] Test validation with `CompanyLinksSchema`

### Edit Form Updates
- [ ] Add links section to Step 2
- [ ] Pre-populate links from existing profile
- [ ] Add Step 4 for Founder Profile (conditional on `teamSize ≤ 200`)
- [ ] Add founder name input (required if step shown)
- [ ] Add founder background textarea
- [ ] Add founder vision textarea
- [ ] Add founder past projects (dynamic array)
- [ ] Add founder philosophy textarea
- [ ] Add founder links (LinkedIn, Twitter, other)
- [ ] Update step navigation logic
- [ ] Update progress indicator
- [ ] Test conditional rendering based on team size
- [ ] Pre-populate founder profile if exists

### UI Components
- [ ] Create reusable `DynamicLinkInput` component
- [ ] Create reusable `DynamicTextArray` component (for past projects)
- [ ] Add collapsible sections for optional complex fields
- [ ] Ensure responsive design for all new fields
- [ ] Add helpful placeholder text and descriptions

### Testing
- [ ] Test setup form with links
- [ ] Test edit form with links
- [ ] Test founder profile for small companies (teamSize ≤ 200)
- [ ] Test founder profile hidden for large companies (teamSize > 200)
- [ ] Test dynamic array add/remove functionality
- [ ] Test form validation for all new fields
- [ ] Test profile update with new fields
- [ ] Test profile display with new fields

---

## 🚀 Migration Considerations

### Existing Profiles

**Issue:** Existing profiles have `website` as a string, not in `links` object.

**Solution:** Data migration not needed because:
1. Prisma schema has `website` as a separate field
2. New `links` field is separate (Json type)
3. Both can coexist

**Recommendation:** 
- Keep `website` field in schema for backward compatibility
- Use `links.website` going forward
- Display logic: Show `links.website` if exists, fallback to `website`

### Display Logic

```tsx
const displayWebsite = profile.links?.website || profile.website
```

---

## 📊 Expected Outcomes

### Data Completeness
- **Before:** 7/12 fields collected (58%)
- **After:** 12/12 fields collected (100%)

### User Experience
- Richer company profiles
- Better matching for small companies with founder profiles
- More comprehensive company information for job seekers

### Technical Benefits
- Full utilization of backend structure
- No wasted database fields
- Consistent data model across frontend and backend

---

## 🎯 Priority Ranking

### High Priority (Implement First)
1. **Links Collection** - Simple, high value, no conditional logic

### Medium Priority (Implement Second)
2. **Founder Profile** - More complex, conditional, high value for small companies

### Low Priority (Nice to Have)
3. **Data migration script** - Only if needed for existing profiles

---

## 📝 Notes

- All validation schemas already exist ✅
- Backend services already support all fields ✅
- Only frontend forms need updates
- No breaking changes to existing functionality
- Backward compatible with existing profiles
