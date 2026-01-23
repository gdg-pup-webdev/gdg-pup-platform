**[⬅️ Previous: Project Architecture](./1-ProjectArchitecture.md)** | **[Back to Onboarding](./README.md)** | **[Next: Layered Architecture ➡️](./3-LayeredArchitecture.md)**

---

# Contract-First Development

This document explains our contract-first development approach, where we define API specifications before writing any implementation code. This ensures clear, validated, and type-safe communication between the frontend and backend.

## What are Contracts?

Contracts are type-safe API definitions that provide the following benefits:

-   **Schema Definition**: Define request and response schemas using [Zod](https://zod.dev/).
-   **Automatic Validation**: Automatically validate incoming requests and outgoing responses.
-   **Type Generation**: Generate TypeScript types for end-to-end type safety.
-   **Type-Safe Clients**: Enable the creation of type-safe API clients for the frontend.

## Contract Structure

API contracts are located in the `packages/nexus-api-contracts/src` directory. The folder structure is strict and follows these conventions:

```
nexus-api-contracts/src/
├── models/
│   └── userSystem/
│       ├── user.ts     # Zod schemas for the 'user' resource
│       └── index.ts    # Barrel file exporting all models in the module
│
├── routes/
│   └── user-system/
│       └── users/
│           ├── [userId]/
│           │   └── GET.ts  # Defines: GET /user-system/users/:userId
│           ├── GET.ts      # Defines: GET /user-system/users
│           └── POST.ts     # Defines: POST /user-system/users
│
└── utils/
    └── schemaFactory.ts # Reusable schema utility functions
```

-   **`models/`**: Contains Zod schemas for database models and Data Transfer Objects (DTOs).
-   **`routes/`**: Defines the API endpoints using a file-based routing system.

## How to Create a Contract

### Step 1: Define Models

First, define the Zod schemas for your resource. The filename should correspond to the resource name (e.g., `user.ts`). Export different variations of the schema for different use cases, such as database rows, insert DTOs, and update DTOs.

**Example: User Model**

```typescript
// /src/models/userSystem/user.ts
import { z } from "zod";

// Schema for a user row in the database
export const publicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Schema for creating a new user (omitting generated fields)
export const publicUserInsertSchema = publicUserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating a user (all fields are optional)
export const publicUserUpdateSchema = publicUserInsertSchema.partial();
```

For organizational purposes, you can use a barrel file (`index.ts`) to group and export the models, using aliases to prevent naming conflicts.

```typescript
// /src/models/userSystem/index.ts
export * as user from "./user.js";
```

### Step 2: Define Route Endpoints

API routes are defined using a file-based routing system, where the directory structure under `src/routes/` maps to the API path. For instance, an endpoint for `GET /api/users/:userId` is created at `src/routes/api/users/[userId]/GET.ts`.

Each endpoint file must export a `response` object containing at least a `200` status code with its corresponding Zod schema.

You can export the following from an endpoint file:

-   `query`: A `z.object` defining the URL query parameters.
-   `body`: A `z.object` defining the request body.
-   `response`: An object where keys are HTTP status codes and values are the corresponding response body schemas.

For documentation generation (e.g., Swagger/OpenAPI), you can also export these optional variables:

-   `docs_summary`: A brief summary of the endpoint.
-   `docs_description`: A detailed description of the endpoint.
-   `docs_params`: Descriptions for path parameters.
-   `docs_query`: Descriptions for query parameters.
-   `docs_body`: A description of the request body.
-   `docs_response_...`: Descriptions for specific status code responses (e.g., `docs_response_200`).

**Example: GET Endpoint for Transactions**

```typescript
// /src/routes/economy-system/transactions/GET.ts
import { z } from "zod";

// Schema for query parameters
export const query = z.object({
  pageNumber: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  userId: z.string().optional(),
  walletId: z.string().optional(),
});

// Schema for response bodies
export const response = {
  200: z.object({
    status: z.string(),
    message: z.string(),
    data: z.array(z.object({
        id: z.string(),
        amount: z.number(),
        // ... other fields
    })),
    meta: z.object({
      totalRecords: z.number(),
      pageSize: z.number(),
      currentPage: z.number(),
      totalPages: z.number(),
    }),
  }),
  400: z.object({
    status: z.string(),
    message: z.string(),
    // ... error details
  }),
  500: z.object({
    status: z.string(),
    message: z.string(),
    // ... error details
  }),
};

// OpenAPI documentation metadata
export const docs_summary = "List user transactions";
export const docs_description = "Retrieves a paginated list of transactions, filterable by user or wallet.";
export const docs_query = {
  pageNumber: "The page number to retrieve.",
  pageSize: "The number of items per page.",
  userId: "Optional. Filter transactions by user ID.",
  walletId: "Optional. Filter transactions by wallet ID.",
};
```

### Auto-Generated Contract

A build process consumes these files and automatically generates a comprehensive `typedrest.contract.ts` file. This file includes:

-   A single `contract` object containing the entire API schema.
-   TypeScript types inferred from the Zod schemas for full type safety.
-   A flattened list of endpoints for OpenAPI/Swagger documentation generation.

This automated process ensures that our API is always well-documented, validated, and type-safe.

**Example: /src/typedrest.contract.ts**

```typescript 

// THIS FILE IS AUTO-GENERATED. DO NOT EDIT. 

import { query as api_economy_system_transactions_GET_query } from "./routes/api/economy-system/transactions/GET";
import { response as api_economy_system_transactions_GET_response } from "./routes/api/economy-system/transactions/GET";
import { row as model_economySystem_transaction_row } from "./models/economySystem/transaction";
import { insertDTO as model_economySystem_transaction_insertDTO } from "./models/economySystem/transaction";
import { updateDTO as model_economySystem_transaction_updateDTO } from "./models/economySystem/transaction";

// schema of the entire api
export const contract = {
  "api": {
    "economy_system": {
      "transactions": {
        "GET": {
          "request": {
            "query": api_economy_system_transactions_GET_query
          },
          "response": api_economy_system_transactions_GET_response,
          "metadata": {
            "method": "GET",
            "path": "/api/economy-system/transactions",
            "signature": "api_economy_system_transactions_GET"
          }
        }
      },
    }
  }
}

// types of the entire api
export namespace contract {
  export namespace api {
    export namespace economy_system {
      export namespace transactions {
        export namespace GET {
          export namespace request {
            export type query = z.infer<typeof api_economy_system_transactions_GET_query>;
          }
          export type response = { [K in keyof typeof api_economy_system_transactions_GET_response]: z.infer<(typeof api_economy_system_transactions_GET_response)[K]> };
          export namespace metadata {
            export type method = "GET";
            export type path = "/api/economy-system/transactions";
            export type signature = "api_economy_system_transactions_GET";
          }
        }
      }
    }
  }
}

// model schemas defined in /src/models/
export const models = {
  "economySystem": { 
    "transaction": {
      "row": model_economySystem_transaction_row,
      "insertDTO": model_economySystem_transaction_insertDTO,
      "updateDTO": model_economySystem_transaction_updateDTO
    },
  },
} 

// types of model schemas defined in /src/models/
export namespace models {
  export namespace economySystem { 
    export namespace transaction {
      export type row = z.infer<typeof model_economySystem_transaction_row>;
      export type insertDTO = z.infer<typeof model_economySystem_transaction_insertDTO>;
      export type updateDTO = z.infer<typeof model_economySystem_transaction_updateDTO>;
    }
  }
}
```