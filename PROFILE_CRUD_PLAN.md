# Profile CRUD Implementation Plan

## 📊 Current State Analysis

### ✅ Already Implemented

#### Backend (Complete)
- **Validation Schemas** (`lib/validations/profile.schema.ts`)
  - ✅ Seeker: Skills, work history, projects, job preferences, links
  - ✅ Company: Company info, founder profile, work culture
  - ✅ Create and Update schemas for both types

- **Services** (`lib/services/profile.service.ts`)
  - ✅ `createSeekerProfile()` - Create seeker profile
  - ✅ `updateSeekerProfile()` - Update seeker profile
  - ✅ `getSeekerProfile()` - Get seeker profile by userId
  - ✅ `createCompanyProfile()` - Create company profile
  - ✅ `updateCompanyProfile()` - Update company profile
  - ✅ `getCompanyProfile()` - Get company profile by userId

- **Server Actions** (`lib/actions/profile.actions.ts`)
  - ✅ `createSeekerProfileAction()` - With validation & error handling
  - ✅ `updateSeekerProfileAction()` - With validation & error handling
  - ✅ `createCompanyProfileAction()` - With validation & error handling
  - ✅ `updateCompanyProfileAction()` - With validation & error handling

- **Queries** (`lib/queries/profile.queries.ts`)
  - ✅ `getUserWithProfile()` - Get user with profile (cached)
  - ✅ `getSeekerProfileById()` - Get seeker profile by ID
  - ✅ `getCompanyProfileById()` - Get company profile by ID
  - ✅ `checkProfileExists()` - Check if profile exists

#### Frontend (Partial)
- **Profile Setup** (`app/profile/setup/`)
  - ✅ Setup page with user type detection
  - ✅ Seeker form (multi-step: skills → work history → projects)
  - ✅ Company form (single step: basic info)
  - ✅ Form validation and error handling with toast notifications

- **Profile View** (`app/profile/page.tsx`)
  - ✅ Display all user account information
  - ✅ Display seeker profile (skills, preferences, work history, projects)
  - ✅ Display company profile (company info, culture, expectations)
  - ✅ Back to dashboard button

- **Dashboard Integration**
  - ✅ "View Profile" button on dashboard
  - ✅ Navigation between dashboard and profile

---

## 🚧 Missing Features (To Implement)

### 1. Profile Edit Functionality ⚠️ HIGH PRIORITY

**Missing:**
- ❌ Edit profile page (`/profile/edit`)
- ❌ Pre-populated edit forms for both user types
- ❌ Update actions integration
- ❌ "Edit Profile" button on profile view page

**Required Pages:**
- `app/profile/edit/page.tsx` - Main edit page with user type detection
- `app/profile/edit/seeker-form.tsx` - Pre-populated seeker edit form
- `app/profile/edit/company-form.tsx` - Pre-populated company edit form

---

### 2. Item Deletion (Experiences, Projects, Skills) ⚠️ MEDIUM PRIORITY

**Missing:**
- ❌ Delete individual work history entries
- ❌ Delete individual projects
- ❌ Delete individual skills
- ❌ Confirmation dialog for item deletion
- ❌ Update actions to handle array item removal

**Note:** Users should be able to remove specific items from their profile arrays (work history, projects, skills) without deleting the entire profile. This requires:
- Delete buttons on each item in edit forms
- Confirmation before deletion
- Update the profile with the modified array

---

### 3. Enhanced Profile Setup ⚠️ MEDIUM PRIORITY

**Current Limitations:**
- Company form is too basic (only 6 fields)
- Missing optional fields: productService, companyOverview, teamStructure, workCulture, expectations, constraints, founderProfile
- Seeker form missing: vision, longTermGoals, workingStyle, culturePreferences, problemSolvingApproach

**Improvements Needed:**
- Multi-step company form (like seeker form)
- Add optional "deep dive" fields for both types
- Better UX for complex nested objects (founder profile, links)

---

### 4. Profile Completion Status ⚠️ MEDIUM PRIORITY

**Missing:**
- ❌ Profile completion percentage indicator
- ❌ Visual progress bar on profile page
- ❌ Suggestions for incomplete sections
- ❌ Badge/indicator on dashboard showing profile completeness

**Use Case:**
- Encourage users to complete their profiles
- Show "80% complete - Add your vision to finish"

---

### 5. Profile Privacy Settings ⚠️ LOW PRIORITY

**Missing:**
- ❌ Public/private profile toggle
- ❌ Field-level visibility controls
- ❌ "Who can see my profile" settings

---

## 🎯 Implementation Roadmap

### Phase 1: Core CRUD Completion (HIGH PRIORITY)

**Goal:** Complete the basic CRUD operations

#### Task 1.1: Profile Edit Pages
- [ ] Create `app/profile/edit/page.tsx`
  - Fetch existing profile data
  - Detect user type and show appropriate form
  - Handle "no profile" case (redirect to setup)

- [ ] Create `app/profile/edit/seeker-form.tsx`
  - Copy structure from setup form
  - Pre-populate all fields with existing data
  - Use `updateSeekerProfileAction` instead of create
  - Handle partial updates (only changed fields)

- [ ] Create `app/profile/edit/company-form.tsx`
  - Copy structure from setup form
  - Pre-populate all fields with existing data
  - Use `updateCompanyProfileAction` instead of create
  - Handle partial updates

- [ ] Add "Edit Profile" button to `app/profile/page.tsx`
  - Link to `/profile/edit`
  - Styled consistently with existing buttons

**Estimated Time:** 4-6 hours

---

#### Task 1.2: Enhanced Company Setup Form
- [ ] Convert company setup to multi-step form
  - Step 1: Basic Info (name, type, industry, team size)
  - Step 2: Work Details (website, work model, product/service)
  - Step 3: Culture & Expectations (overview, culture, expectations)
  - Step 4: Founder Profile (optional, for small teams)

- [ ] Add all missing fields from schema
- [ ] Improve UX for nested objects (founder profile, links)

**Estimated Time:** 3-4 hours

---

#### Task 1.3: Enhanced Seeker Setup Form
- [ ] Add optional "deep dive" step after projects
  - Vision & long-term goals
  - Working style preferences
  - Culture preferences
  - Problem-solving approach

- [ ] Add links section (GitHub, portfolio, LinkedIn)

**Estimated Time:** 2-3 hours

---

### Phase 2: Profile Enhancements (MEDIUM PRIORITY)

#### Task 2.1: Profile Completion Indicator
- [ ] Create utility function to calculate completion percentage
  - Check required vs optional fields
  - Return percentage and missing fields list

- [ ] Add progress bar component to profile page
  - Visual indicator (0-100%)
  - List of incomplete sections
  - "Complete your profile" CTA

- [ ] Add completion badge to dashboard
  - Small indicator showing percentage
  - Link to profile edit for incomplete profiles

**Estimated Time:** 2-3 hours

---

#### Task 2.2: Profile Validation & Error Handling
- [ ] Add client-side validation for all forms
  - Real-time field validation
  - Show errors before submission
  - Disable submit until valid

- [ ] Improve error messages
  - More specific validation errors
  - Field-level error display
  - Success messages after updates

**Estimated Time:** 2-3 hours

---

### Phase 3: Advanced Features (LOW PRIORITY)

#### Task 3.1: Item Deletion in Edit Forms
- [ ] Add delete functionality to work history items
  - Delete button on each work history card
  - Confirmation dialog before deletion
  - Update profile array after removal

- [ ] Add delete functionality to project items
  - Delete button on each project card
  - Confirmation dialog before deletion
  - Update profile array after removal

- [ ] Add delete functionality to skills
  - Delete button on each skill
  - Confirmation dialog before deletion
  - Update profile array after removal
  - Ensure at least one skill remains (validation)

- [ ] Create reusable confirmation dialog component
  - `components/ui/confirm-dialog.tsx`
  - Used for all item deletions
  - "Are you sure?" message with item details

**Estimated Time:** 2-3 hours

**Note:** This uses existing `updateSeekerProfileAction` and `updateCompanyProfileAction` - no new backend actions needed. Simply pass the updated array with the item removed.

---

#### Task 3.2: Profile Privacy Settings
- [ ] Add privacy fields to Prisma schema
  - `isPublic` boolean
  - `visibilitySettings` JSON

- [ ] Create privacy settings page
  - Toggle public/private
  - Field-level visibility controls

- [ ] Update queries to respect privacy settings

**Estimated Time:** 4-5 hours

---

## 📋 Implementation Checklist

### Immediate Next Steps (Start Here)

1. **Profile Edit - Seeker**
   - [ ] Create edit page structure
   - [ ] Build pre-populated form
   - [ ] Connect to update action
   - [ ] Test with existing profiles

2. **Profile Edit - Company**
   - [ ] Create edit page structure
   - [ ] Build pre-populated form
   - [ ] Connect to update action
   - [ ] Test with existing profiles

3. **UI Integration**
   - [ ] Add "Edit Profile" button to profile view
   - [ ] Add navigation breadcrumbs
   - [ ] Test full user flow: view → edit → save → view

4. **Enhanced Setup Forms**
   - [ ] Expand company setup form (multi-step)
   - [ ] Add missing fields to seeker form
   - [ ] Improve UX for complex fields

---

## 🎨 UI/UX Considerations

### Design Patterns to Follow

1. **Consistency**
   - Edit forms should match setup forms visually
   - Use same components (Input, Label, Button)
   - Maintain color scheme and spacing

2. **User Feedback**
   - Loading states during save
   - Success toast after updates
   - Error toast with expandable details (already implemented)

3. **Navigation**
   - Clear back buttons
   - Breadcrumbs: Dashboard → Profile → Edit
   - Cancel button (discard changes)

4. **Form UX**
   - Multi-step for complex forms
   - Progress indicator for multi-step
   - Save draft functionality (future)
   - Auto-save (future)

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Profile Creation:**
- [ ] Seeker can create profile with minimal data
- [ ] Seeker can create profile with full data
- [ ] Company can create profile with minimal data
- [ ] Company can create profile with full data
- [ ] Validation errors display correctly
- [ ] Redirect to dashboard after creation

**Profile Viewing:**
- [ ] Profile displays all data correctly
- [ ] Empty fields handled gracefully
- [ ] Navigation buttons work
- [ ] Responsive on mobile

**Profile Editing:**
- [ ] Edit form pre-populates correctly
- [ ] Can update individual fields
- [ ] Can update all fields
- [ ] Validation works on edit
- [ ] Changes persist after save
- [ ] Can cancel without saving

**Error Handling:**
- [ ] Network errors handled
- [ ] Validation errors displayed
- [ ] Server errors show toast with details
- [ ] Can copy error details

---

## 📦 Required Components

### New Components Needed

1. **Confirmation Dialog** (for item deletion)
   - `components/ui/confirm-dialog.tsx`
   - Modal with confirm/cancel
   - Used for deleting work history, projects, skills
   - Shows item details in confirmation message

2. **Progress Bar** (for completion indicator)
   - `components/ui/progress.tsx`
   - Visual percentage indicator
   - Color-coded (red → yellow → green)

3. **Form Field Array** (for dynamic lists)
   - Reusable component for work history, projects, skills
   - Add/remove buttons
   - Delete confirmation integrated
   - Validation per item

---

## 🔧 Technical Decisions

### 1. Edit Form Strategy

**Option A: Separate Edit Forms** (RECOMMENDED)
- Pros: Clean separation, easier to maintain
- Cons: Code duplication with setup forms

**Option B: Shared Forms with Mode Prop**
- Pros: DRY principle, single source of truth
- Cons: More complex logic, harder to customize

**Decision:** Use Option A for simplicity and maintainability.

---

### 2. Update Strategy

**Option A: Full Object Update**
- Send entire profile object on update
- Simpler logic
- More data transfer

**Option B: Partial Update** (RECOMMENDED)
- Only send changed fields
- More efficient
- Requires change tracking

**Decision:** Use Option B - already implemented in update services.

---

### 3. Item Deletion Strategy

**Approach: Array Filtering + Profile Update**
- Remove item from local state array
- Call existing `updateProfileAction` with modified array
- No new backend endpoints needed
- Confirmation dialog before deletion

**Implementation:**
```typescript
const handleDeleteWorkHistory = async (index: number) => {
  const confirmed = await showConfirmDialog('Delete this work experience?')
  if (!confirmed) return
  
  const updatedWorkHistory = workHistory.filter((_, i) => i !== index)
  await updateSeekerProfileAction(userId, { workHistory: updatedWorkHistory })
}
```

**Decision:** Use existing update actions - no new delete actions needed.

---

## 📈 Success Metrics

After implementation, measure:
- Profile completion rate (% of users with complete profiles)
- Edit frequency (how often users update profiles)
- Time to complete profile (from signup to 100% complete)
- Error rate (validation errors, server errors)

---

## 🚀 Quick Start Guide

### To implement Profile Edit (Phase 1, Task 1.1):

1. **Create edit page:**
   ```bash
   # Create file: app/profile/edit/page.tsx
   ```

2. **Fetch existing profile:**
   ```typescript
   const user = await getUserWithProfile()
   if (!user?.refObjectId) redirect('/profile/setup')
   ```

3. **Create edit forms:**
   ```bash
   # Create files:
   # app/profile/edit/seeker-form.tsx
   # app/profile/edit/company-form.tsx
   ```

4. **Pre-populate forms:**
   ```typescript
   const [formData, setFormData] = useState(user.seekerProfile)
   ```

5. **Connect to update actions:**
   ```typescript
   const result = await updateSeekerProfileAction(userId, formData)
   ```

6. **Add edit button to profile page:**
   ```typescript
   <Link href="/profile/edit">
     <Button>Edit Profile</Button>
   </Link>
   ```

---

## 📝 Notes

- All backend CRUD operations are complete and tested
- Focus on frontend implementation
- Follow existing patterns (error handling, toast notifications)
- Maintain consistency with current UI/UX
- Test thoroughly before moving to next phase

---

**Last Updated:** 2025-11-30
**Status:** Ready for implementation
**Priority:** Phase 1 (Profile Edit) - HIGH
