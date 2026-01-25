**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 105 - Error Handling

## Overview

Proper error handling ensures our APIs provide clear, actionable feedback while maintaining system stability. This guideline outlines how to handle errors across different layers of our Express.js backend.

## General Guidelines

### 1. Wrap External Calls with `tryCatch`

All calls to the following **must** be wrapped with the `tryCatch` function defined in the utility folder:

- Utility functions
- External APIs
- Services
- Repositories

```typescript
import { tryCatch } from '../utils/error.utils';

const result = await tryCatch(() => userService.getUserById(userId));
```

### 2. Error Responsibility

**Services, repositories, and utilities** are responsible for:

- ✅ **Throwing errors** when calling other functions (utility, external APIs, services, repositories)
- ✅ **Re-throwing or wrapping errors** that occur within the function
- ❌ **NOT silently catching** errors without proper handling

**Important**: When an error occurs within a function, let it bubble to the caller. If you catch an error, either re-throw it or throw a new `Error` object with additional context.

### 3. Use `ServerError` Classes

When encountering a **known error**, always use our `ServerError` class or its subclasses defined in the classes folder.

Common error types:
- `NotFoundError` – Resource not found (404)
- `ValidationError` – Invalid input (400)
- `UnauthorizedError` – Authentication required (401)
- `ForbiddenError` – Insufficient permissions (403)
- `ConflictError` – Resource conflict (409)

## Examples

### ✅ Good: Proper Error Handling in Service

```typescript
// services/user.service.ts
import { NotFoundError, ServerError } from '../errors';
import { tryCatch } from '../utils/error.utils';
import { userRepository } from '../repositories/user.repository';

export class UserService {
  async getUserById(userId: string): Promise<User> {
    // Wrap repository call with tryCatch
    const {data:user, error} = await tryCatch(() => userRepository.findById(userId));
    
    // Throw known error for specific case
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    
    return user;
  }
  
}
```

### ✅ Good: Error Handling in Repository

```typescript
// repositories/user.repository.ts
import { supabase } from '../config/database';
import { ServerError } from '../errors';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    // Re-throw database errors with context
    if (error) {
      throw new ServerError(
        `Failed to fetch user: ${error.message}`,
        500,
        error
      );
    }
    
    return data;
  }
}
```

### ✅ Good: Error Handling in Controller

```typescript
// controllers/user.controller.ts
import { createExpressController } from '@packages/typed-rest';
import { getUserProfileContract } from '@packages/nexus-api-contracts';
import { userService } from '../services/user.service';
import { tryCatch } from '../utils/error.utils';

export const getUserProfileController = createExpressController(
  getUserProfileContract,
  async (req) => {
    const { userId } = req.params;
    
    // tryCatch will handle errors and format them properly
    const {data:user, error} = await tryCatch(() => userService.getUserById(userId));
    
    return {
      id: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
);
```

### ❌ Bad: Silently Catching Errors

```typescript
// DON'T DO THIS
async getUserById(userId: string): Promise<User | null> {
  try {
    return await userRepository.findById(userId);
  } catch (error) {
    // Silently returning null hides the error!
    return null;
  }
}
```

### ❌ Bad: Catching Without Re-throwing

```typescript
// DON'T DO THIS
async updateUser(userId: string, data: UpdateUserData): Promise<User> {
  try {
    return await userRepository.update(userId, data);
  } catch (error) {
    console.log('Error updating user:', error);
    // Error is logged but not thrown - caller has no idea it failed!
  }
}
```

## Benefits

✅ **Consistent Error Responses**: All errors follow the same format  
✅ **Clear Error Messages**: Proper error types make debugging easier  
✅ **Graceful Failures**: Users get actionable feedback instead of crashes  
✅ **Traceable**: Error context preserved through layers  

---

## Related Guidelines

- **[102 - Layered Architecture](./102-LayeredArchitecture.md)** – Error handling across layers
- **[103 - Contract-First Development](./103-ContractFirstDevelopment.md)** – Error responses in contracts
- **[101 - API Utilities](./101-ApiUtilities.md)** – Error handling in utilities
- **[Onboarding: Error Handling](../Onboarding/5-ErrorHandling.md)** – Detailed error handling guide

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
