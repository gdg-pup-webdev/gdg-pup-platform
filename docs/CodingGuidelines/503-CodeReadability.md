**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 503 - Code Readability

## Overview

**Keep the code readable.** The best code explains itself without requiring extensive comments.

## Core Principle

Making code readable means **writing self-documenting code**, not bombarding the codebase with comments.

## What is Self-Documenting Code?

Self-documenting code uses clear names, logical structure, and obvious patterns that make the code's purpose and behavior evident.

### Key Practices

#### 1. Use Descriptive Names

```typescript
// ❌ Bad: Unclear names
function calc(u: any, d: number) {
  return u.p * d;
}

// ✅ Good: Self-explanatory names
function calculateTotalPrice(user: User, discountPercentage: number) {
  return user.basePrice * discountPercentage;
}
```

#### 2. Keep Functions Small and Focused

```typescript
// ❌ Bad: Does too many things
function processUserData(user: User) {
  // Validates user
  // Saves to database
  // Sends email
  // Updates cache
  // Logs analytics
}

// ✅ Good: Single responsibility
function validateUser(user: User): boolean { }
function saveUser(user: User): Promise<void> { }
function sendWelcomeEmail(user: User): Promise<void> { }
```

#### 3. Use Clear Control Flow

```typescript
// ❌ Bad: Nested and confusing
if (user) {
  if (user.age >= 18) {
    if (user.verified) {
      return true;
    }
  }
}
return false;

// ✅ Good: Early returns and clear logic
if (!user) return false;
if (user.age < 18) return false;
if (!user.verified) return false;
return true;
```

#### 4. Structure Code Logically

```typescript
// ✅ Good: Grouped and organized
export class UserService {
  // Public methods first
  async getUserById(id: string): Promise<User> { }
  async createUser(data: CreateUserData): Promise<User> { }
  
  // Private helpers below
  private validateUserData(data: CreateUserData): void { }
  private sendNotification(user: User): void { }
}
```

## When to Add Comments

> See **[504 - Documenting Your Code](./504-DocumentingYourCode.md)** for when comments are appropriate.

Comments should explain:
- **Why** (not what) you're doing something
- Non-obvious constraints or business rules
- Workarounds for library bugs
- Performance optimizations

```typescript
// ✅ Good: Explains WHY
// We hash the email to preserve privacy while allowing lookups
const userKey = hashEmail(user.email);

// ❌ Bad: States the obvious
// Hash the email
const userKey = hashEmail(user.email);
```

## Examples

### ✅ Good: Self-Documenting

```typescript
export class EventRegistrationService {
  async registerUserForEvent(userId: string, eventId: string): Promise<Registration> {
    const user = await this.getUserOrThrow(userId);
    const event = await this.getEventOrThrow(eventId);
    
    this.ensureEventHasCapacity(event);
    this.ensureUserNotAlreadyRegistered(user, event);
    
    const registration = await this.createRegistration(user, event);
    await this.sendConfirmationEmail(user, event);
    
    return registration;
  }
  
  private ensureEventHasCapacity(event: Event): void {
    if (event.registrations >= event.maxCapacity) {
      throw new ConflictError('Event is full');
    }
  }
}
```

### ❌ Bad: Requires Comments to Understand

```typescript
export class RegSvc {
  async reg(u: string, e: string): Promise<Reg> {
    const usr = await this.repo.getU(u);
    const evt = await this.repo.getE(e);
    
    // Check if event is full
    if (evt.r >= evt.mc) {
      throw new Error('Full');
    }
    
    // Check if already registered
    const existing = await this.repo.findR(u, e);
    if (existing) {
      throw new Error('Exists');
    }
    
    // Create registration
    const reg = await this.repo.createR(usr, evt);
    
    // Send email
    await this.email.send(usr.em, 'Confirmed', evt.nm);
    
    return reg;
  }
}
```

## Benefits

✅ **Easier to Understand**: New developers can grasp the code quickly  
✅ **Easier to Maintain**: Clear code is easier to modify safely  
✅ **Fewer Bugs**: Obvious code has fewer hidden edge cases  
✅ **Self-Reviewing**: Clear code catches logic errors during writing  

---

## Related Guidelines

- **[504 - Documenting Your Code](./504-DocumentingYourCode.md)** – When comments are needed
- **[505 - Code Structure](./505-CodeStructure.md)** – Organizing code within files

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
