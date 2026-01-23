## This guide has been deprecated. Please read **[Guide Index](./README.md)** 

# GDG PUP Platform - Complete Architecture Guide

> **Complete guide to understanding and developing in the GDG PUP Platform monorepo**

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Contract System](#contract-system)
3. [Backend (Nexus API)](#backend-nexus-api)
4. [Frontend (Nexus Web)](#frontend-nexus-web)
5. [Database (Supabase)](#database-supabase)
6. [Developer Workflows](#developer-workflows)
7. [Adding New Features](#adding-new-features)
8. [Best Practices](#best-practices)

---

## Architecture Overview

### 🏗️ Monorepo Structure

```
gdg-pup-platform/
├── run.bat                           # CLI tool for managing workspace
├── apps/                             # Runnable applications
│   ├── nexus-api/                    # Express.js Backend API
│   ├── nexus-web/                    # Next.js Frontend
│   └── identity-api/                 # Authentication Service
├── packages/                         # Shared packages
│   ├── api-typing/                   # Type-safe API client/server helpers
│   ├── nexus-api-contracts/          # Contract definitions & schemas
│   └── identity-api-contracts/       # Identity service contracts
└── package.json                      # Root workspace configuration
```

### 🎯 Key Principles

1. **Contract-First Development**: Define API contracts before implementation
2. **Type Safety**: End-to-end type safety from DB → Backend → Frontend
3. **Shared Contracts**: Single source of truth for API schemas
4. **Modular Architecture**: Each feature is a self-contained module

---

## Contract System

### 📋 What Are Contracts?

Contracts are **type-safe API definitions** that:

- Define request/response schemas using Zod
- Provide automatic validation
- Generate TypeScript types
- Enable type-safe API clients

### 🗂️ Contract Structure

Located in: `packages/nexus-api-contracts/src/`

```
nexus-api-contracts/
├── index.ts                          # Exports Contract & Models
├── models/                           # Database models & DTOs
│   ├── userSystem/
│   │   ├── wallet.ts                 # Wallet model schemas
│   │   └── user.ts                   # User model schemas
│   ├── eventSystem/
│   │   ├── event.ts
│   │   └── attendance.ts
│   └── index.ts
├── routes/                           # API route definitions
│   ├── index.ts                      # Root route aggregator
│   ├── user-system/
│   │   └── route.ts                  # /users routes
│   ├── event-system/
│   │   ├── route.ts                  # Root /events
│   │   ├── events/
│   │   │   ├── route.ts              # /events routes
│   │   │   └── [eventId]/
│   │   │       ├── route.ts          # /events/:eventId
│   │   │       └── attendees/
│   │   │           └── route.ts      # /events/:eventId/attendees
│   │   └── checkin/
│   │       └── route.ts              # /checkin
│   └── user-resource-system/
│       └── projects/
│           ├── route.ts              # /projects
│           └── [projectId]/
│               └── route.ts          # /projects/:projectId
└── utils/
    └── schemaFactory.utils.ts        # Schema helper functions
```

### 📝 Creating a Contract

#### Step 1: Define Models (Database Schemas)

```typescript
// packages/nexus-api-contracts/src/models/userSystem/user.ts
import { z } from "zod";
import { createInsert, createUpdate, createSupabaseSelect } from "supazod";

// Database row schema (from Supabase)
export const publicUserSchema = createSupabaseSelect({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Insert DTO (for creating new records)
export const publicUserInsertSchema = createInsert(publicUserSchema, {
  email: true, // Required
  username: true, // Required
  id: false, // Auto-generated
  created_at: false, // Auto-generated
  updated_at: false, // Auto-generated
});

// Update DTO (for updating records)
export const publicUserUpdateSchema = createUpdate(publicUserSchema, {
  email: true, // Optional update
  username: true, // Optional update
});

// Export as a model group
export const user = {
  row: publicUserSchema,
  insertDTO: publicUserInsertSchema,
  updateDTO: publicUserUpdateSchema,
};
```

#### Step 2: Define Route Endpoints

```typescript
// packages/nexus-api-contracts/src/routes/user-system/route.ts
import { createRoute, createEndpoint } from "@packages/api-typing";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/models/index.js";
import z from "zod";

export const userSystem = createRoute({
  path: "/users",
  routes: {
    // GET /users (List all users)
    get: createEndpoint({
      method: "GET",
      request: {
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.paginated(Models.userSystem.user.row),
        400: SchemaFactory.Response.error(),
        500: SchemaFactory.Response.error(),
      },
    }),

    // POST /users (Create user)
    post: createEndpoint({
      method: "POST",
      request: {
        body: SchemaFactory.Request.withPayload(
          Models.userSystem.user.insertDTO,
        ),
      },
      response: {
        201: SchemaFactory.Response.single(Models.userSystem.user.row),
        400: SchemaFactory.Response.error(),
        500: SchemaFactory.Response.error(),
      },
    }),

    // Nested route: /users/:userId
    user: createRoute({
      path: "/:userId",
      routes: {
        // GET /users/:userId (Get one user)
        get: createEndpoint({
          method: "GET",
          request: {
            params: z.object({
              userId: z.string().uuid(),
            }),
          },
          response: {
            200: SchemaFactory.Response.single(Models.userSystem.user.row),
            404: SchemaFactory.Response.error(),
            500: SchemaFactory.Response.error(),
          },
        }),

        // DELETE /users/:userId
        delete: createEndpoint({
          method: "DELETE",
          request: {
            params: z.object({
              userId: z.string().uuid(),
            }),
          },
          response: {
            200: SchemaFactory.Response.empty(),
            404: SchemaFactory.Response.error(),
            500: SchemaFactory.Response.error(),
          },
        }),
      },
    }),
  },
});
```

#### Step 3: Register Routes in Root Contract

```typescript
// packages/nexus-api-contracts/src/routes/index.ts
import { createRoute } from "@packages/api-typing";
import { userSystem } from "./user-system/route.js";
import { eventSystem } from "./event-system/route.js";

export const root = createRoute({
  path: "/",
  routes: {
    userSystem,
    eventSystem,
    // Add more systems here...
  },
});
```

#### Step 4: Generate Contract

```typescript
// packages/nexus-api-contracts/src/index.ts
import { createContract, ApiTypes } from "@packages/api-typing";
import { root } from "./routes/index.js";
import { Models } from "./models/index.js";

// Generate runtime contract
const Contract = createContract(root);

// Generate TypeScript types
type ContractTypes = ApiTypes<typeof root>;

export { Models, Contract, type ContractTypes };
```

### 🔧 How Contracts Work

```typescript
// When you access: Contract.userSystem.users.user.get
// You get:
{
  method: "GET",
  path: "/users/:userId",           // ← Computed full path
  request: {
    params: ZodObject<{ userId: ZodString }>,
  },
  response: {
    200: ZodObject<{ status, message, data }>,
    404: ZodObject<{ status, message }>,
    500: ZodObject<{ status, message }>,
  }
}
```

The `createContract` function:

1. ✅ **Recursively walks** the route tree
2. ✅ **Computes full paths** (e.g., `/users/:userId`)
3. ✅ **Preserves Zod schemas** for validation
4. ✅ **Generates TypeScript types** for autocomplete

---

## Backend (Nexus API)

### 🚀 Backend Architecture

```
apps/nexus-api/
├── src/
│   ├── index.ts                      # App entry point
│   ├── configs/                      # Configuration files
│   │   └── swagger.config.ts         # Swagger/OpenAPI setup
│   ├── lib/                          # External service clients
│   │   ├── supabase.ts               # Supabase client
│   │   └── firebase.ts               # Firebase Admin SDK
│   ├── loaders/                      # App initialization
│   │   ├── express.loader.ts         # Express setup
│   │   ├── middleware.loader.ts      # Middleware registration
│   │   └── routes.loader.ts          # Route registration
│   ├── middlewares/                  # Express middlewares
│   │   ├── auth.ts                   # JWT authentication
│   │   ├── errorHandler.ts           # Global error handling
│   │   └── rateLimiter.ts            # Rate limiting
│   ├── modules/                      # Feature modules
│   │   ├── userSystem/
│   │   │   ├── user.controller.ts    # Request handlers
│   │   │   ├── user.service.ts       # Business logic
│   │   │   ├── user.repository.ts    # Database access
│   │   │   └── user.route.ts         # Route registration
│   │   ├── eventSystem/
│   │   │   ├── event.controller.ts
│   │   │   ├── event.service.ts
│   │   │   ├── event.repository.ts
│   │   │   └── eventSystem.route.ts
│   │   └── economySystem/
│   │       ├── transaction.controller.ts
│   │       ├── transaction.service.ts
│   │       └── transaction.repository.ts
│   ├── classes/                      # Custom classes
│   │   └── ServerError.ts            # Error handling class
│   └── types/                        # TypeScript types
│       └── express.d.ts              # Express type extensions
└── package.json
```

### 🎮 Controller Layer (Request Handling)

Controllers handle HTTP requests using the contract-based approach:

```typescript
// apps/nexus-api/src/modules/userSystem/user.controller.ts
import { RequestHandler } from "express";
import { createExpressController } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";
import { UserService, userServiceInstance } from "./user.service.js";
import { ServerError } from "@/classes/ServerError.js";

export class UserController {
  constructor(private userService: UserService = userServiceInstance) {}

  // GET /users/:userId
  getUser: RequestHandler = createExpressController(
    Contract.userSystem.users.user.get, // ← Contract reference
    async ({ input, output, ctx }) => {
      const userId = input.params.userId; // ← Typed params

      const { data, error } = await this.userService.getById(userId);

      if (error) {
        throw ServerError.internalError(
          `Failed to fetch user: ${error.message}`,
        );
      }

      return output(200, {
        // ← Typed output
        status: "success",
        message: "User fetched successfully",
        data,
      });
    },
  );

  // POST /users
  createUser: RequestHandler = createExpressController(
    Contract.userSystem.users.post,
    async ({ input, output, ctx }) => {
      const dto = input.body.data; // ← Typed body

      const { data, error } = await this.userService.create(dto);

      if (error) {
        throw ServerError.badRequest(`Validation failed: ${error.message}`);
      }

      return output(201, {
        status: "success",
        message: "User created successfully",
        data,
      });
    },
  );
}

export const userControllerInstance = new UserController();
```

### 🧠 Service Layer (Business Logic)

Services contain business logic and orchestrate repository calls:

```typescript
// apps/nexus-api/src/modules/userSystem/user.service.ts
import { UserRepository, userRepositoryInstance } from "./user.repository.js";
import type { Models } from "@packages/nexus-api-contracts";

type UserInsertDTO = z.infer<typeof Models.userSystem.user.insertDTO>;
type UserRow = z.infer<typeof Models.userSystem.user.row>;

export class UserService {
  constructor(
    private userRepository: UserRepository = userRepositoryInstance,
  ) {}

  async getById(userId: string) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        return { data: null, error: new Error("User not found") };
      }

      return { data: user, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async create(dto: UserInsertDTO) {
    try {
      // Business logic validation
      if (!dto.email.includes("@")) {
        throw new Error("Invalid email format");
      }

      const user = await this.userRepository.create(dto);
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const userServiceInstance = new UserService();
```

### 💾 Repository Layer (Database Access)

Repositories handle direct database interactions:

```typescript
// apps/nexus-api/src/modules/userSystem/user.repository.ts
import { supabase } from "@/lib/supabase.js";
import type { Models } from "@packages/nexus-api-contracts";

type UserRow = z.infer<typeof Models.userSystem.user.row>;
type UserInsertDTO = z.infer<typeof Models.userSystem.user.insertDTO>;

export class UserRepository {
  private table = "users";

  async findById(userId: string): Promise<UserRow | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(dto: UserInsertDTO): Promise<UserRow> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async list(page: number = 1, size: number = 10) {
    const from = (page - 1) * size;
    const to = from + size - 1;

    const { data, error, count } = await supabase
      .from(this.table)
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) throw error;
    return { listData: data, count: count ?? 0 };
  }
}

export const userRepositoryInstance = new UserRepository();
```

### 🛣️ Route Registration

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

### 🔐 Authentication Middleware

```typescript
// apps/nexus-api/src/middlewares/auth.ts
import { RequestHandler } from "express";
import { admin } from "@/lib/firebase.js";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user to request

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
};
```

---

## Frontend (Nexus Web)

### 🎨 Frontend Architecture

```
apps/nexus-web/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Homepage
│   ├── layout.tsx                    # Root layout
│   ├── events/
│   │   ├── page.tsx                  # Events list page
│   │   └── [eventId]/
│   │       └── page.tsx              # Event detail page
│   └── users/
│       └── [userId]/
│           └── page.tsx              # User profile page
├── components/                       # React components
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   └── features/                     # Feature-specific components
│       ├── EventCard.tsx
│       └── UserProfile.tsx
├── lib/                              # Utilities
│   ├── api.ts                        # API client setup
│   └── utils.ts                      # Helper functions
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Authentication hook
│   └── useApi.ts                     # API calling hook
└── styles/
    └── globals.css                   # Global styles
```

### 📡 Type-Safe API Client

```typescript
// apps/nexus-web/lib/api.ts
import { callEndpoint } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Helper function for authenticated API calls
export async function apiCall<T extends keyof typeof Contract>(
  endpoint: T,
  options: {
    params?: any;
    query?: any;
    body?: any;
    token?: string;
  },
) {
  return await callEndpoint(API_BASE_URL, endpoint as any, options);
}

// Example: Fetch user
export async function getUser(userId: string, token: string) {
  const result = await callEndpoint(
    API_BASE_URL,
    Contract.userSystem.users.user.get,
    {
      params: { userId },
      token,
    },
  );

  // Type-safe response handling
  if (result.status === 200) {
    return result.body.data; // ← Fully typed!
  }

  throw new Error(result.body.message);
}
```

### 🪝 Custom API Hook

```typescript
// apps/nexus-web/hooks/useApi.ts
import { useState, useEffect } from "react";
import { callEndpoint } from "@packages/api-typing";

export function useApi<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error };
}
```

### 🧩 Example Page Component

```typescript
// apps/nexus-web/app/events/[eventId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { callEndpoint } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";
import { useApi } from "@/hooks/useApi";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const { data: event, loading, error } = useApi(
    async () => {
      const result = await callEndpoint(
        process.env.NEXT_PUBLIC_API_URL!,
        Contract.eventSystem.events.event.get,
        {
          params: { eventId },
        }
      );

      if (result.status === 200) {
        return result.body.data;
      }
      throw new Error(result.body.message);
    },
    [eventId]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Date: {new Date(event.start_date).toLocaleDateString()}</p>
    </div>
  );
}
```

---

## Database (Supabase)

### 🗄️ Database Architecture

The platform uses **Supabase** (PostgreSQL) with the following structure:

```sql
-- Users & Authentication
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  balance INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Event System
events (
  id UUID PRIMARY KEY,
  title TEXT,
  description TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  location TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

attendees (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  status TEXT,
  checked_in_at TIMESTAMP,
  created_at TIMESTAMP,
  UNIQUE(event_id, user_id)
)

-- User Resources
projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT,
  description TEXT,
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Economy System
transactions (
  id UUID PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  amount INTEGER,
  type TEXT,
  description TEXT,
  created_at TIMESTAMP
)
```

### 🔄 Generating Zod Schemas from Database

Using `supazod` to auto-generate schemas:

```typescript
import { createSupabaseSelect, createInsert, createUpdate } from "supazod";
import { z } from "zod";

// 1. Generate from Supabase table
export const publicEventSchema = createSupabaseSelect({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  location: z.string(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// 2. Create Insert DTO (specify required fields)
export const publicEventInsertSchema = createInsert(publicEventSchema, {
  title: true, // Required
  description: true, // Required
  start_date: true, // Required
  end_date: true, // Required
  location: true, // Required
  created_by: true, // Required
  id: false, // Auto-generated
  created_at: false, // Auto-generated
  updated_at: false, // Auto-generated
});

// 3. Create Update DTO (all fields optional)
export const publicEventUpdateSchema = createUpdate(publicEventSchema, {
  title: true,
  description: true,
  start_date: true,
  end_date: true,
  location: true,
});
```

### 🔌 Supabase Client Setup

```typescript
// apps/nexus-api/src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## Developer Workflows

### 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-org/gdg-pup-platform.git
cd gdg-pup-platform

# 2. Install dependencies for all projects
run install -all

# 3. Set up environment variables
# Copy .env.example to .env in each app and fill in values

# 4. Start all development servers
run dev -all
```

### 🔄 Daily Development Flow

```bash
# Start specific apps
run dev nexus-api              # Backend only
run dev nexus-web              # Frontend only
run dev nexus-api nexus-web    # Both

# Build for production
run build nexus-api
run build nexus-web

# Run only one service
cd apps/nexus-api
npm run dev
```

### 🧪 Testing Changes

```typescript
// 1. Update a contract
// packages/nexus-api-contracts/src/routes/...

// 2. The backend and frontend will auto-reload
// Type errors will show immediately if contracts don't match

// 3. Test the endpoint
curl http://localhost:3000/api/users/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Adding New Features

### 📘 Step-by-Step Guide

#### **Example: Adding a "Posts" Feature**

**Step 1: Create Database Table** (Supabase Dashboard)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Step 2: Define Models** (Contract Package)

```typescript
// packages/nexus-api-contracts/src/models/postSystem/post.ts
import { createSupabaseSelect, createInsert, createUpdate } from "supazod";
import { z } from "zod";

export const publicPostSchema = createSupabaseSelect({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const publicPostInsertSchema = createInsert(publicPostSchema, {
  user_id: true,
  title: true,
  content: true,
  published: true,
});

export const publicPostUpdateSchema = createUpdate(publicPostSchema, {
  title: true,
  content: true,
  published: true,
});

export const post = {
  row: publicPostSchema,
  insertDTO: publicPostInsertSchema,
  updateDTO: publicPostUpdateSchema,
};
```

**Step 3: Create Route Contract**

```typescript
// packages/nexus-api-contracts/src/routes/post-system/route.ts
import { createRoute, createEndpoint } from "@packages/api-typing";
import { SchemaFactory } from "@/utils/schemaFactory.utils.js";
import { Models } from "@/models/index.js";
import z from "zod";

export const postSystem = createRoute({
  path: "/posts",
  routes: {
    get: createEndpoint({
      method: "GET",
      request: {
        query: SchemaFactory.Request.Paginated.query(),
      },
      response: {
        200: SchemaFactory.Response.paginated(Models.postSystem.post.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),

    post: createEndpoint({
      method: "POST",
      request: {
        body: SchemaFactory.Request.withPayload(
          Models.postSystem.post.insertDTO,
        ),
      },
      response: {
        201: SchemaFactory.Response.single(Models.postSystem.post.row),
        ...SchemaFactory.Response.standardErrors(),
      },
    }),

    post: createRoute({
      path: "/:postId",
      routes: {
        get: createEndpoint({
          method: "GET",
          request: {
            params: z.object({ postId: z.string().uuid() }),
          },
          response: {
            200: SchemaFactory.Response.single(Models.postSystem.post.row),
            ...SchemaFactory.Response.standardErrors(),
          },
        }),
      },
    }),
  },
});
```

**Step 4: Implement Backend**

```typescript
// apps/nexus-api/src/modules/postSystem/post.repository.ts
import { supabase } from "@/lib/supabase.js";

export class PostRepository {
  private table = "posts";

  async findById(postId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(dto: any) {
    const { data, error } = await supabase
      .from(this.table)
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const postRepositoryInstance = new PostRepository();
```

```typescript
// apps/nexus-api/src/modules/postSystem/post.controller.ts
import { RequestHandler } from "express";
import { createExpressController } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";

export class PostController {
  getPost: RequestHandler = createExpressController(
    Contract.postSystem.posts.post.get,
    async ({ input, output }) => {
      const post = await postRepository.findById(input.params.postId);

      return output(200, {
        status: "success",
        message: "Post fetched",
        data: post,
      });
    },
  );
}
```

**Step 5: Use in Frontend**

```typescript
// apps/nexus-web/app/posts/[postId]/page.tsx
"use client";

import { callEndpoint } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";

export default function PostPage({ params }: { params: { postId: string } }) {
  const result = await callEndpoint(
    process.env.NEXT_PUBLIC_API_URL!,
    Contract.postSystem.posts.post.get,
    { params: { postId: params.postId } }
  );

  if (result.status === 200) {
    return <div>{result.body.data.title}</div>;
  }

  return <div>Error</div>;
}
```

---

## Best Practices

### ✅ Contract Best Practices

1. **Always use `createEndpoint()`** for endpoints
2. **Use `SchemaFactory`** for consistent response formats
3. **Include standard errors** (400, 500) in all endpoints
4. **Define DTOs** for insert and update operations
5. **Use Zod refinements** for complex validation

### ✅ Backend Best Practices

1. **Follow the 3-layer architecture**: Controller → Service → Repository
2. **Use dependency injection** in constructors
3. **Return `{ data, error }` tuples** from services
4. **Throw `ServerError`** for HTTP errors
5. **Use middleware** for cross-cutting concerns (auth, logging)

### ✅ Frontend Best Practices

1. **Use the type-safe API client** (`callEndpoint`)
2. **Create custom hooks** for reusable API logic
3. **Handle loading and error states** properly
4. **Use environment variables** for API URLs
5. **Implement optimistic updates** for better UX

### ✅ Database Best Practices

1. **Use UUID** for primary keys
2. **Add timestamps** (`created_at`, `updated_at`)
3. **Define foreign key constraints** for data integrity
4. **Use Row-Level Security (RLS)** in Supabase
5. **Index frequently queried columns**

---

## Troubleshooting

### ❌ Common Issues

**Issue: "Property 'X' does not exist on Contract"**

- **Cause**: Endpoint not wrapped with `createEndpoint()`
- **Fix**: Wrap the endpoint definition with `createEndpoint()`

**Issue: "Type 'number' is not assignable to type 'string'"**

- **Cause**: Status code returned as number instead of literal
- **Fix**: Use `createEndpoint()` for proper type inference

**Issue: "Module not found"**

- **Cause**: Package not installed or linked
- **Fix**: Run `run install -all` to reinstall packages

**Issue: "Supabase RLS blocking requests"**

- **Cause**: Row-Level Security policies not configured
- **Fix**: Add policies in Supabase Dashboard or disable RLS for testing

---

## Additional Resources

- [Zod Documentation](https://zod.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)

---

**Last Updated**: January 12, 2026
**Maintained By**: GDG PUP Platform Team
