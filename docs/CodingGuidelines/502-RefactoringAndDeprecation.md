**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 502 - Refactoring & Deprecation

## Overview

Refactoring shared code requires care to avoid breaking other teams' work. This guideline outlines safe approaches for evolving the codebase.

## Core Principle

**When refactoring code used by other teams, you are responsible for updating consumer code.**

However, the **recommended approach is to fork and deprecate** rather than performing risky in-place refactoring.

## Recommended Pattern: Fork & Deprecate

### Why Fork Instead of Refactor?

Changing a function's parameters or behavior (a **breaking change**) can break code across multiple teams:

- ✅ **Forking** creates a new version alongside the old
- ✅ **Deprecation** signals to developers to migrate gradually
- ❌ **In-place refactoring** breaks existing consumers immediately

### The Workflow

#### 1. Create the Improved Version

Copy the component/function and create an improved version with a new name.

```typescript
// OLD (soon to be deprecated)
export function SubmitButtonHoveredGreen(props: OldProps) {
  // Original implementation
}

// NEW (improved version)
export function SubmitButtonHoveredDynamicColor(props: NewProps) {
  // Improved implementation with more flexibility
}
```

#### 2. If you intend to fully replace the previous version, mark the Old Version as Deprecated

Rename the old version with a `_DEPRECATED` suffix to discourage new usage.

**Use VS Code's Rename Symbol (F2)** to update all references across the project automatically.

```typescript
// Renamed to signal deprecation
export function SubmitButtonHoveredGreen_DEPRECATED(props: OldProps) {
  // Original implementation
  // TODO: Remove after all consumers migrate to SubmitButtonHoveredDynamicColor
}
```

#### 3. Add Deprecation Warning

Add a clear deprecation comment or decorator:

```typescript
/**
 * @deprecated Use `SubmitButtonHoveredDynamicColor` instead.
 * This component will be removed in v2.0.0
 * 
 * Migration guide: Replace `color="green"` with `color` prop
 */
export function SubmitButtonHoveredGreen_DEPRECATED(props: OldProps) {
  console.warn('SubmitButtonHoveredGreen is deprecated. Use SubmitButtonHoveredDynamicColor instead.');
  // Implementation
}
```

#### 4. Migrate Consumers Gradually

- Update new code to use the improved version
- Create issues/tasks to migrate existing usages
- Remove deprecated code once all consumers have migrated

## Examples

### ✅ Good: Fork and Deprecate Approach

**Before:**
```typescript
// components/SubmitButton.tsx
export function SubmitButton({ label }: { label: string }) {
  return <button className="green-bg">{label}</button>;
}
```

**After (Adding Flexibility):**

```typescript
// components/SubmitButton.tsx

/**
 * @deprecated Use `SubmitButtonDynamic` instead
 * Will be removed in v2.0.0
 */
export function SubmitButton_DEPRECATED({ label }: { label: string }) {
  console.warn('SubmitButton is deprecated. Use SubmitButtonDynamic with color prop.');
  return <button className="green-bg">{label}</button>;
}

// NEW: Improved version with color customization
export function SubmitButtonDynamic({ 
  label, 
  color = 'green' 
}: { 
  label: string; 
  color?: 'green' | 'blue' | 'red';
}) {
  return <button className={`${color}-bg`}>{label}</button>;
}
```

**Consumer Code (Automatically Updated with F2):**

```typescript
// Old usages stillwork but show warnings
<SubmitButton_DEPRECATED label="Submit" />

// New code uses improved version
<SubmitButtonDynamic label="Submit" color="blue" />
```


### ❌ Bad: Breaking Change Without Deprecation

```typescript
// Before: function signature
export function calculatePrice(amount: number): number

// After: breaking change with no deprecation period
export function calculatePrice(amount: number, currency: string): number
//                                              ^^^^^^^^^^^^^^^^ BREAKING!

// This immediately breaks all existing consumers!
```

## When Full Refactoring is Acceptable

You may refactor in-place (without forking) when:

1. **The code is only used in one place** (not shared)
2. **You own all consumer code** and can update it
3. **The change is internal** (implementation detail, not public API)
4. **It's a non-breaking change** (adding optional parameters, improving internals)

## Using VS Code Rename Symbol

**Keyboard shortcut: F2**

1. Place cursor on the symbol name
2. Press `F2`
3. Type the new name (e.g., add `_DEPRECATED` suffix)
4. Press `Enter`
5. VS Code updates all references across the entire project

---

## Related Guidelines

- **[501 - The Grey Area](./501-TheGreyArea.md)** – When to deviate from standard patterns
- **[504 - Documenting Your Code](./504-DocumentingYourCode.md)** – Documenting deprecations
- **[702 - Submitting a Pull Request](./702-SubmittingAPullRequest.md)** – Explaining refactoring in PRs

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
