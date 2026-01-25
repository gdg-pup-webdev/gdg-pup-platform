**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 102 - Layered Architecture

## Overview

Our backend follows a strict **layered architecture** to decouple the API schema from the database schema. This separation allows the frontend and backend to evolve independently without breaking changes.

## Core Principle

**Always adhere to the layered architecture.**

The layers are:
1. **Routes** – Define HTTP endpoints
2. **Controllers** – Handle HTTP requests/responses and translate between API contracts and domain models
3. **Services** – Contain business logic
4. **Repositories** – Handle database operations

## Layer Responsibilities

### Repositories & Services

**These layers are NOT aware of the API.**

- ✅ Use **local types** defined within the backend domain
- ❌ Do NOT import or reference API contract types
- ❌ Do NOT have any knowledge of HTTP, requests, or responses

**Rationale**: This decouples the database/application schema from the API schema. We can change our database tables without breaking the API contract.

### Controllers & Routes

**These layers ARE aware of the API.**

- **Routes** connect HTTP endpoints to controllers
- **Controllers** act as translators:
  1. **Parse** incoming HTTP requests
  2. **Translate** API contract types → domain types
  3. **Call** services/repositories with domain types
  4. **Translate** domain results → API contract types
  5. **Return** HTTP responses

## Benefits

This separation allows us to:
- ✅ **Decouple** API schema from database structure
- ✅ **Modify tables** without updating the API schema
- ✅ **Avoid breaking changes** to the frontend
- ✅ **Allow independent evolution** of frontend and backend

The frontend and backend can grow at their own pace without being tightly coupled.

## Example: Layered Flow

### Scenario: Get User Profile

#### 1. Route Definition
```typescript
// routes/user.routes.ts
import { getUserProfileController } from '../controllers/user.controller';
import { getUserProfileContract } from '@packages/nexus-api-contracts';

router.get('/users/:userId', 
  createExpressController(getUserProfileContract, getUserProfileController)
);
```

#### 2. Controller (Translator Layer)
```typescript
// controllers/user.controller.ts
import type { GetUserProfileResponse } from '@packages/nexus-api-contracts';
import { userService } from '../services/user.service';

export async function getUserProfileController(req) {
  // 1. Extract from request
  const userId = req.params.userId;
  
  // 2. Call service with domain types (no API types here in service)
  const user = await userService.getUserById(userId);
  
  // 3. Translate domain model → API contract
  const response: GetUserProfileResponse = {
    id: user.id,
    displayName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
  
  return response;
}
```

#### 3. Service (Domain Logic)
```typescript
// services/user.service.ts
import { userRepository } from '../repositories/user.repository';
import type { User } from '../types/user.types'; // Local domain type

export class UserService {
  async getUserById(userId: string): Promise<User> {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user; // Returns domain type, not API type
  }
}
```

#### 4. Repository (Database Layer)
```typescript
// repositories/user.repository.ts
import { supabase } from '../config/database';
import type { User } from '../types/user.types'; // Local domain type

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data; // Database row → domain model
  }
}
```

## Key Takeaways

| Layer | Aware of API? | Uses API Types? | Responsibility |
|-------|---------------|-----------------|----------------|
| **Routes** | ✅ Yes | ✅ Yes | Connect endpoints to controllers |
| **Controllers** | ✅ Yes | ✅ Yes | Translate API ↔ Domain |
| **Services** | ❌ No | ❌ No | Business logic with domain types |
| **Repositories** | ❌ No | ❌ No | Database operations with domain types |

---

## Related Guidelines

- **[103 - Contract-First Development](./103-ContractFirstDevelopment.md)** – How to define API contracts
- **[101 - API Utilities](./101-ApiUtilities.md)** – Context-agnostic utilities
- **[105 - Error Handling](./105-ErrorHandling.md)** – Error patterns across layers

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
