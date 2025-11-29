# 🎨 UI Design Guidelines

This document defines the **design system and UI conventions** for consistent, accessible, and beautiful interfaces across the application.

---

## 📋 Table of Contents

1. [Color System](#-color-system)
2. [Typography](#-typography)
3. [Spacing & Layout](#-spacing--layout)
4. [Components](#-components)
5. [Shadows & Elevation](#-shadows--elevation)
6. [Borders & Radius](#-borders--radius)
7. [Animations & Transitions](#-animations--transitions)
8. [Accessibility](#-accessibility)
9. [Dark Mode](#-dark-mode)
10. [Component Examples](#-component-examples)

---

## 🎨 Color System

### Semantic Colors

Our color system uses semantic naming for consistency across light and dark modes.

#### Background Colors
```css
background: rgb(var(--background))      /* Main background */
foreground: rgb(var(--foreground))      /* Main text color */
card: rgb(var(--card))                  /* Card backgrounds */
card-foreground: rgb(var(--card-foreground))
```

#### Primary Colors (Brand)
```css
primary: rgb(var(--primary))            /* Primary actions, links */
primary-foreground: rgb(var(--primary-foreground))
```

#### Secondary Colors
```css
secondary: rgb(var(--secondary))        /* Secondary actions */
secondary-foreground: rgb(var(--secondary-foreground))
```

#### Muted Colors (Subtle UI)
```css
muted: rgb(var(--muted))                /* Disabled states, subtle backgrounds */
muted-foreground: rgb(var(--muted-foreground))
```

#### Accent Colors (Highlights)
```css
accent: rgb(var(--accent))              /* Hover states, highlights */
accent-foreground: rgb(var(--accent-foreground))
```

#### Status Colors
```css
destructive: rgb(var(--destructive))    /* Errors, delete actions */
success: rgb(var(--success))            /* Success states */
warning: rgb(var(--warning))            /* Warning states */
```

#### Utility Colors
```css
border: rgb(var(--border))              /* Borders */
input: rgb(var(--input))                /* Input borders */
ring: rgb(var(--ring))                  /* Focus rings */
```

### Usage Guidelines

**DO:**
- Use semantic color names (e.g., `bg-primary`, `text-foreground`)
- Use `text-muted-foreground` for secondary text
- Use `border-border` for all borders
- Use status colors for feedback (success, warning, destructive)

**DON'T:**
- Use hardcoded color values (e.g., `bg-blue-500`)
- Mix semantic and arbitrary colors
- Use colors that don't adapt to dark mode

### Tailwind Classes

```tsx
// Backgrounds
className="bg-background"           // Main background
className="bg-card"                 // Card background
className="bg-muted"                // Subtle background
className="bg-primary"              // Primary button
className="bg-secondary"            // Secondary button
className="bg-destructive"          // Danger button
className="bg-success"              // Success state
className="bg-warning"              // Warning state

// Text
className="text-foreground"         // Main text
className="text-muted-foreground"   // Secondary text
className="text-primary"            // Primary text/links
className="text-destructive"        // Error text
className="text-success"            // Success text
className="text-warning"            // Warning text

// Borders
className="border-border"           // Standard border
className="border-input"            // Input border
className="border-primary"          // Primary border
```

---

## 📝 Typography

### Font Families

```tsx
font-sans    // Geist Sans (default)
font-mono    // Geist Mono (code)
```

### Font Sizes

```tsx
text-xs      // 0.75rem (12px)  - Captions, labels
text-sm      // 0.875rem (14px) - Small text, secondary info
text-base    // 1rem (16px)     - Body text (default)
text-lg      // 1.125rem (18px) - Emphasized text
text-xl      // 1.25rem (20px)  - Small headings
text-2xl     // 1.5rem (24px)   - Section headings
text-3xl     // 1.875rem (30px) - Page headings
text-4xl     // 2.25rem (36px)  - Hero headings
text-5xl     // 3rem (48px)     - Large hero text
```

### Font Weights

```tsx
font-normal     // 400 - Body text
font-medium     // 500 - Emphasized text
font-semibold   // 600 - Headings, buttons
font-bold       // 700 - Strong emphasis
```

### Line Heights

```tsx
leading-none      // 1
leading-tight     // 1.25
leading-snug      // 1.375
leading-normal    // 1.5 (default for body)
leading-relaxed   // 1.625
leading-loose     // 2
```

### Typography Scale

```tsx
// Headings
<h1 className="text-4xl font-bold tracking-tight">Page Title</h1>
<h2 className="text-3xl font-semibold tracking-tight">Section Title</h2>
<h3 className="text-2xl font-semibold">Subsection Title</h3>
<h4 className="text-xl font-semibold">Card Title</h4>
<h5 className="text-lg font-medium">Small Heading</h5>

// Body Text
<p className="text-base leading-relaxed">Regular paragraph text</p>
<p className="text-sm text-muted-foreground">Secondary information</p>

// Labels
<label className="text-sm font-medium">Form Label</label>

// Captions
<span className="text-xs text-muted-foreground">Caption text</span>
```

---

## 📐 Spacing & Layout

### Spacing Scale

Use Tailwind's spacing scale consistently:

```tsx
0     // 0px
0.5   // 2px
1     // 4px
1.5   // 6px
2     // 8px
3     // 12px
4     // 16px
5     // 20px
6     // 24px
8     // 32px
10    // 40px
12    // 48px
16    // 64px
20    // 80px
24    // 96px
```

### Common Spacing Patterns

```tsx
// Component padding
className="p-4"           // Small components (16px)
className="p-6"           // Medium components (24px)
className="p-8"           // Large components (32px)

// Section spacing
className="space-y-4"     // Tight spacing (16px)
className="space-y-6"     // Medium spacing (24px)
className="space-y-8"     // Loose spacing (32px)

// Container padding
className="px-4 py-6"     // Mobile
className="px-6 py-8"     // Tablet
className="px-8 py-12"    // Desktop

// Gap in flex/grid
className="gap-2"         // Tight (8px)
className="gap-4"         // Medium (16px)
className="gap-6"         // Loose (24px)
```

### Layout Containers

```tsx
// Page container
<div className="container mx-auto px-4 py-8 max-w-7xl">
  {/* Content */}
</div>

// Section container
<section className="py-12 md:py-16 lg:py-20">
  {/* Content */}
</section>

// Card container
<div className="p-6 space-y-4">
  {/* Content */}
</div>
```

---

## 🧩 Components

### Buttons

```tsx
// Primary Button
<button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
  Primary Action
</button>

// Secondary Button
<button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">
  Secondary Action
</button>

// Outline Button
<button className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
  Outline Action
</button>

// Ghost Button
<button className="px-4 py-2 rounded-lg font-medium hover:bg-accent transition-colors">
  Ghost Action
</button>

// Destructive Button
<button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors">
  Delete
</button>

// Disabled Button
<button disabled className="px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium cursor-not-allowed opacity-50">
  Disabled
</button>
```

### Button Sizes

```tsx
// Small
className="px-3 py-1.5 text-sm"

// Medium (default)
className="px-4 py-2 text-base"

// Large
className="px-6 py-3 text-lg"
```

### Inputs

```tsx
// Text Input
<input
  type="text"
  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
  placeholder="Enter text..."
/>

// Textarea
<textarea
  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
  rows={4}
  placeholder="Enter description..."
/>

// Select
<select className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Cards

```tsx
// Basic Card
<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-muted-foreground">Card content goes here</p>
</div>

// Interactive Card
<div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
  <h3 className="text-xl font-semibold mb-2">Clickable Card</h3>
  <p className="text-muted-foreground">Hover for effect</p>
</div>

// Card with Header
<div className="bg-card border border-border rounded-lg overflow-hidden">
  <div className="px-6 py-4 border-b border-border">
    <h3 className="text-xl font-semibold">Card Header</h3>
  </div>
  <div className="p-6">
    <p className="text-muted-foreground">Card body content</p>
  </div>
</div>
```

### Badges

```tsx
// Default Badge
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
  Badge
</span>

// Primary Badge
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
  Primary
</span>

// Success Badge
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-success-foreground">
  Success
</span>

// Warning Badge
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning text-warning-foreground">
  Warning
</span>

// Destructive Badge
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
  Error
</span>
```

### Alerts

```tsx
// Info Alert
<div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary">
  <p className="font-medium">Information</p>
  <p className="text-sm mt-1">This is an informational message.</p>
</div>

// Success Alert
<div className="p-4 rounded-lg bg-success/10 border border-success/20 text-success">
  <p className="font-medium">Success</p>
  <p className="text-sm mt-1">Operation completed successfully.</p>
</div>

// Warning Alert
<div className="p-4 rounded-lg bg-warning/10 border border-warning/20 text-warning">
  <p className="font-medium">Warning</p>
  <p className="text-sm mt-1">Please review this information.</p>
</div>

// Error Alert
<div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
  <p className="font-medium">Error</p>
  <p className="text-sm mt-1">Something went wrong.</p>
</div>
```

---

## 🌑 Shadows & Elevation

### Shadow Scale

```tsx
shadow-sm     // Subtle shadow for cards
shadow        // Default shadow
shadow-md     // Medium shadow for elevated elements
shadow-lg     // Large shadow for modals
shadow-xl     // Extra large shadow for popovers
shadow-2xl    // Maximum shadow for dropdowns
```

### Usage

```tsx
// Cards
className="shadow-sm hover:shadow-md transition-shadow"

// Modals
className="shadow-lg"

// Dropdowns
className="shadow-xl"

// Floating elements
className="shadow-2xl"
```

---

## 🔲 Borders & Radius

### Border Radius

```tsx
rounded-none    // 0px
rounded-sm      // 2px
rounded         // 4px
rounded-md      // 6px
rounded-lg      // 8px (default for most components)
rounded-xl      // 12px
rounded-2xl     // 16px
rounded-3xl     // 24px
rounded-full    // 9999px (circles, pills)
```

### Border Widths

```tsx
border          // 1px (default)
border-2        // 2px
border-4        // 4px
border-0        // No border
```

### Usage

```tsx
// Buttons, inputs, cards
className="rounded-lg"

// Badges, pills
className="rounded-full"

// Images
className="rounded-xl"

// Avatars
className="rounded-full"
```

---

## ✨ Animations & Transitions

### Transition Classes

```tsx
// All properties
className="transition-all duration-200"

// Specific properties
className="transition-colors duration-150"
className="transition-transform duration-200"
className="transition-opacity duration-300"
className="transition-shadow duration-200"
```

### Common Patterns

```tsx
// Hover effects
className="hover:bg-accent transition-colors"
className="hover:scale-105 transition-transform"
className="hover:shadow-md transition-shadow"

// Focus effects
className="focus:ring-2 focus:ring-ring focus:outline-none transition-all"

// Active states
className="active:scale-95 transition-transform"
```

### Animation Examples

```tsx
// Fade in
className="animate-in fade-in duration-200"

// Slide in from bottom
className="animate-in slide-in-from-bottom duration-300"

// Spin (loading)
className="animate-spin"

// Pulse (loading)
className="animate-pulse"
```

---

## ♿ Accessibility

### Focus States

Always include visible focus states:

```tsx
className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
```

### ARIA Labels

```tsx
<button aria-label="Close dialog">
  <XIcon />
</button>

<input aria-describedby="email-error" />
<span id="email-error" role="alert">Invalid email</span>
```

### Semantic HTML

```tsx
// Use semantic elements
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<footer>...</footer>

// Use proper heading hierarchy
<h1>Page Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

### Color Contrast

- Ensure text has sufficient contrast (WCAG AA: 4.5:1 for normal text)
- Don't rely on color alone to convey information
- Test with dark mode enabled

---

## 🌓 Dark Mode

### Implementation

Dark mode is handled automatically through CSS variables. All components use semantic color tokens that adapt to the theme.

### Theme Toggle

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

<ThemeToggle />
```

### Testing Dark Mode

1. Click the theme toggle button
2. Test all components in both modes
3. Ensure proper contrast in both themes
4. Check that images/icons work in both modes

### Custom Dark Mode Styles

If needed, use the `dark:` prefix:

```tsx
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-gray-100"
```

**Note:** Prefer semantic tokens over `dark:` prefix when possible.

---

## 📦 Component Examples

### Login Form

```tsx
<div className="w-full max-w-md mx-auto p-6 bg-card border border-border rounded-lg shadow-sm">
  <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
  
  <form className="space-y-4">
    <div>
      <label htmlFor="email" className="block text-sm font-medium mb-1.5">
        Email
      </label>
      <input
        id="email"
        type="email"
        className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="you@example.com"
      />
    </div>
    
    <div>
      <label htmlFor="password" className="block text-sm font-medium mb-1.5">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="••••••••"
      />
    </div>
    
    <button
      type="submit"
      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
    >
      Sign In
    </button>
  </form>
</div>
```

### Dashboard Card

```tsx
<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">Total Users</h3>
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-success-foreground">
      +12%
    </span>
  </div>
  
  <p className="text-3xl font-bold mb-2">1,234</p>
  <p className="text-sm text-muted-foreground">
    +123 from last month
  </p>
</div>
```

### Navigation Bar

```tsx
<nav className="border-b border-border bg-background">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold">App Name</h1>
        
        <div className="hidden md:flex items-center gap-4">
          <a href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </a>
          <a href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            Products
          </a>
          <a href="/settings" className="text-sm font-medium hover:text-primary transition-colors">
            Settings
          </a>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  </div>
</nav>
```

---

## 🎯 Best Practices

### DO:
- Use semantic color tokens (`bg-primary`, `text-foreground`)
- Maintain consistent spacing (4px, 8px, 16px, 24px, 32px)
- Include focus states on all interactive elements
- Test in both light and dark modes
- Use proper heading hierarchy
- Add ARIA labels for icon buttons
- Use transitions for smooth interactions
- Keep border radius consistent (`rounded-lg` for most components)

### DON'T:
- Use hardcoded colors (`bg-blue-500`)
- Mix different spacing scales
- Forget focus states
- Use color alone to convey meaning
- Skip semantic HTML
- Create custom shadows (use the scale)
- Overuse animations
- Ignore accessibility

---

## 🔧 Customization

To customize the design system, edit the CSS variables in `app/globals.css`:

```css
:root {
  --primary: 37 99 235;  /* Change primary color */
  --radius: 0.5rem;      /* Change border radius */
}
```

All components will automatically adapt to the new values.

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Last Updated:** November 2025
