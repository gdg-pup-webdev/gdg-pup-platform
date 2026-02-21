**[⬅️ Previous: Adding & Changing Components](./06-adding-and-changing-components.md)** | **[Back to Spark UI Docs](./README.md)**

---

# Theme Tokens Reference

**Last Updated:** February 18, 2026  
**Token Count:** 100+ design tokens  
**Location:** `configs/tailwind-config/shared-styles.css`

---

## What Are Theme Tokens?

Theme tokens are **named design values** that define the visual language of the application. Instead of hardcoding colors, spacing, or typography, we use tokens that can be updated globally.

### Why Use Tokens?

**Without Tokens (Bad):**

```tsx
// ❌ Hardcoded - requires manual updates everywhere
<div className="bg-blue-500 text-white p-4 rounded-lg">
  <h2 className="text-xl font-bold mb-2">Hello</h2>
</div>
```

**With Tokens (Good):**

```tsx
// ✅ Token-based - update once, applies everywhere
<Card variant="primary">
  <CardTitle>Hello</CardTitle>
</Card>
```

**Benefits:**

- 🎨 **Consistent design** across all features
- ⚡ **Fast design updates** (change 1 value, update entire app)
- 🔄 **Theme support** (light/dark mode, brand variations)
- 📖 **Clear visual language** (named values are self-documenting)

---

## Token Categories

### 1. Semantic Color Tokens

Semantic colors define **what** a color represents, not **how** it looks.

| Token         | Purpose                          | Example Use                    |
| ------------- | -------------------------------- | ------------------------------ |
| `primary`     | Main brand color, primary CTAs   | Primary buttons, links         |
| `secondary`   | Accent brand color               | Secondary buttons, tags        |
| `accent`      | Interactive highlights           | Hover states, selections       |
| `destructive` | Errors, dangerous actions        | Delete buttons, error alerts   |
| `success`     | Success states, positive actions | Success alerts, checkmarks     |
| `warning`     | Warning states                   | Warning alerts, caution badges |
| `info`        | Informational states             | Info alerts, help tooltips     |
| `muted`       | Subtle backgrounds               | Disabled states, placeholders  |
| `card`        | Default card background          | Card components                |
| `border`      | Default border color             | Dividers, outlines             |

**Current Values:**

```css
--color-primary: #2a8af6; /* GDG Blue */
--color-primary-foreground: #ffffff;
--color-secondary: #a853ba; /* GDG Purple */
--color-destructive: #e92a67; /* GDG Red */
--color-success: #10b981; /* Green */
--color-warning: #f59e0b; /* Amber */
```

**Usage in Components:**

```tsx
// SparkUI components use semantic tokens automatically
<Button variant="primary">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Alert variant="success">Success message</Alert>
```

**Usage in Custom Styles:**

```tsx
// When you need custom styling (rare)
<div className="bg-primary text-primary-foreground">
  Custom component using tokens
</div>
```

---

### 2. Neutral Color Scale

Gray shades for text hierarchy, subtle backgrounds, and borders.

| Token      | Hex     | Use Case                 |
| ---------- | ------- | ------------------------ |
| `gray-50`  | #f9fafb | Lightest background      |
| `gray-100` | #f3f4f6 | Light background         |
| `gray-200` | #e5e7eb | Borders, subtle dividers |
| `gray-300` | #d1d5db | Input borders            |
| `gray-400` | #9ca3af | Placeholder text         |
| `gray-500` | #6b7280 | Secondary text           |
| `gray-600` | #4b5563 | Body text                |
| `gray-700` | #374151 | Emphasized text          |
| `gray-800` | #1f2937 | Headings                 |
| `gray-900` | #111827 | Primary text             |
| `gray-950` | #030712 | Darkest elements         |

**When to Use:**

- **gray-400-500:** Placeholder text, disabled states
- **gray-600-700:** Body text, secondary content
- **gray-800-900:** Headings, primary content
- **gray-100-300:** Backgrounds, borders

**Example:**

```tsx
<Text variant="body" className="text-gray-600">
  Secondary information
</Text>
<Text variant="heading" className="text-gray-900">
  Primary heading
</Text>
```

---

### 3. Spacing Scale

Consistent spacing for margins, padding, and gaps.

| Token        | Value   | Pixels | Common Use              |
| ------------ | ------- | ------ | ----------------------- |
| `spacing-1`  | 0.25rem | 4px    | Tight spacing           |
| `spacing-2`  | 0.5rem  | 8px    | `xs` - Small gaps       |
| `spacing-3`  | 0.75rem | 12px   | `sm` - Compact padding  |
| `spacing-4`  | 1rem    | 16px   | `md` - Default spacing  |
| `spacing-6`  | 1.5rem  | 24px   | `lg` - Section gaps     |
| `spacing-8`  | 2rem    | 32px   | `xl` - Large spacing    |
| `spacing-12` | 3rem    | 48px   | `2xl` - Section padding |

**Semantic Names:**

```css
--spacing-xs: 8px --spacing-sm: 12px --spacing-md: 16px --spacing-lg: 24px
  --spacing-xl: 32px --spacing-2xl: 48px;
```

**Usage with Layout Primitives:**

```tsx
// Use semantic names with primitives (coming in Phase 2)
<Stack gap="md">...</Stack>        {/* 16px gap */}
<Inline gap="sm">...</Inline>      {/* 12px gap */}
<Box padding="lg">...</Box>        {/* 24px padding */}
```

**⚠️ Important:**

- Always use spacing tokens, never arbitrary values
- ❌ Bad: `className="gap-2"` (arbitrary)
- ✅ Good: `<Stack gap="sm">` (semantic)

---

### 4. Typography Scale

Font sizes, weights, and line heights for text hierarchy.

#### Font Sizes

| Token            | Value    | Pixels | Use Case         |
| ---------------- | -------- | ------ | ---------------- |
| `font-size-xs`   | 0.75rem  | 12px   | Captions, labels |
| `font-size-sm`   | 0.875rem | 14px   | Secondary text   |
| `font-size-base` | 1rem     | 16px   | Body text        |
| `font-size-lg`   | 1.125rem | 18px   | Emphasized body  |
| `font-size-xl`   | 1.25rem  | 20px   | Subheadings      |
| `font-size-2xl`  | 1.5rem   | 24px   | H3 headings      |
| `font-size-3xl`  | 1.875rem | 30px   | H2 headings      |
| `font-size-4xl`  | 2.25rem  | 36px   | H1 headings      |
| `font-size-5xl`  | 3rem     | 48px   | Display text     |

#### Font Weights

| Token                  | Value | Use Case        |
| ---------------------- | ----- | --------------- |
| `font-weight-normal`   | 400   | Body text       |
| `font-weight-medium`   | 500   | Emphasized text |
| `font-weight-semibold` | 600   | Subheadings     |
| `font-weight-bold`     | 700   | Headings        |

**Usage with Text Component (Phase 2):**

```tsx
<Text variant="heading-1">Main Heading</Text>      {/* 36px, bold */}
<Text variant="heading-2">Subheading</Text>        {/* 24px, semibold */}
<Text variant="body">Body text</Text>              {/* 16px, normal */}
<Text variant="caption">Small caption</Text>       {/* 12px, normal */}
```

---

### 5. Border Radii

Rounded corner values for consistent shapes.

| Token         | Value    | Pixels | Use Case        |
| ------------- | -------- | ------ | --------------- |
| `radius-sm`   | 0.125rem | 2px    | Tight corners   |
| `radius-base` | 0.25rem  | 4px    | Default buttons |
| `radius-md`   | 0.375rem | 6px    | Cards, inputs   |
| `radius-lg`   | 0.5rem   | 8px    | Large cards     |
| `radius-xl`   | 0.75rem  | 12px   | Modals, panels  |
| `radius-2xl`  | 1rem     | 16px   | Hero sections   |
| `radius-full` | 9999px   | Full   | Avatars, pills  |

**Component Defaults:**

- Buttons: `radius-base` (4px)
- Cards: `radius-lg` (8px)
- Inputs: `radius-md` (6px)
- Avatars: `radius-full`

---

### 6. Shadows

Elevation levels for depth and hierarchy.

| Token          | Use Case          | Example             |
| -------------- | ----------------- | ------------------- |
| `shadow-xs`    | Subtle elevation  | Input focus         |
| `shadow-sm`    | Low elevation     | Badges, pills       |
| `shadow-base`  | Default elevation | Default cards       |
| `shadow-md`    | Medium elevation  | Elevated cards      |
| `shadow-lg`    | High elevation    | Dropdowns, tooltips |
| `shadow-xl`    | Highest elevation | Modals, dialogs     |
| `shadow-inner` | Inset depth       | Pressed buttons     |

**Component Usage:**

```tsx
<Card variant="default">...</Card>    {/* shadow-sm */}
<Card variant="elevated">...</Card>   {/* shadow-md */}
```

---

### 7. Transitions & Animations

Timing values for smooth interactions.

| Token             | Value | Use Case            |
| ----------------- | ----- | ------------------- |
| `duration-fast`   | 150ms | Quick state changes |
| `duration-base`   | 200ms | Default transitions |
| `duration-slow`   | 300ms | Smooth animations   |
| `duration-slower` | 500ms | Complex animations  |

**Easing Functions:**

- `ease-linear` - Constant speed
- `ease-in` - Accelerating
- `ease-out` - Decelerating (most common)
- `ease-in-out` - Smooth start and end

---

## How to Use Tokens

### ✅ Good: Using Tokens via Components

**Best approach** - Use SparkUI components that implement tokens automatically:

```tsx
import { Card, CardTitle, CardContent, Button } from "@packages/spark-ui";

function EventCard({ event }) {
  return (
    <Card variant="elevated">
      <CardContent>
        <CardTitle>{event.title}</CardTitle>
        <Button variant="primary">Register</Button>
      </CardContent>
    </Card>
  );
}
```

### ✅ Acceptable: Using Token Classes

When building custom components, use token-based Tailwind classes:

```tsx
// Using semantic color tokens
<div className="bg-primary text-primary-foreground">

// Using neutral scale
<div className="text-gray-600 border-gray-200">

// Using spacing tokens
<div className="p-4 gap-6">  {/* spacing-4, spacing-6 */}
```

### ❌ Bad: Hardcoding Values

**Never do this:**

```tsx
// ❌ Hardcoded colors
<div className="bg-blue-500 text-white">

// ❌ Arbitrary spacing
<div className="p-[20px] gap-[14px]">

// ❌ Arbitrary typography
<h2 className="text-[22px] font-[650]">
```

---

## Token Quick Reference

### Most Commonly Used Tokens

**Colors:**

- `bg-primary` / `text-primary-foreground`
- `bg-secondary` / `text-secondary-foreground`
- `bg-muted` / `text-muted-foreground`
- `text-gray-600` (body text)
- `text-gray-900` (headings)
- `border-border` (dividers)

**Spacing:**

- `gap-4` (16px) - default gap
- `gap-6` (24px) - section gap
- `p-4` (16px) - default padding
- `p-6` (24px) - card padding

**Typography:**

- `text-base` (16px) - body
- `text-lg` (18px) - emphasized
- `text-xl` (20px) - subheading
- `text-2xl` (24px) - heading

**Borders:**

- `rounded-md` - cards, inputs
- `rounded-lg` - large components
- `rounded-full` - avatars

---

## Updating Tokens

### When Hi-Fi Designs Arrive

**Step 1: Update Color Tokens**

```css
/* configs/tailwind-config/shared-styles.css */
@theme {
  --color-primary: #NEW_PRIMARY_COLOR;
  --color-secondary: #NEW_SECONDARY_COLOR;
  /* ... */
}
```

**Step 2: Test**

- All components update automatically
- Run visual regression tests
- Check for any edge cases

**Step 3: Done!**

- No feature code changes needed
- No component refactoring required

### Custom Token Values

If you need to add new tokens:

1. Add to `shared-styles.css`:

```css
@theme {
  --color-brand-purple: #7c3aed;
}
```

2. Use in components:

```tsx
<div className="bg-[--color-brand-purple]">
```

3. Or add as Tailwind class in `tailwind.config.js` (if needed)

---

## Token Naming Conventions

### Semantic vs. Descriptive

**✅ Semantic (Good):**

- `--color-primary` (describes purpose)
- `--color-destructive` (describes meaning)
- `--spacing-md` (describes relative size)

**❌ Descriptive (Avoid):**

- `--color-blue-500` (describes appearance)
- `--color-delete-button-red` (too specific)

### Foreground Pairing

Many tokens have `-foreground` variants:

- `--color-primary` (background)
- `--color-primary-foreground` (text on that background)

This ensures text is always readable on colored backgrounds.

---

## Dark Mode Support

Theme tokens support dark mode through CSS custom properties. Update in app-level globals.css:

```css
/* apps/nexus-web/src/app/globals.css */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #3b9eff; /* Lighter in dark mode */
    --color-card: #1f2937; /* Dark card background */
    --color-card-foreground: #f9fafb;
  }
}
```

**Note:** Dark mode implementation is out of scope for Phase 1, but tokens are designed to support it.

---

## Learning Resources

**For Junior Developers:**

- [Design Tokens 101](https://css-tricks.com/what-are-design-tokens/) - CSS Tricks guide
- [Why Design Tokens?](https://www.designtokens.org/) - W3C Design Tokens spec
- [Tailwind v4 Theme](https://tailwindcss.com/docs/v4-beta) - Official Tailwind docs

**Questions?**

- Check component examples in Storybook
- Ask in team chat: "Which token should I use for...?"
- Reference this guide when building features

---

## Related Documentation

- [Hi-Fi Readiness Roadmap](../HI_FI_READINESS_ROADMAP.md) - Overall migration plan
- [Component Inventory](../audits/COMPONENT_INVENTORY.md) - Component catalog
- [Using Spark UI](./03-using-spark-ui.md) - Component usage guide
- [Adding Components](./06-adding-and-changing-components.md) - Creating new components

---

**[⬅️ Previous: Adding & Changing Components](./06-adding-and-changing-components.md)** | **[Back to Spark UI Docs](./README.md)**
