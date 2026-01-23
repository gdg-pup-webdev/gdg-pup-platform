 

services and repositories: hindi sila aware sa api.

- huhugutin nyo yung types directly sa types within the project. hindi sa models na nasa contract
- di nila alam na nasa api sila, so wag magimport ng types and contracts and models from contract packages

routes and controllers: sila lang ang aware sa api

- sila ang magaact as bridge between database types and api contract types.

and kapag gagamit ng external services like gcp, make sure na madaling palitan yung service. follow nyo yung dependency injection pattern natin

## Backend (Nexus API)

### 🚀 Backend Architecture

```
apps/nexus-api/
├── src/
│   ├── index.ts                      # App entry point
│   ├── configs/                      # Configuration files
│   │   └── config.ts         # config file
│   ├── lib/                          # External service clients
│   │   ├── supabase.ts               # Supabase client
│   ├── loaders/                      # App initialization
│   │   ├── parsers.loader.ts         # loads the parsers
│   │   ├── routes.loader.ts      # loads the routes
│   │   └── swagger.loader.ts          # loads swagger ui docs
│   ├── middlewares/                  # Express middlewares
│   │   ├── auth.middleware.ts                   # JWT authentication
│   │   ├── error.middleware.ts           # Global error handling
│   │   └── rateLimiter.middleware.ts            # Rate limiting
│   ├── modules/                      # Feature modules
│   │   ├── userSystem/               # domain
│   │   │   ├── user.controller.ts    # Request handlers
│   │   │   ├── user.service.ts       # Business logic
│   │   │   ├── user.repository.ts    # Database access
│   │   │   └── user.route.ts         # Route registration
│   │   │   └── index.ts         # entry point of the domain
│   │   ├── eventSystem/
│   │   │   ├── event.controller.ts
│   │   │   ├── event.service.ts
│   │   │   ├── event.repository.ts
│   │   │   └── eventSystem.route.ts
│   │   │   └── index.ts         
│   ├── classes/                      # Custom classes
│   │   └── ServerError.ts            # Error handling class
│   └── types/                        # TypeScript types
│       └── express.d.ts              # Express type extensions
└── package.json
```
 

### 💾 Repository Layer (Database Access)

- repository layer: interface between the application and the database. no business logic. only does basic operations with the database and the resource it manages. repositories can only manage only one resource as much as possible. it doesnt know the api exists. it doesnt know the schema of the api and such. it only knows about the database 

Repositories handle direct database interactions:

```typescript
// apps/nexus-api/src/modules/userSystem/user.repository.ts
import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResult } from "@/types/repository.types";
import { Tables } from "@/types/supabase.types";

type userRow = Tables<"user">; 

export class UserRepository {
  tableName = "user";

  constructor() {}

  getUserById = async (userId: string): Promise<userRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };
 
 //.... 
}

export const userRepositoryInstance = new UserRepository();
```




### 🧠 Service Layer (Business Logic)

- service layer : contains majority of the business logic of the entire application. still not aware of the existence of the api. doesnt know the schema of the api. it only knows other services and its own repository. the function of service layer is to do one major business logic (incrementing wallet balance of user) and enforce side effects (logging the transaction using transactions service and sending notification using notification service). 
Services contain business logic and orchestrate repository calls:

```typescript
// apps/nexus-api/src/modules/userSystem/user.service.ts
import { tryCatch } from "@/utils/tryCatch.util.js";
import { UserRepository, userRepositoryInstance } from "./user.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";

export class UserService {
  constructor(
    private userRepository: UserRepository = userRepositoryInstance,
  ) {}

  getUserById = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.userRepository.getUserById(userId),
      "getting user",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

// ...
}

export const userServiceInstance = new UserService();

```


### 🎮 Controller Layer (Request Handling)

controllers act as a bridge between the api endpoint and the application. it transalates the api schema into the schema that services and repositories understand. it is also responsible for translating the return values of services and repositories back into a form that is acceptable based on the defined api schema. 

Controllers handle HTTP requests using the contract-based approach:

steps: 
- define the class and put dependencies on the constructor 
- export a default instance 
- make methods which are mapped to an endpoint 
- use the createexpress controlelr from @packages/typed-rest to be able to enforce contract 
- by enforcing the contract, you gain access to fully validated and typed input and output objects 
- input object is the mirror of the traditional req object. it contains information abotu the request
- the output object allows you to return a response to the caller. 
- the ctx object contains the raw and untouched req and res object incase you need them. 

```typescript
// apps/nexus-api/src/modules/userSystem/user.controller.ts
import { RequestHandler } from "express";
import { UserService, userServiceInstance } from "./user.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class UserSystemController {
  constructor(private userService: UserService = userServiceInstance) {}
 
  getUserById: RequestHandler = createExpressController(
    contract.api.user_system.users.userId.GET,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const userId = input.params.userId;
      const { data, error } = await tryCatch(
        async () => await this.userService.getUserById(userId),
        "getting useradfasd",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data,
      });
    },
  );
 
 // ...
}

export const userSystemControllerInstance = new UserSystemController();

```

### 🛣️ Router layer

map the routes to their controllers 

```typescript
// apps/nexus-api/src/modules/userSystem/user.route.ts
import { Router } from "express";
import { UserController, userControllerInstance } from "./user.controller.js";
import { authMiddleware } from "@/middlewares/auth.js";

export class UserRouter {
  constructor(
    private userController: UserController = userControllerInstance,
  ) {}

  getRouter() {
    const router = Router();

    // Public routes
    router.post("/users", this.userController.createUser);

    // Protected routes
    router.get(
      "/users/:userId",
      authMiddleware, // ← Auth middleware
      this.userController.getUser,
    );

    return router;
  }
}

export const userRouterInstance = new UserRouter();
```

### embed the rotuer in the domain's barrel file 

```typescript
// apps/nexus-api/src/modules/userSystem/index.ts
import { Router } from "express";
import { UserRouter, userRouterInstance } from "./user.route";

export class UserSystemRouter {
  constructor(private userRouter: UserRouter = userRouterInstance) {}

  getRouter(): Router {
    const router = Router();
    router.use("/users", this.userRouter.getRouter());
    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();

```


### load the domain in routes loader 

```typescript

// apps/nexus-api/src/loaders/routes.loader.ts
import { userSystemRouterInstance } from "@/modules/userSystem/index.js";

export const routesLoader = (app: Express) => { 
  app.use("/api/user-system", userSystemRouterInstance.getRouter());
 
};

```