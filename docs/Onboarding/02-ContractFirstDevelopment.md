## Contract System

### 📋 What Are Contracts?

Contracts are **type-safe API definitions** that:

- Define request/response schemas using Zod
- Provide automatic validation
- Generate TypeScript types
- Enable type-safe API clients

### 🗂️ Contract Structure

Located in: `packages/nexus-api-contracts/src/`
models and routes folder names are strict and required

```
nexus-api-contracts/
├── models/                           # Database models & DTOs
│   ├── userSystem/
│   │   ├── wallet.ts                 # exports wallet model schemas
│   │   ├── user.ts                   # User model schemas
│   │   └── index.ts                   # bundle exports walelt and user
│   └── eventSystem/
│       ├── event.ts
│       ├── attendance.ts
│       └── index.ts                   # bundle exports
├── routes/                           # API route definitions
│   ├── user-system/
│   │   └── users/                  # /users routes
│   │       └── [userId]/        # /users routes
│   │       │   └── GET.ts        # defines GET endpoint for /users-system/users/:userId
│   │       └── GET.ts                  # defines GET endpoint for /users-system/users
│   │       └── POST.ts                 # defines POST endpoint for /users-system/users
│   ├── event-system/
│   │   ├── events/
│   │   │   ├── [eventId]/
│   │   │   │   ├── GET.ts          # /events/:eventId
│   │   │   │   └── DELETE.TS
│   │   │   │   └── attendees/
│   │   │   │       └── GET.ts      # /events/:eventId/attendees
│   │   │   ├── GET.ts              # /events routes
│   │   │   └── POST.ts             # /events routes
│   │   └── checkin/
│   │       └── POST.ts              # /checkin
└── utils/
    └── schemaFactory.utils.ts        # Schema helper functions
```

### 📝 Creating a Contract

#### Step 1: Define Models (Database Schemas)

create models as zod schemas.
the filename is the name of the resource.
the exported variables are different forms the schema can take such as db row, apiinsertDTo, updateDTO, aggregated.

```typescript
// /src/models/userSystem/user.ts
import { z } from "zod";

// Database row schema (from Supabase)
export const publicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Insert DTO (for creating new records)
export const publicUserInsertSchema = publicUserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Update DTO (for updating records)
export const publicUserUpdateSchema = publicUserInsertSchema.partial();
```

export them in a barrel file and give it an alias to avoid naming conflicts.
this is for in-package use only. models will still be exported by the code generator even without barrel files.

```typescript
// /src/models/userSystem/index.ts
export * as user from "./user.js";
```

#### Step 2: Define Route Endpoints

to define routes of api, we use file based routing. /src/route is the root.
for example, to declare an endpoint like GET /api/users/:userId, you need to make a file with path /src/routes/api/users/[userId]/GET.ts.

the exported variables defined the endpoint.
you must export atleast a response object with 200 key in it whose value is a zod schema.

you can export the following:

- query : z.object whose keys are the query params
- body : z.object representing the body of the request
- response : object whose keys are status code and values are z.object schemas representing the api response body on that status code

you can also export the following for documentation purposes (swagger ui docs generation):
- docs_params : object whose keys are the path param and value is description of that param
- docs_query : object whose keys are the query param and value is description of that param
- docs_body : description of body 
- docs_summary  : summary of the endpoint
- docs_description  : description of the endpoint
- docs_response_200 : description for response 200
- docs_response_400 : description for response 400
- docs_${anything} : where anything could be anything. use this for extra information.

example of a get endpoint

```typescript
import { transaction } from "#models/economySystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

// query parameters 
export const query = z.object({
  pageNumber: z.coerce.number().int().positive().default(1), // which page 
  pageSize: z.coerce.number().int().positive().default(10), // number of items per page
  userId: z.string().optional(), // filter result by matching user id 
  walletId: z.string().optional(), // filter result by matching wallet id
});

// response body 
export const response = {
    // response body when status code is 200

  200: z.object({
        status: z.string(),
        message: z.string(),
        data:  z.array(z.object({
  amount: z.number(),
  created_at: z.string(),
  id: z.string(),
  source_id: z.string(),
  source_type: z.string(),
  wallet_id: z.string(),
});),
        meta: z.object({
          totalRecords: z.number(),
          pageSize: z.number(),
          currentPage: z.number(),
          totalPages: z.number(),
        }),
      }),
      // response body when status code is 400

        400: z.object({
        status: z.string(),
        message: z.string(),
        errors: z
          .array(
            z.object({
              title: z.string(),
              detail: z.string(),
              moreDetails: z.unknown().optional(),
              source: z.string().optional(),
            }),
          )
          .optional(),
      }),
      // response body when status code is 500

        500: z.object({
        status: z.string(),
        message: z.string(),
        errors: z
          .array(
            z.object({
              title: z.string(),
              detail: z.string(),
              moreDetails: z.unknown().optional(),
              source: z.string().optional(),
            }),
          )
          .optional(),
      }),
};

// documentation variables used for swagger ui docs generation
export const docs_query = {
  pageNumber: "which page",
  pageSize: "how many items per page",
  userId: "optional ID of the user",
  walletId: "wallet id, required if userId is not provided",
};
export const docs_summary = "List transactions of a user";
export const docs_description =
  "List transactions filtered by walletId or userId";
export const docs_response_200 = "Goodssss lupetttt";
export const docs_response_400 = "Bad request";
```

example output of contract above: 
```typescript
// /src/typedrest.contract.ts

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

// flat list of all endpoints for openapi generation
export const openapiendpoints = [
  {
    "method": "get",
    "path": "/api/economy-system/transactions",
    "query": api_economy_system_transactions_get_query_foropenapischema,
    "response": api_economy_system_transactions_get_response_foropenapischema,
    "docs_query": api_economy_system_transactions_get_docs_query_foropenapischema,
    "docs_summary": api_economy_system_transactions_get_docs_summary_foropenapischema,
    "docs_description": api_economy_system_transactions_get_docs_description_foropenapischema,
    "docs_response_200": api_economy_system_transactions_get_docs_response_200_foropenapischema,
    "docs_response_400": api_economy_system_transactions_get_docs_response_400_foropenapischema
  },
]

// ...swagger ui generator codes

```
 


The `createContract` function:

1. ✅ **Recursively walks** the route tree
2. ✅ **Computes full paths** (e.g., `/users/:userId`)
3. ✅ **Preserves Zod schemas** for validation
4. ✅ **Generates TypeScript types** for autocomplete

---
