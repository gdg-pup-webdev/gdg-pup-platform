# Layout Primitives

Layout primitives are the foundational building blocks for creating consistent, responsive layouts across the GDG PUP Platform. These components replace hardcoded utility classes with semantic, theme-aware primitives that automatically respond to design system changes.

## Table of Contents

- [Why Primitives?](#why-primitives)
- [Available Primitives](#available-primitives)
  - [Stack](#stack)
  - [Inline](#inline)
  - [Grid](#grid)
  - [Box](#box)
  - [Container](#container)
  - [Text](#text)
- [Common Patterns](#common-patterns)
- [Migration Guide](#migration-guide)

---

## Why Primitives?

### The Problem with Hardcoded Classes

❌ **Before (Hardcoded):**

```tsx
<div className="flex flex-col gap-4">
  <div className="text-2xl font-semibold">Title</div>
  <p className="text-base text-gray-600">Description</p>
</div>
```

**Problems:**

- Magic numbers (`gap-4` = 16px) - hard to understand intent
- Design changes require find-and-replace across entire codebase
- No semantic meaning - `flex flex-col` doesn't communicate intent
- Easy to create inconsistencies

### The Solution: Layout Primitives

✅ **After (Primitives):**

```tsx
<Stack gap="md">
  <Text variant="heading-3">Title</Text>
  <Text variant="body" color="muted">
    Description
  </Text>
</Stack>
```

**Benefits:**

- Semantic meaning - `Stack` communicates vertical layout
- Theme integration - `gap="md"` uses design tokens
- Single source of truth - design changes propagate automatically
- Easier for junior developers to understand
- Less code, more readable

---

## Available Primitives

### Stack

**Purpose:** Vertical layout with consistent spacing between children.

**When to use:**

- Form fields stacked vertically
- Card content sections
- Navigation menu items
- Any vertical list of items

**Props:**

- `gap`: `"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"` (default: `"md"`)
- `align`: `"start" | "center" | "end" | "stretch"` (default: `"start"`)
- `justify`: `"start" | "center" | "end" | "between" | "around"` (default: `"start"`)
- `width`: `"auto" | "full"` (default: `"auto"`)
- `as`: Render as different element (default: `"div"`)

**Examples:**

```tsx
// Form layout
<Stack gap="lg">
  <Stack gap="xs">
    <Text as="label" variant="label">Email</Text>
    <Input type="email" />
  </Stack>
  <Stack gap="xs">
    <Text as="label" variant="label">Password</Text>
    <Input type="password" />
  </Stack>
  <Button>Sign In</Button>
</Stack>

// Card content
<Card>
  <Stack gap="md">
    <Text variant="heading-4">Card Title</Text>
    <Text variant="body">Card description goes here.</Text>
    <Button variant="primary">Action</Button>
  </Stack>
</Card>

// Centered layout
<Stack gap="md" align="center" justify="center">
  <Icon name="success" />
  <Text variant="heading-3">Success!</Text>
  <Text variant="body" color="muted">Your action was completed.</Text>
</Stack>
```

**Migration:**

```tsx
// Before
<div className="flex flex-col gap-4 items-center">
  {children}
</div>

// After
<Stack gap="md" align="center">
  {children}
</Stack>
```

---

### Inline

**Purpose:** Horizontal layout with consistent spacing, supports wrapping.

**When to use:**

- Navigation links
- Button groups
- Tag lists
- Icon + text combinations
- Breadcrumbs

**Props:**

- `gap`: `"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"` (default: `"md"`)
- `align`: `"start" | "center" | "end" | "baseline" | "stretch"` (default: `"center"`)
- `justify`: `"start" | "center" | "end" | "between" | "around"` (default: `"start"`)
- `wrap`: `boolean` (default: `false`)
- `as`: Render as different element (default: `"div"`)

**Examples:**

```tsx
// Navigation
<Inline gap="lg" as="nav">
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
  <Link href="/contact">Contact</Link>
</Inline>

// Button group
<Inline gap="sm">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</Inline>

// Tag list with wrapping
<Inline gap="sm" wrap>
  {tags.map(tag => (
    <Badge key={tag}>{tag}</Badge>
  ))}
</Inline>

// Icon + text
<Inline gap="xs" align="center">
  <Icon name="user" />
  <Text variant="body">John Doe</Text>
</Inline>

// Header with space between
<Inline justify="between" align="center">
  <Text variant="heading-2">Dashboard</Text>
  <Button>New Event</Button>
</Inline>
```

**Migration:**

```tsx
// Before
<div className="flex items-center gap-2">
  {children}
</div>

// After
<Inline gap="sm" align="center">
  {children}
</Inline>
```

---

### Grid

**Purpose:** CSS Grid layout with defined columns and responsive support.

**When to use:**

- Product grids
- Image galleries
- Dashboard cards
- Feature showcases
- Any multi-column layout

**Props:**

- `columns`: `1 | 2 | 3 | 4 | 5 | 6` (default: `3`)
- `gap`: `"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"` (default: `"md"`)
- `align`: `"start" | "center" | "end" | "stretch"` (default: `"stretch"`)
- `justify`: `"start" | "center" | "end" | "between" | "around"` (default: `"start"`)
- `as`: Render as different element (default: `"div"`)

**Examples:**

```tsx
// Product grid
<Grid columns={3} gap="lg">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</Grid>

// Dashboard stats
<Grid columns={4} gap="md">
  <StatCard title="Users" value="1,234" />
  <StatCard title="Events" value="56" />
  <StatCard title="Revenue" value="$12,345" />
  <StatCard title="Growth" value="+23%" />
</Grid>

// Responsive grid (use className override)
<Grid columns={3} gap="md" className="md:grid-cols-2 sm:grid-cols-1">
  {items.map(item => (
    <Card key={item.id}>{item.title}</Card>
  ))}
</Grid>

// Image gallery
<Grid columns={4} gap="sm">
  {images.map(img => (
    <img key={img.id} src={img.url} alt={img.alt} className="aspect-square object-cover" />
  ))}
</Grid>
```

**Migration:**

```tsx
// Before
<div className="grid grid-cols-3 gap-4">
  {children}
</div>

// After
<Grid columns={3} gap="md">
  {children}
</Grid>
```

---

### Box

**Purpose:** Generic container with maximum flexibility for padding, margin, width, height, display, and position.

**When to use:**

- Custom layouts not covered by other primitives
- Spacers and dividers
- Wrapper elements
- When you need precise control over spacing

**Props:**

- `padding`: `"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"` (default: `"none"`)
- `margin`: `"none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"` (default: `"none"`)
- `width`: `"auto" | "full" | "screen" | "banner"` (default: `"auto"`)
- `height`: `"auto" | "full" | "screen" | "banner"` (default: `"auto"`)
- `display`: `"block" | "inline" | "inline-block" | "flex" | "grid" | "none"` (default: `"block"`)
- `position`: `"static" | "relative" | "absolute" | "fixed" | "sticky"` (default: `"static"`)
- `as`: Render as different element (default: `"div"`)

**Examples:**

```tsx
// Spacer
<Box margin="lg" />

// Card-like container
<Box padding="lg" className="bg-white border rounded-lg">
  <Text variant="heading-4">Custom Card</Text>
  <Box margin="sm" />
  <Text variant="body">Content goes here</Text>
</Box>

// Full-width hero
<Box padding="2xl" width="full" className="bg-primary text-primary-foreground">
  <Text variant="display">Welcome</Text>
</Box>

// Flex container
<Box display="flex" padding="md" className="gap-4">
  <Box className="flex-1">Left</Box>
  <Box className="flex-1">Right</Box>
</Box>

// Sticky header
<Box position="sticky" className="top-0 z-10 bg-white border-b">
  <Container>
    <Text variant="heading-4">Sticky Header</Text>
  </Container>
</Box>
```

**Migration:**

```tsx
// Before
<div className="p-4 m-2">
  {children}
</div>

// After
<Box padding="md" margin="sm">
  {children}
</Box>
```

---

### Container

**Purpose:** Max-width centered container for content areas.

**When to use:**

- Page sections
- Article content
- Form containers
- Any content that should be centered with a max-width

**Props:**

- `maxWidth`: `"xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" | "screen"` (default: `"7xl"`)
- `padding`: `"none" | "sm" | "md" | "lg"` (default: `"md"`)
- `as`: Render as different element (default: `"div"`)

**Examples:**

```tsx
// Page section
<Container>
  <Stack gap="lg">
    <Text variant="heading-1">Page Title</Text>
    <Text variant="body">Page content goes here...</Text>
  </Stack>
</Container>

// Narrow form
<Container maxWidth="md" padding="lg">
  <Stack gap="lg">
    <Text variant="heading-2">Sign Up</Text>
    <FormFields />
  </Stack>
</Container>

// Article layout
<Container maxWidth="4xl" padding="lg">
  <article>
    <Text variant="display">Article Title</Text>
    <Box margin="md" />
    <Text variant="body-lg">Introduction paragraph...</Text>
    <Box margin="lg" />
    <Text variant="body">Article content...</Text>
  </article>
</Container>

// Multiple widths on page
<>
  <Box className="bg-primary text-primary-foreground">
    <Container maxWidth="7xl">
      <Text variant="heading-1">Hero Section</Text>
    </Container>
  </Box>
  <Container maxWidth="4xl">
    <Text variant="body">Narrower content section</Text>
  </Container>
</>
```

**Migration:**

```tsx
// Before
<div className="max-w-7xl mx-auto px-4">
  {children}
</div>

// After
<Container maxWidth="7xl">
  {children}
</Container>
```

---

### Text

**Purpose:** Typography primitive for all text content.

**When to use:**

- **Always** - Replace all direct text rendering with Text component
- Headings, paragraphs, labels, captions
- Any text that appears in the UI

**Props:**

- `variant`: Typography style
  - `"display"` - Hero headlines (48px)
  - `"heading-1"` through `"heading-5"` - Section headings
  - `"body"`, `"body-lg"`, `"body-sm"` - Paragraph text
  - `"caption"` - Small text
  - `"label"` - Form labels
- `color`: Semantic color
  - `"default"`, `"primary"`, `"secondary"`, `"muted"`
  - `"success"`, `"warning"`, `"error"`
  - `"on-primary"`, `"on-secondary"` - For colored backgrounds
- `align`: `"left" | "center" | "right" | "justify"` (default: `"left"`)
- `weight`: `"normal" | "medium" | "semibold" | "bold"` (override variant weight)
- `truncate`: `boolean` - Single line truncation with ellipsis
- `clamp`: `1 | 2 | 3 | 4 | "none"` - Multi-line truncation
- `as`: Render as different element (auto-selected based on variant)

**Examples:**

```tsx
// Heading hierarchy
<Stack gap="lg">
  <Text variant="display">Hero Headline</Text>
  <Text variant="heading-1">Page Title</Text>
  <Text variant="heading-2">Section Title</Text>
  <Text variant="heading-3">Subsection</Text>
</Stack>

// Body text with colors
<Stack gap="md">
  <Text variant="body">Default body text</Text>
  <Text variant="body" color="muted">Secondary information</Text>
  <Text variant="body" color="error">Error message</Text>
</Stack>

// Form labels
<Stack gap="xs">
  <Text as="label" variant="label">Email Address</Text>
  <Input type="email" />
  <Text variant="caption" color="muted">We'll never share your email.</Text>
</Stack>

// Truncated text
<Text variant="body" clamp={2}>
  Long description that will be truncated after 2 lines...
</Text>

// Semantic HTML
<Text as="h1" variant="heading-1">Page Title</Text>
<Text as="p" variant="body">Paragraph content</Text>
<Text as="span" variant="caption">Inline caption</Text>

// Status messages
<Inline gap="sm" align="center">
  <Icon name="check" className="text-success" />
  <Text variant="body" color="success">Operation successful</Text>
</Inline>
```

**Migration:**

```tsx
// Before
<h1 className="text-4xl font-bold">Title</h1>
<p className="text-base text-gray-600">Description</p>

// After
<Text variant="heading-1">Title</Text>
<Text variant="body" color="muted">Description</Text>
```

---

## Common Patterns

### Page Layout

```tsx
<Container>
  <Stack gap="2xl">
    {/* Header */}
    <Stack gap="sm">
      <Text variant="heading-1">Dashboard</Text>
      <Text variant="body-lg" color="muted">
        Welcome back, John!
      </Text>
    </Stack>

    {/* Stats Grid */}
    <Grid columns={4} gap="md">
      <StatCard title="Users" value="1,234" />
      <StatCard title="Events" value="56" />
      <StatCard title="Revenue" value="$12,345" />
      <StatCard title="Growth" value="+23%" />
    </Grid>

    {/* Content Section */}
    <Stack gap="md">
      <Text variant="heading-2">Recent Activity</Text>
      <Stack gap="sm">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </Stack>
    </Stack>
  </Stack>
</Container>
```

### Card Component

```tsx
export function EventCard({ event }: EventCardProps) {
  return (
    <Box
      padding="lg"
      className="bg-white border rounded-lg hover:shadow-md transition-shadow"
    >
      <Stack gap="md">
        {/* Image */}
        <Box className="aspect-video bg-gray-200 rounded" />

        {/* Content */}
        <Stack gap="sm">
          <Text variant="heading-4">{event.title}</Text>
          <Text variant="body" color="muted" clamp={2}>
            {event.description}
          </Text>
        </Stack>

        {/* Metadata */}
        <Inline gap="md" justify="between" align="center">
          <Inline gap="xs" align="center">
            <Icon name="calendar" />
            <Text variant="body-sm" color="muted">
              {event.date}
            </Text>
          </Inline>
          <Badge>{event.category}</Badge>
        </Inline>

        {/* Actions */}
        <Inline gap="sm">
          <Button variant="primary" size="sm">
            Register
          </Button>
          <Button variant="ghost" size="sm">
            Learn More
          </Button>
        </Inline>
      </Stack>
    </Box>
  );
}
```

### Form Layout

```tsx
<Container maxWidth="md">
  <Stack gap="2xl">
    {/* Header */}
    <Stack gap="sm">
      <Text variant="heading-2">Create Event</Text>
      <Text variant="body" color="muted">
        Fill out the details below
      </Text>
    </Stack>

    {/* Form Fields */}
    <Stack gap="lg">
      <Stack gap="xs">
        <Text as="label" variant="label" htmlFor="title">
          Event Title
        </Text>
        <Input id="title" placeholder="Enter event title" />
      </Stack>

      <Stack gap="xs">
        <Text as="label" variant="label" htmlFor="description">
          Description
        </Text>
        <Textarea id="description" rows={4} />
      </Stack>

      <Grid columns={2} gap="md">
        <Stack gap="xs">
          <Text as="label" variant="label">
            Start Date
          </Text>
          <Input type="date" />
        </Stack>
        <Stack gap="xs">
          <Text as="label" variant="label">
            End Date
          </Text>
          <Input type="date" />
        </Stack>
      </Grid>

      <Inline gap="sm" justify="end">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Create Event</Button>
      </Inline>
    </Stack>
  </Stack>
</Container>
```

### Navigation Header

```tsx
<Box position="sticky" className="top-0 z-50 bg-white border-b">
  <Container>
    <Box padding="md">
      <Inline justify="between" align="center">
        {/* Logo */}
        <Text variant="heading-4">GDG PUP</Text>

        {/* Nav Links */}
        <Inline gap="lg" as="nav">
          <Link href="/">Home</Link>
          <Link href="/events">Events</Link>
          <Link href="/about">About</Link>
        </Inline>

        {/* Actions */}
        <Inline gap="sm">
          <Button variant="ghost">Sign In</Button>
          <Button variant="primary">Sign Up</Button>
        </Inline>
      </Inline>
    </Box>
  </Container>
</Box>
```

---

## Migration Guide

### Step-by-Step Process

1. **Import primitives:**

   ```tsx
   import {
     Stack,
     Inline,
     Grid,
     Box,
     Container,
     Text,
   } from "@packages/spark-ui";
   ```

2. **Identify patterns:**
   - `flex flex-col` → `Stack`
   - `flex` → `Inline`
   - `grid` → `Grid`
   - Generic wrapper → `Box`
   - `max-w-* mx-auto` → `Container`
   - Any text → `Text`

3. **Replace incrementally:**
   - Start with simple cases (single component)
   - Move to complex layouts (nested primitives)
   - Test after each change

### Common Replacements

| Before                                | After                              |
| ------------------------------------- | ---------------------------------- |
| `className="flex flex-col gap-4"`     | `<Stack gap="md">`                 |
| `className="flex items-center gap-2"` | `<Inline gap="sm" align="center">` |
| `className="grid grid-cols-3 gap-4"`  | `<Grid columns={3} gap="md">`      |
| `className="p-4"`                     | `<Box padding="md">`               |
| `className="max-w-4xl mx-auto"`       | `<Container maxWidth="4xl">`       |
| `className="text-2xl font-semibold"`  | `<Text variant="heading-3">`       |

### Migration Checklist

- [ ] Replace all `flex flex-col` with `Stack`
- [ ] Replace all `flex` (horizontal) with `Inline`
- [ ] Replace all `grid` with `Grid`
- [ ] Replace all max-width containers with `Container`
- [ ] Replace all text elements with `Text`
- [ ] Replace generic wrappers with `Box`
- [ ] Remove hardcoded spacing classes
- [ ] Test responsive behavior
- [ ] Verify design system compliance

---

## Best Practices

### ✅ DO

- Use primitives for all layouts
- Combine primitives for complex layouts
- Use semantic variants (`gap="md"` not `gap-4`)
- Use `Text` for all text content
- Nest primitives when needed

### ❌ DON'T

- Don't use hardcoded flex/grid classes
- Don't mix primitives with old patterns
- Don't use magic number classes (`gap-4`, `p-3`)
- Don't render text without `Text` component
- Don't fight the system - if you need something custom, use `Box`

### When to use `className`

Primitives support `className` for:

- Tailwind utilities not covered by props (e.g., `hover:`, `focus:`)
- Background colors and borders
- Responsive overrides
- One-off styles

```tsx
// ✅ Good - primitives + className for custom styles
<Stack gap="md" className="bg-white border rounded-lg">
  <Text variant="heading-4">Title</Text>
</Stack>

// ❌ Bad - using className for things props handle
<div className="flex flex-col gap-4">
  <h4 className="text-xl font-semibold">Title</h4>
</div>
```

---

## Next Steps

1. **Explore Storybook**: View all primitive examples at `/storybook`
2. **Start migrating**: Begin with simple pages/components
3. **Reference tokens**: See [Theme Tokens guide](./07-theme-tokens.md)
4. **Ask for help**: Questions? Check docs or ask the team

---

## Related Documentation

- [Theme Tokens Reference](./07-theme-tokens.md)
- [Theme Cheat Sheet](./THEME_CHEAT_SHEET.md)
- [SparkUI Components](./README.md)
- [Frontend Roadmap](../../UPDATED_FRONTEND_ROADMAP.md)
