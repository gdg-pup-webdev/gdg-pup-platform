**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 101 - API Utilities

## Overview

Utility functions are reusable, context-agnostic functions that perform specific operations on data. They must be designed to be extensible and not tied to any specific domain or resource.

## Guidelines

### 1. Return Values and Error Handling

Utility functions can either:
- **Return the expected result** on success
- **Throw an error** when an operation fails

See **[105 - Error Handling](./105-ErrorHandling.md)** for complete error handling patterns.

### 2. Context Independence

**Utilities must not be aware of the context in which they are called.**

This means:
- ✅ A utility operates on **data**, not specific **resources**
- ✅ It should be reusable across multiple domains
- ❌ It should not contain domain-specific business logic

### 3. Extensibility

Design utilities to work with various data types and use cases, not just the immediate need.

## Examples

### ✅ Good: Context-Agnostic Utility

```typescript
// utils/string.utils.ts
/**
 * Converts a string to title case
 * @param input - The string to convert
 * @returns The title-cased string
 */
export function toTitleCase(input: string): string {
  if (!input) throw new Error('Input string cannot be empty');
  
  return input
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Can be used anywhere:
const userName = toTitleCase('john doe');        // "John Doe"
const eventTitle = toTitleCase('gdg meetup');    // "Gdg Meetup"
```

### ❌ Bad: Domain-Specific Utility

```typescript
// This is NOT a utility - it's tied to the User domain
export function formatUserDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

// This should be a method in the User service or a domain-specific helper
```

### ✅ Good: Reusable Validation Utility

```typescript
// utils/validation.utils.ts
/**
 * Validates if a value is within a numeric range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  if (min > max) throw new Error('Min cannot be greater than max');
  return value >= min && value <= max;
}

// Extensible across domains:
isInRange(userAge, 18, 65);           // User validation
isInRange(eventCapacity, 10, 500);    // Event validation
```

## Rationale

By keeping utilities context-independent:
- **Reusability**: The same function can be used across multiple features
- **Testability**: Utilities are easy to unit test in isolation
- **Maintainability**: Changes to one domain don't break utility functions

---

## Related Guidelines

- **[102 - Layered Architecture](./102-LayeredArchitecture.md)** – Where utilities fit in the architecture
- **[105 - Error Handling](./105-ErrorHandling.md)** – Error handling in utilities
- **[505 - Code Structure](./505-CodeStructure.md)** – When to use utilities vs domain logic

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
