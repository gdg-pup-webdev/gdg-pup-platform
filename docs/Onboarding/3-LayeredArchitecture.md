**[⬅️ Previous: Contract-First Development](./2-ContractFirstDevelopment.md)** | **[Back to Onboarding](./README.md)** | **[Next: Dependency Injection ➡️](./4-DependencyInjection.md)**

---

# Backend Architecture: Layered Design

Our backend follows a layered architecture to ensure a clean separation of concerns, making the codebase more modular, maintainable, and testable. This guide details the structure and responsibilities of each layer.

## Guiding Principles

-   **Services and Repositories**: These layers are API-agnostic. They should not have any knowledge of the API contracts. Types should be imported directly from the project's `types` directory, not from the `*-api-contracts` packages.
-   **Routes and Controllers**: These layers are API-aware and act as the bridge between the API contracts and the application's core logic. They are responsible for translating data between the API schema and the internal database types.
-   **External Services**: When integrating with external services (e.g., GCP, AWS), use dependency injection to ensure that implementations can be easily swapped out.

## Backend Structure

The `nexus-api` application is organized as follows:

```
apps/nexus-api/src/
├── index.ts              # Application entry point
├── classes/              # Custom classes (e.g., ServerError)
├── configs/              # Project configuration
├── lib/                  # External service clients (e.g., Supabase)
├── loaders/              # Application initialization logic
├── middlewares/          # Express middlewares (e.g., auth, error handling)
├── modules/              # Feature modules organized by domain
│   └── userSystem/
│       ├── user.controller.ts  # Handles HTTP requests and responses
│       ├── user.service.ts     # Contains business logic
│       ├── user.repository.ts  # Manages database interactions
│       ├── user.route.ts       # Defines API routes for the module
│       └── index.ts            # Entry point for the feature module
└── types/                # Global TypeScript types and interfaces
```

## 1. Repository Layer (Data Access)

The repository layer is the lowest level, responsible for all direct interactions with the database.

-   **Responsibilities**:
    -   Perform basic CRUD (Create, Read, Update, Delete) operations.
    -   Abstract away the database implementation details.
    -   Manage a single database resource (e.g., a `user` table).
-   **Constraints**:
    -   Contains no business logic.
    -   Is unaware of the API and its schemas.

**Example: `UserRepository`**

```typescript
// apps/nexus-api/src/modules/userSystem/user.repository.ts
import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { Tables } from "@/types/supabase.types";

type UserRow = Tables<"user">;

export class UserRepository {
  private tableName = "user";

  async getUserById(userId: string): Promise<UserRow> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data;
  }
}

export const userRepository = new UserRepository();
```

## 2. Service Layer (Business Logic)

The service layer contains the core business logic of the application.

-   **Responsibilities**:
    -   Orchestrate data flow by calling repository methods.
    -   Implement complex business rules and operations.
    -   Coordinate between different services to handle side effects (e.g., logging a transaction, sending a notification).
-   **Constraints**:
    -   Is unaware of the API and its schemas.

**Example: `UserService`**

```typescript
// apps/nexus-api/src/modules/userSystem/user.service.ts
import { tryCatch } from "@/utils/tryCatch.util.js";
import { UserRepository, userRepository } from "./user.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";

export class UserService {
  constructor(private userRepository: UserRepository = userRepository) {}

  async getUserById(userId: string) {
    const { data, error } = await tryCatch(
      () => this.userRepository.getUserById(userId),
      "An error occurred while getting the user."
    );

    if (error) {
      throw new RepositoryError(error.message);
    }

    return data;
  }
}

export const userService = new UserService();
```

## 3. Controller Layer (Request Handling)

The controller layer acts as the bridge between the API endpoints and the application's services.

-   **Responsibilities**:
    -   Handle incoming HTTP requests.
    -   Validate and sanitize request data (delegated to `typed-rest`).
    -   Call service methods to execute business logic.
    -   Translate data from services into a format that conforms to the API contract.
    -   Return a structured HTTP response.

We use the `createExpressController` utility from `@packages/typed-rest` to enforce our API contract, providing fully typed and validated inputs.

**Example: `UserSystemController`**

```typescript
// apps/nexus-api/src/modules/userSystem/user.controller.ts
import { UserService, userService } from "./user.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class UserSystemController {
  constructor(private userService: UserService = userService) {}

  getUserById = createExpressController(
    contract.api.user_system.users.userId.GET,
    async ({ input, output }) => {
      const { userId } = input.params;

      const { data, error } = await tryCatch(
        () => this.userService.getUserById(userId)
      );

      if (error) {
        throw new ServiceError(error.message);
      }

      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data,
      });
    }
  );
}

export const userController = new UserSystemController();
```

## 4. Router Layer (Route Registration)

The router layer maps API routes to their corresponding controller methods and applies any necessary middleware.

**Example: `UserRouter`**

```typescript
// apps/nexus-api/src/modules/userSystem/user.route.ts
import { Router } from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";

const router = Router();

// Public route
router.post("/users", userController.createUser);

// Protected route with authentication middleware
router.get(
  "/users/:userId",
  authMiddleware,
  userController.getUserById,
);

export const userRouter = router;
```

Finally, the module's router is registered in the main routes loader to be included in the application.

```typescript
// apps/nexus-api/src/loaders/routes.loader.ts
import { userRouter } from "@/modules/userSystem/user.route.js";

export const routesLoader = (app: Express) => {
  app.use("/api/user-system", userRouter);
  // ... other module routers
};
```