**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 103 - Contract-First Development

## Overview

**Contract-first development** is the practice of defining API contracts (request/response schemas) **before** implementing endpoints. This ensures type safety across the entire stack and enables frontend and backend to work independently.

## Guidelines

### 1. Always Use `createExpressController`

When making controllers, you **must** use the `createExpressController` function imported from `@packages/typed-rest`.

```typescript
import { createExpressController } from '@packages/typed-rest';
```

### 2. Create the Contract First

Since `createExpressController` requires a contract to work, you **must** create the contract **before** implementing the endpoint.

### 3. Define Response Objects

Every contract **must** specify a response object with **at least** a `200` status code.

```typescript
responses: {
  200: z.object({
    // response schema
  }),
  // Optional: 400, 404, 500, etc.
}
```

### 4. Export Documentation Strings

You **must** export `docs_description` and `docs_summary` strings for our API documentation generation.

```typescript
export const docs_summary = "Get user profile by ID";
export const docs_description = "Retrieves detailed user profile information including name, email, and creation date.";
```

## Complete Example

### Step 1: Define the Contract

```typescript
// packages/nexus-api-contracts/src/users/getUserProfile.contract.ts
import { z } from 'zod';
import { route } from '@packages/typed-rest';

export const docs_summary = "Get user profile";
export const docs_description = `
Retrieves a user's public profile information by their unique ID.
Returns 404 if the user does not exist.
`;

export const getUserProfileContract = route({
  method: 'GET',
  path: '/api/users/:userId',
  request: {
    params: z.object({
      userId: z.string().uuid(),
    }),
  },
  responses: {
    200: z.object({
      id: z.string().uuid(),
      displayName: z.string(),
      email: z.string().email(),
      createdAt: z.string().datetime(),
    }),
    404: z.object({
      error: z.string(),
      message: z.string(),
    }),
  },
});
```

### Step 2: Implement the Controller

```typescript
// apps/nexus-api/src/controllers/user.controller.ts
import { createExpressController } from '@packages/typed-rest';
import { getUserProfileContract } from '@packages/nexus-api-contracts';
import { userService } from '../services/user.service';
import { NotFoundError } from '../errors';

export const getUserProfileController = createExpressController(
  getUserProfileContract,
  async (req) => {
    const { userId } = req.params;
    
    const user = await userService.getUserById(userId);
    
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    
    return {
      id: user.id,
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
);
```

### Step 3: Register the Route

```typescript
// apps/nexus-api/src/routes/user.routes.ts
import { Router } from 'express';
import { getUserProfileController } from '../controllers/user.controller';

const router = Router();

router.get('/users/:userId', getUserProfileController);

export default router;
```

## Benefits

✅ **Type Safety**: Frontend automatically gets correct TypeScript types  
✅ **API Documentation**: Auto-generated from contracts  
✅ **Contract Testing**: Validate requests/responses against schemas  
✅ **Independent Development**: Frontend and backend work in parallel  
✅ **Breaking Change Detection**: Contract changes are explicit and visible  

---

## Related Guidelines

- **[102 - Layered Architecture](./102-LayeredArchitecture.md)** – How controllers fit into the architecture
- **[105 - Error Handling](./105-ErrorHandling.md)** – Handling errors in controllers
- **[Onboarding: Contract-First Development](../Onboarding/2-ContractFirstDevelopment.md)** – Detailed learning guide

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
