**[⬅️ Previous: Styling & Theming](./05-styling-and-theming.md)** | **[➡️ Next: Theme Tokens](./07-theme-tokens.md)** | **[Back to Spark UI Docs](./README.md)**

---

# Adding & Changing Components

Changes to Spark-UI affect all consuming applications.

## Adding a new component

1. Confirm the component belongs in Spark-UI
2. Implement the component following the standard architecture:
   ```
   ComponentName/
   ├── ComponentName.types.ts    - TypeScript interfaces and types
   ├── ComponentName.styles.ts   - CVA variants using theme tokens
   ├── ComponentName.tsx         - Component implementation with forwardRef
   └── index.ts                  - Barrel export
   ```
3. Add full Storybook documentation
4. Ensure accessibility considerations are met (ARIA attributes, keyboard navigation)
5. Export from the package entry point (`packages/spark-ui/src/index.ts`)

Components without Storybook documentation are considered incomplete.

## Making changes

- Minor visual changes should be communicated
- Breaking changes require coordination
- Storybook must be updated alongside code changes

---

## Component API Reference

### Alert

Displays contextual feedback messages.

```tsx
import { Alert } from "@packages/spark-ui";

<Alert variant="info" size="md">
  Your changes have been saved
</Alert>;
```

**Props:**

- `variant`: "info" | "success" | "warning" | "error"
- `size`: "sm" | "md" | "lg"

---

### Avatar

Displays user profile images with fallback support.

```tsx
import { Avatar } from "@packages/spark-ui";

// With image
<Avatar src="/avatar.jpg" alt="John Doe" size="md" />

// With fallback
<Avatar fallback="JD" size="md" />
```

**Props:**

- `src`: Image URL
- `alt`: Alternative text for image
- `fallback`: Text to show when image fails (defaults to first letter of alt)
- `size`: "sm" | "md" | "lg" | "xl"

---

### Badge

Small status indicators for labels, counts, or categories.

```tsx
import { Badge } from "@packages/spark-ui";

<Badge variant="success" size="md">Active</Badge>
<Badge variant="destructive" size="sm">5</Badge>
```

**Props:**

- `variant`: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "muted"
- `size`: "sm" | "md" | "lg"
- `as`: Polymorphic component type (defaults to "span")

**Use cases:**

- Event categories/tags
- Status indicators
- Notification counts
- Labels

---

### Button

Primary action trigger component.

```tsx
import { Button } from "@packages/spark-ui";

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>;
```

**Props:**

- `variant`: "primary" | "secondary" | "outline" | "ghost" | "destructive"
- `size`: "sm" | "md" | "lg"

---

### Card

Container component for grouping related content.

```tsx
import { Card } from "@packages/spark-ui";

<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>;
```

---

### Checkbox

Form checkbox input with label and validation support.

```tsx
import { Checkbox } from "@packages/spark-ui";

<Checkbox
  label="Accept terms and conditions"
  helperText="You must accept to continue"
  error={hasError}
  errorMessage="This field is required"
  size="md"
/>;
```

**Props:**

- `label`: Label text displayed next to checkbox
- `helperText`: Optional helper text below checkbox
- `error`: Boolean to show error state
- `errorMessage`: Error message to display when error is true
- `size`: "sm" | "md" | "lg"
- All standard input attributes (`checked`, `disabled`, `onChange`, etc.)

**Accessibility:**

- Automatically generates unique IDs for label association
- Supports ARIA attributes
- Includes aria-describedby for helper text and errors

---

### Input

Text input field component.

```tsx
import { Input } from "@packages/spark-ui";

<Input
  type="text"
  placeholder="Enter your name"
  variant="default"
  inputSize="md"
/>;
```

**Props:**

- `variant`: "default" | "error"
- `inputSize`: "sm" | "md" | "lg"

---

### Radio

Form radio input with label and validation support.

```tsx
import { Radio } from "@packages/spark-ui";

<Radio
  label="Option 1"
  name="choice"
  value="option1"
  helperText="This is the first option"
  size="md"
/>;
```

**Props:**

- `label`: Label text displayed next to radio button
- `helperText`: Optional helper text below radio
- `error`: Boolean to show error state
- `errorMessage`: Error message to display
- `size`: "sm" | "md" | "lg"
- All standard input attributes (`name`, `value`, `checked`, `disabled`, etc.)

**Accessibility:**

- Auto-generated IDs for label association
- ARIA support
- Proper radio group semantics

---

### Skeleton

Loading placeholder with animation.

```tsx
import { Skeleton } from "@packages/spark-ui";

// Rectangle
<Skeleton className="h-12 w-full" />

// Circle (for avatars)
<Skeleton variant="circle" className="h-12 w-12" />

// Text line
<Skeleton variant="text" className="w-[250px]" />
```

**Props:**

- `variant`: "default" | "circle" | "text"
- `className`: Custom dimensions (required)

**Use cases:**

- Content loading states
- Card skeletons
- Profile skeletons
- List placeholders

---

### Spinner

Loading spinner indicator.

```tsx
import { Spinner } from "@packages/spark-ui";

<Spinner size="md" />;
```

**Props:**

- `size`: "sm" | "md" | "lg"

---

### Textarea

Multi-line text input with character counting.

```tsx
import { Textarea } from "@packages/spark-ui";

<Textarea
  label="Description"
  placeholder="Enter description..."
  helperText="Max 500 characters"
  maxLength={500}
  showCount
  textareaSize="md"
/>;
```

**Props:**

- `label`: Label text above textarea
- `helperText`: Helper text below textarea
- `error`: Boolean for error state
- `errorMessage`: Error message to display
- `maxLength`: Maximum character limit
- `showCount`: Show character counter (requires maxLength)
- `textareaSize`: "sm" | "md" | "lg"
- All standard textarea attributes

**Features:**

- Character counter (when maxLength and showCount are set)
- Error state styling
- Adjustable min-height based on size

---

### Tabs

Organize content into switchable panels.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@packages/spark-ui";

<Tabs defaultValue="tab1">
  <TabsList variant="default">
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Overview content</TabsContent>
  <TabsContent value="tab2">Details content</TabsContent>
</Tabs>;
```

**Components:**

- `Tabs`: Container with controlled/uncontrolled state management
- `TabsList`: Container for tab triggers
- `TabsTrigger`: Individual tab button
- `TabsContent`: Content panel for each tab

**TabsList Props:**

- `variant`: "default" | "pills"

**Tabs Props:**

- `defaultValue`: Default active tab (uncontrolled)
- `value`: Controlled active tab value
- `onValueChange`: Callback when tab changes

**Features:**

- Controlled and uncontrolled modes
- Two visual variants (default with underline, pills with background)
- ARIA compliant (role="tablist", role="tab", role="tabpanel")
- Keyboard navigation support

---

### Tooltip

Display additional information on hover or focus.

```tsx
import { Tooltip } from "@packages/spark-ui";

<Tooltip content="This is helpful information" side="top">
  <button>Hover me</button>
</Tooltip>;
```

**Props:**

- `content`: Tooltip text or content (required)
- `side`: "top" | "right" | "bottom" | "left"
- `showArrow`: Boolean to display arrow pointer

**Features:**

- Hover and focus triggers
- Four positioning options
- Fade in/out animations
- Keyboard accessible (shows on focus)
- Theme token styling

**Use cases:**

- Help text for icons
- Additional context for buttons
- Explanations for form fields
- Feature descriptions

---

### Toast

Display temporary notifications.

```tsx
import { ToastProvider, useToast } from "@packages/spark-ui";

// Wrap app with provider
<ToastProvider>
  <App />
</ToastProvider>;

// Use in components
const { addToast } = useToast();

addToast({
  title: "Success",
  description: "Your changes have been saved",
  variant: "success",
  duration: 5000,
});
```

**Toast Props:**

- `title`: Toast title text
- `description`: Additional description text
- `variant`: "default" | "success" | "warning" | "destructive"
- `duration`: Auto-dismiss time in ms (0 = no auto-dismiss)
- `action`: Optional action button `{ label: string; onClick: () => void }`

**Hook API:**

```tsx
const { addToast, removeToast, clearToasts } = useToast();

// Add a toast
const id = addToast({ title: "Hello" });

// Remove specific toast
removeToast(id);

// Clear all toasts
clearToasts();
```

**Features:**

- Context-based toast management
- Multiple toasts stacking
- Auto-dismiss with configurable duration
- Action buttons
- Four visual variants matching theme
- Slide and fade animations
- Manual dismiss with close button

**Architecture:**

- `ToastProvider`: Context provider (wrap app root)
- `useToast`: Hook to trigger toasts from anywhere
- `Toast`: Individual toast component (rendered by provider)

---

## Form Components Best Practices

Form components (Checkbox, Radio, Textarea, Input) share common patterns:

### Validation

```tsx
const [errors, setErrors] = useState({});

<Checkbox
  label="Agree to terms"
  error={!!errors.terms}
  errorMessage={errors.terms}
/>;
```

### Accessibility

All form components:

- Generate unique IDs automatically using `useId()`
- Connect labels with inputs via `htmlFor`/`id`
- Link helper text and errors via `aria-describedby`
- Support `aria-invalid` for error states

### Sizing

All components support consistent size props:

- `sm`: Compact size for dense UIs
- `md`: Default size for most use cases
- `lg`: Large size for emphasis or accessibility

---

## Architecture Guidelines

All Spark-UI components follow these principles:

### 1. Theme Tokens Only

Never use hardcoded colors or spacing:

```tsx
// ❌ Bad
className = "bg-blue-500 text-white";

// ✅ Good
className = "bg-primary text-primary-foreground";
```

### 2. CVA for Variants

Use `class-variance-authority` for managing variant styles:

```tsx
// ComponentName.styles.ts
import { cva } from "class-variance-authority";

export const componentStyles = cva("base-classes", {
  variants: {
    variant: {
      default: "variant-classes",
      secondary: "secondary-classes",
    },
    size: {
      sm: "size-small-classes",
      md: "size-medium-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
```

### 3. Forward Refs

All components should forward refs:

```tsx
export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={className} {...props} />;
  },
);

Component.displayName = "Component";
```

### 4. TypeScript First

Provide comprehensive type definitions:

```tsx
export interface ComponentProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentStyles> {
  // Additional props
}
```

### 5. JSDoc Documentation

Include examples in JSDoc:

````tsx
/**
 * A brief description of the component.
 *
 * @example
 * ```tsx
 * <Component variant="primary" size="md">
 *   Content
 * </Component>
 * ```
 */
````

---

**[⬅️ Previous: Styling & Theming](./05-styling-and-theming.md)** | **[➡️ Next: Theme Tokens](./07-theme-tokens.md)** | **[Back to Spark UI Docs](./README.md)**
