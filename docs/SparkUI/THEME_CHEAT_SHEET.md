# Theme Token Quick Reference
**For developers: Print this or keep it handy while coding!**

---

## 🎨 Most Used Color Tokens

```tsx
// Semantic colors (use these!)
bg-primary text-primary-foreground    // Blue primary actions
bg-secondary text-secondary-foreground // Purple secondary actions
bg-destructive text-destructive-foreground // Red errors/delete
bg-success text-success-foreground    // Green success states
bg-muted text-muted-foreground        // Gray subtle backgrounds

// Neutral text colors
text-gray-900  // Headings (darkest)
text-gray-700  // Emphasized text
text-gray-600  // Body text (most common)
text-gray-500  // Secondary text
text-gray-400  // Placeholder text

// Borders
border-border  // Default borders (#e5e7eb)
border-gray-200 // Subtle dividers
```

---

## 📏 Spacing Scale

| Token | Pixels | Semantic | Common Use |
|-------|--------|----------|------------|
| `gap-2` | 8px | `xs` | Tight icon spacing |
| `gap-3` | 12px | `sm` | Compact layouts |
| `gap-4` | 16px | `md` | Default gaps |
| `gap-6` | 24px | `lg` | Section spacing |
| `gap-8` | 32px | `xl` | Large sections |

```tsx
// Examples with layout primitives (Phase 2)
<Stack gap="md">...</Stack>  // 16px vertical gap
<Inline gap="sm">...</Inline> // 12px horizontal gap
<Box padding="lg">...</Box>   // 24px padding
```

---

## 📝 Typography Scale

```tsx
// Font sizes (most common)
text-sm    // 14px - secondary text
text-base  // 16px - body text (default)
text-lg    // 18px - emphasized text
text-xl    // 20px - subheadings
text-2xl   // 24px - H3 headings
text-3xl   // 30px - H2 headings
text-4xl   // 36px - H1 headings

// Font weights
font-normal    // 400 - body text
font-medium    // 500 - emphasized
font-semibold  // 600 - subheadings
font-bold      // 700 - main headings
```

---

## 🔲 Border Radii

```tsx
rounded-sm   // 2px - tight corners
rounded-md   // 6px - inputs, small cards
rounded-lg   // 8px - cards (default)
rounded-xl   // 12px - large cards
rounded-full // circle - avatars, pills
```

---

## 🌑 Shadows

```tsx
shadow-sm   // Subtle - default cards
shadow-md   // Medium - elevated cards
shadow-lg   // High - dropdowns
shadow-xl   // Highest - modals
```

---

## ✅ Good Patterns

```tsx
// Use SparkUI components (best!)
<Card variant="elevated">
  <CardTitle>Event Name</CardTitle>
  <Button variant="primary">Register</Button>
</Card>

// Use semantic tokens
<div className="bg-primary text-primary-foreground p-4">

// Use neutral scale
<p className="text-gray-600">Body text</p>
```

---

## ❌ Don't Do This

```tsx
// ❌ Hardcoded colors
<div className="bg-blue-500 text-white">

// ❌ Arbitrary spacing
<div className="p-[20px] gap-[14px]">

// ❌ Arbitrary values
<h2 className="text-[22px] font-[650]">
```

---

## 🚀 Common Patterns

### Card with Content
```tsx
<Card variant="elevated">
  <CardContent className="p-6 space-y-4">
    <CardTitle>Title</CardTitle>
    <p className="text-gray-600">Description</p>
  </CardContent>
</Card>
```

### Button Variants
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="destructive">Delete</Button>
```

### Text Hierarchy
```tsx
<h1 className="text-4xl font-bold text-gray-900">Main Heading</h1>
<h2 className="text-2xl font-semibold text-gray-800">Subheading</h2>
<p className="text-base text-gray-600">Body text</p>
<span className="text-sm text-gray-500">Secondary info</span>
```

### Spacing Layout
```tsx
<div className="space-y-6">      {/* Vertical spacing */}
  <div className="flex gap-4">   {/* Horizontal spacing */}
    <Button>Action 1</Button>
    <Button>Action 2</Button>
  </div>
</div>
```

---

## 🔍 When in Doubt

1. **Check Storybook** - See how existing components use tokens
2. **Ask Team** - "Which token should I use for...?"
3. **Refer to [Full Docs](./07-theme-tokens.md)** - Complete token reference

---

**Updated:** February 18, 2026  
**Location:** `configs/tailwind-config/shared-styles.css`  
**Full Guide:** [Theme Tokens Reference](./07-theme-tokens.md)
