**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 504 - Documenting Your Code

## Overview

**Some code doesn't need documentation** – it should be self-documenting. However, when context or structure isn't enough to explain what code does, follow these guidelines.

## Core Principle

**Strive for self-documenting code first.** Add documentation only when necessary.

## When Documentation is Needed

Documentation is appropriate when:
- The **why** isn't obvious from the code itself
- Complex algorithms or business logic require explanation
- Workarounds for library bugs or limitations
- Performance optimizations that sacrifice clarity
- Public APIs or shared utilities

## Documentation Guidelines

### Classes

**Put a summary at the top of each class** explaining what it is for

```typescript
/**
 * UserService handles all user-related business logic.
 * 
 * This service manages user CRUD operations, authentication status,
 * and profile updates. It coordinates between the UserRepository
 * and external services like email notifications. 
 */
export class UserService {
  // Implementation
}
```

### Functions and Methods

**Put a summary at the top** explaining:
- What it does 
- High-level steps of the process (if complex)

```typescript
/**
 * Registers a user for an event with capacity and duplicate checks.
 * 
 * This method:
 * 1. Validates the user and event exist
 * 2. Checks if the event has available capacity
 * 3. Ensures the user isn't already registered
 * 4. Creates the registration record
 * 5. Sends a confirmation email 
 */
async registerUserForEvent(userId: string, eventId: string): Promise<Registration> {
  // Implementation
}
```

### Variable Declarations

**Variable names should be clear enough** to understand their purpose.

```typescript
// ✅ Good: No comment needed
const maxRetryAttempts = 3;
const userRegistrationDate = new Date();

// ❌ Bad: Needs comment because name is unclear
const x = 3;  // maximum retry attempts
const d = new Date();  // user registration date
```

**Avoid comments before each variable** unless there's strong justification.

**You can comment on groups of related variables:**

```typescript
// Database configuration
const dbHost = process.env.DB_HOST;
const dbPort = parseInt(process.env.DB_PORT);
const dbName = process.env.DB_NAME;
const dbMaxConnections = 20;

// Email service configuration
const emailApiKey = process.env.EMAIL_API_KEY;
const emailFromAddress = 'noreply@example.com';
const emailRetryAttempts = 3;
```

### Code Blocks

**Small code blocks** should be clear and understandable without comments.

```typescript
// ✅ Good: Self-explanatory
if(!user.isVerified) {
  throw new ForbiddenError('Email must be verified');
}
```

**For large or complex code blocks**, add a summary at the top explaining the purpose and steps.

```typescript
/**
 * PERFORMANCE OPTIMIZATION: Batch processing
 * 
 * Process users in batches of 100 to avoid memory issues with large datasets.
 * We discovered that processing all users at once causes heap overflow with
 * 10K+ users due to holding all user objects in memory simultaneously.
 * 
 * Batching reduces memory usage from ~2GB to ~50MB while only adding
 * negligible processing time (~0.5s per 10K users).
 */
const batchSize = 100;
for (let i = 0; i < users.length; i += batchSize) {
  const batch = users.slice(i, i + batchSize);
  await Promise.all(batch.map(user => processUser(user)));
  
  // Allow garbage collection between batches
  await new Promise(resolve => setTimeout(resolve, 10));
}
```

### Explaining the "Why"

**If code does something unusual**, the documentation **must explain the "Why"**.

Developers can see **what** the code does by reading it, but they can't see:
- The history that led to this implementation
- Constraints or limitations being worked around
- Why obvious-seeming alternatives don't work

```typescript
/**
 * WORKAROUND: Supabase RLS policy limitation
 * 
 * Why we're manually filtering instead of using a query:
 * Supabase's Row Level Security (RLS) doesn't support complex joins
 * between the events and registrations tables with our current schema.
 * 
 * Attempting to filter in the query results in "insufficient permissions"
 * errors because RLS evaluates before the join completes.
 * 
 * This manual filter is ~10ms slower but guarantees correct permissions.
 * We're tracking a schema migration to fix this properly in issue #456.
 */
const events = await this.getAllEvents();
const userVisibleEvents = events.filter(event => 
  this.canUserViewEvent(userId, event)
);
```

## Examples

### ✅ Good: Function Documentation

```typescript
/**
 * Calculates total price after applying tier-based discounts.
 * 
 * Bronze tier: 5% off
 * Silver tier: 10% off  
 * Gold tier: 15% off
 * 
 * Note: Discount does not apply to items already on sale (salePrice set).
 * This business rule was confirmed with Product team on 2024-01-15.
 */
function calculateDiscountedPrice(user: User, item: Item): number {
  if (item.salePrice) {
    return item.salePrice;
  }
  
  const discount = this.getDiscountForTier(user.tier);
  return item.price * (1 - discount);
}
```

### ✅ Good: Algorithm Documentation

```typescript
/**
 * Implements exponential backoff for API retries.
 * 
 * Wait time = (2 ^ attempt) * baseDelay, capped at maxDelay
 * 
 * Example with baseDelay=1000ms, maxDelay=10000ms:
 * - Attempt 1: 2s wait
 * - Attempt 2: 4s wait
 * - Attempt 3: 8s wait
 * - Attempt 4+: 10s wait (capped)
 * 
 * This prevents overwhelming the API during outages while allowing
 * quick recovery when service is restored.
 */
function calculateBackoffDelay(attempt: number): number {
  const baseDelay = 1000;
  const maxDelay = 10000;
  return Math.min(Math.pow(2, attempt) * baseDelay, maxDelay);
}
```

### ❌ Bad: Obvious Comment

```typescript
// Set the user name to John
user.name = 'John';

// Increment the counter
counter++;

// Return the result
return result;
```

---

## Related Guidelines

- **[503 - Code Readability](./503-CodeReadability.md)** – Writing self-documenting code
- **[501 - The Grey Area](./501-TheGreyArea.md)** – Documenting deviations

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
