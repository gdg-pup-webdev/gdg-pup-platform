**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 505 - Code Structure

## Overview

How you organize logic within files impacts readability and maintainability. These guidelines help you structure code effectively.

## General Guidelines

### 1. Group Related Logic Together

**Keep related logic in a single file** as much as possible.

```typescript
// ✅ Good: All user validation logic in one place
// users/user.validation.ts
export function validateEmail(email: string): boolean { }
export function validateAge(age: number): boolean { }
export function validateUserProfile(profile: UserProfile): boolean { }

// ❌ Bad: Scattered across multiple files
// validation/email.ts
// validation/age.ts
// validation/user-profile.ts
```

**Rationale**: Related code in one place is easier to find, understand, and modify.

### 2. Keep Business Logic in Domain Services

**Do not lend major business logic to external utility functions.**

Utilities must be kept **unaware of the underlying context** in which they are called.

```typescript
// ❌ Bad: Business logic in utility
// utils/pricing.utils.ts
export function calculateUserPrice(user: User, item: Item): number {
  // This knows about User tiers, Item pricing, discount rules
  // This is business logic, not a utility!
  const tierDiscount = user.tier === 'gold' ? 0.15 : 0.05;
  return item.price * (1 - tierDiscount);
}

// ✅ Good: Business logic in service
// pricing/pricing.service.ts
export class PricingService {
  calculateUserPrice(user: User, item: Item): number {
    const tierDiscount = this.getTierDiscount(user.tier);
    return item.price * (1 - tierDiscount);
  }
  
  private getTierDiscount(tier: UserTier): number {
    // Business rules live here
  }
}

// ✅ Good: Utility is context-free
// utils/math.utils.ts
export function applyPercentageDiscount(price: number, discount: number): number {
  return price * (1 - discount);
}
```

## File Organization

### Recommended Structure Within a File

```typescript
// 1. Imports (grouped by category)
import { external } from 'external-library';
import { internal } from '@packages/internal';
import { local } from './local';

// 2. Types and Interfaces
export interface UserServiceConfig { }
type UserRole = 'admin' | 'user';

// 3. Constants
const MAX_LOGIN_ATTEMPTS = 3;
const SESSION_DURATION_MS = 3600000;

// 4. Main Class or Functions (Public API)
export class UserService {
  // Public methods first
  public async getUserById(id: string): Promise<User> { }
  public async createUser(data: CreateUserData): Promise<User> { }
  
  // Private methods below
  private validateUserData(data: CreateUserData): void { }
  private hashPassword(password: string): string { }
}

// 5. Helper functions (if not in class)
function isValidEmail(email: string): boolean { }
```

## Examples

### ✅ Good: Well-Structured Service File

```typescript
// users/user.service.ts
import { UserRepository } from './user.repository';
import { EmailService } from '../email/email.service';
import { NotFoundError, ValidationError } from '../errors';

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export class UserService {
  constructor(
    private userRepo: UserRepository,
    private emailService: EmailService
  ) {}
  
  // === Public API ===
  
  async createUser(data: CreateUserData): Promise<User> {
    this.validateUserData(data);
    
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }
    
    const user = await this.userRepo.create(data);
    await this.emailService.sendWelcome(user);
    
    return user;
  }
  
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
  
  // === Private Helpers ===
  
  private validateUserData(data: CreateUserData): void {
    if (!this.isValidEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }
    if (data.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### ❌ Bad: Business Logic in Utility

```typescript
// utils/user.utils.ts  ← This should be a service!
export function processUserRegistration(userData: any) {
  // Validate user
  // Check database for existing email
  // Hash password
  // Save to database
  // Send welcome email
  // Update analytics
  
  // This is NOT a utility - it's core business logic!
}
```

### ✅ Good: Context-Free Utility

```typescript
// utils/validation.utils.ts
/**
 * Validates an email format using RFC 5322 standard.
 * Context-agnostic - can be used for any email validation.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Checks if a string meets minimum length requirement.
 * Context-agnostic - can validate passwords, usernames, etc.
 */
export function meetsMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}
```

## Benefits

✅ **Easier Navigation**: Related code is in predictable locations  
✅ **Clear Boundaries**: Business logic vs utilities are distinct  
✅ **Better Testability**: Focused files are easier to test  
✅ **Maintainability**: Changes are localized to relevant files  

---

## Related Guidelines

- **[101 - API Utilities](./101-ApiUtilities.md)** – What makes a proper utility
- **[401 - File Structure](./401-FileStructure.md)** – Organizing files across the project
- **[503 - Code Readability](./503-CodeReadability.md)** – Writing clear code

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
