# Monorepo Architecture Context

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, TypeScript
- **Database:** Supabase (PostgreSQL)
- **Tooling & Infrastructure:** Zod (Contracts), pnpm, Turborepo, Docker / Docker Compose

## Workspace Structure

```text
gdg-pup-platform/
├── apps/                        # Deployable applications
│   ├── nexus-api/               # Express.js Backend API
│   ├── nexus-web/               # Next.js Frontend
│   ├── identity-api/            # Authentication Service
│   └── storybook/               # UI component development environment
├── packages/                    # Shared internal libraries
│   ├── typed-rest/              # Type-safe API client/server helpers
│   ├── nexus-api-contracts/     # Core API schemas (Zod)
│   ├── identity-api-contracts/  # Identity service schemas (Zod)
│   └── spark-ui/                # Internal UI component library
└── configs/                     # Shared workspace tooling
    ├── eslint-config/
    ├── typescript-config/
    └── tailwind-config/
```

## Core Principles

1.  **Contract-First Development:** API contracts are defined prior to implementation to establish a strict interface between frontend and backend.
2.  **End-to-End Type Safety:** Strict type enforcement from the database layer up to the frontend UI to catch errors at build time.
3.  **Shared API Contracts:** Zod schemas act as a single source of truth in the `packages/` directory to guarantee client/server synchronization.
4.  **Modular Architecture:** Code is organized by feature into self-contained modules to enforce separation of concerns and scalability.
5.  **API Clean Architecture:** API follows the rules of clean architecture which imposes the dependency rule and separates responsibilities across different layers.

# Contract-First API Development

All API specifications must be defined before implementation to ensure end-to-end type safety between the frontend and backend.

Contracts are located in `packages/nexus-api-contracts/src` and other similar package projects

## Directory Structure

```text
src/
├── models/
│   └── <moduleName>/
│       └── <resource>.ts      # Zod/cz schemas (Rows, Insert DTOs, Update DTOs)
└── routes/
    └── <moduleName>/
        └── <resource>/
            ├── [id]/          # Bracket notation for path parameters
            │   └── GET.ts     # Defines GET /<moduleName>/<resource>/:id
            └── POST.ts        # Defines POST /<moduleName>/<resource>
```

## 1. Defining Models (`models/`)

- Schemas must be created using the `cz` object.
- Always export variations for different use cases (e.g., Database Row, Insert DTO, Update DTO).

**Example:**

```typescript
import { cz } from "@packages/typed-rest/shared";

export const user = cz.object({
  id: cz.string().uuid(),
  email: cz.string().email(),
  created_at: cz.string().datetime(),
});

export const userInsert = user.omit({ id: true, created_at: true });
export const userUpdate = userInsert.partial();
```

## 2. Defining Routes (`routes/`)

Endpoints use a file-based routing system mapping to the API path. Each file (e.g., `GET.ts`, `POST.ts`) defines the contract for that specific HTTP method.

### Required & Optional Exports

- `response` **(Required)**: Object mapping HTTP status codes to schemas. Must include at least a `200` response.
- `query` _(Optional)_: `cz.object` for URL query parameters.
- `body` _(Optional)_: `cz.object` for request payloads.
- **Documentation Exports**:
  - `docs_summary` **(Required)**: Brief endpoint summary.
  - `docs_description` **(Required)**: Detailed behavior description.
  - _Optional Docs_ (Use only if non-obvious): `docs_params`, `docs_query`, `docs_body`, `docs_response_<status>`.

#### params

params are automatically derived from the file structure

#### queries

you may extend the paginated query

```
export const query = OpenApiSchemas.Request.Query.paginated().extend({
  userId: z.string().optional(),
});
```

or build your own

```
export const query =cz.object({
          pageNumber: cz.coerce.number().int().positive().default(1),
          pageSize: cz.coerce.number().int().positive().default(10),
        });
```

#### body

if you dont require body, you may leave it empty.
if you do, you can use the preset body for requests with payload.

```
export const body = OpenApiSchemas.Request.Body.withPayload(userAchievementInsertDTO);
```

#### files

you can export files object

```

export const files = {
  image: OpenApiSchemas.Models.file(),
  subimages:  OpenApiSchemas.Models.files(),
};
```

the files object is flat and cannot have sub-objects

### Helper Schemas

Leverage pre-made schemas for standard responses:
`import { OpenApiSchemas } from "@packages/typed-rest/shared";`

## 3. Auto-Generation

A build step automatically compiles `models/` and `routes/` into `typedrest.contract.ts`. This file exports a single `contract` namespace containing the full API schema, inferred TypeScript types, and flat endpoint definitions used by the backend controllers and frontend API clients.

# API Design & Routing Standards

## 1. Request & Response Shapes

- **Request:** URL Query (filters/sort/paginate), Path Params (IDs), Body (Data).
- **Success Response (2xx):**
  ```json
  {
    "status": "success",
    "message": "...",
    "data": {},
    "meta": { "page": 1, "pageSize": 20, "totalCount": 100, "totalPages": 5 }
  }
  ```
- **Error Response (4xx/5xx):** `status` must be `"fail"` (4xx) or `"error"` (5xx).
  ```json
  {
    "status": "fail",
    "message": "...",
    "errors": [
      {
        "title": "...",
        "detail": "...",
        "moredetails": {},
        "source": "body.data.field"
      }
    ]
  }
  ```

## 2. Resource Architecture

**Base Path:** `{method} /api/{version}/{col1}/:id1/{col2}/:id2/{action}`

- **Constraints:** Maximum **2 collections**, **1 action**. Deep nesting is strictly forbidden.
- **Targeting:** If root and target collections differ, the target _must_ be a child of the root.
- **Naming:** Dependent resources must be prefixed with their parent's name (e.g., `userWalletTransactions`).

## 3. Endpoint Rules by Method

### GET

- **List (`/{col}`):** Use `?pageNumber` and `?pageSize`. Returns `list` inside `data` and pagination in `meta`.
- **Single (`/{col}/:id`):** Support sparse fieldsets (`?fields=id,name`) and shallow inclusions (`?include=childName`).
- **Nested (`/{parent}/:id/{child}`):** Cannot filter by child attributes here; filter only via the target resource's direct endpoint.

### POST

- **Create (`/{col}`):** Expects DTO. Dependent resources _must_ include `parent_id` in the body. Supports batch creation (Array of DTOs).
- **Associate (`/{parent}/:id/{child}`):** Links existing resources. Accepts **IDs only**, NOT full DTOs.
- _Batch Returns:_ 201 (All succeed), 207 (Partial success - returns success list + fail list), 4xx/5xx (All fail).

### PUT / PATCH

- **PUT (`/{col}/:id`):** Complete replacement.
- **PATCH (`/{col}/:id`):** Partial update.

### DELETE

- **Sever Link (`/{parent}/:id/{child}/:id`):** Removes relationship (deletes child only if 1:1 fully dependent).
- **Delete Specific (`/{col}/:id`):** Deletes resource + resolves cascades.
- **Batch Delete (`/{col}/batch`):** Accepts array of IDs in body.

## 4. Advanced Routing Concepts

- **Actions (`POST /.../:id/{action}`):** For complex logic. No query params allowed. **Must** require/recommend an `Idempotency-Key` header. Supports `/batch/{action}`.
- **Computed Attributes (`GET /.../:id/{noun}`):** Derived data. Cannot be followed by an ID.
- **Reserved Keyword:** `batch` cannot be used as an ID.

## 5. Query Conventions

- **Sort:** `?sort_by=field&sort_order=asc|desc` OR `?sort=-field`
- **Filter (Basic):** `?attr=val`
- **Filter (Arrays):** `?status[]=active&status[]=pending`
- **Filter (Operators):** `?price[lt]=50`, `?created_at[gte]=2023-01-01`

## 6. Status Codes & Versioning

- **Codes:** `200` (OK/Delete), `201` (Created), `207` (Multi-Status/Partial), `401` (Unauth), `403` (Forbidden), `404` (Not Found), `409` (Conflict), `422` (Unprocessable/Validation).
- **Versioning:** Bump API version (`v2`) for breaking changes: route removals, changing required fields/types, altering response shapes, or changing pagination/auth behaviors.

# Backend Architecture Guidelines (Clean Architecture)

This project follows a strict, versioned Clean Architecture for an Express.js API.

## 1. Global & Versioned Structure

The API is organized around versioned, independent Express applications (`v1`, `v2`, etc.) mounted to a global app.

```text
src/
├── app.ts                 # Main Express init, mounts versions
├── configs/               # Global configs
├── loaders/               # Global loaders (CORS, parsers)
├── middlewares/           # Global middlewares
└── v1/                    # API Version (Independent Express App)
    ├── index.ts           # Version entry point & loader execution
    ├── routes/            # Presentation Layer (HTTP routers & controllers)
    ├── modules/           # Application Layer & Infrastructure Layer
    ├── loaders/           # Version-specific loaders
    ├── middlewares/       # Version-specific middlewares
    ├── utils/             # Context-agnostic utilities
    └── types/             # Shared types (colocate specific types when possible)
```

## 2. Architectural Layers & Dependency Rules

Dependencies point **inward** toward the Application Layer.

- **Presentation (Routes)** -> Depends on Application Layer.
- **Infrastructure** -> Implements Application Layer Interfaces.
- **Application (Modules)** -> Isolated. Depends on NOTHING external.

### A. Presentation Layer (`v1/routes/`)

Handles HTTP requests, validation, and response formatting. **NO BUSINESS LOGIC.**

- **Router:** Defines Express endpoints (GET, POST).
- **HTTP Controller:** Parses `req`/`res`, extracts params, calls the Application Controller, formats HTTP responses.

### B. Application Layer (`v1/modules/<ModuleName>/`)

Contains all business logic. Modules are self-contained and decoupled. Do not call other modules directly (use dependency injection).

Module structure:

- **`domain/` (Entities):** \* Private constructors. Manage state securely.
  - Must use factory methods (`create`, `hydrate`) and controlled update methods (`update`).
  - Validates data integrity. Agnostic to DBs/frameworks.
- **`domain/I<Name>Repository.ts` (Interfaces/Ports):**
  - Abstract contracts defining external needs (e.g., `findById`, `saveNew`, `persistUpdates`).
- **`useCases/`:**
  - One class per operation (e.g., `CreateStudyJam`).
  - Orchestrates domain entities and interfaces.
- **`<Module>Controller.ts` (Application Controller):**
  - Entry point for the module. Adapts primitive inputs from the Presentation layer into Use Case structures. **NO BUSINESS LOGIC.**
- **`index.ts` (Dependency Injection):**
  - Initializes infrastructure, injects them into use cases, and exports the wired Application Controller.

### C. Infrastructure Layer (`v1/modules/<ModuleName>/infrastructure/`)

Implements the Application Interfaces (e.g., Database adapters, Third-party APIs).

- **NO BUSINESS LOGIC.**
- Transforms DB schema data into valid Domain objects (and vice versa).

---

## 3. Strict Implementation Rules

### Domain Rules

```typescript
// Domain objects enforce state. No direct mutation.
export class Resource {
  private constructor(private _props: Props) {} // Private
  static create(props: InsertProps): Resource {
    /* validate & return new Resource */
  }
  static hydrate(props: Props): Resource {
    /* return existing Resource */
  }
  update(props: UpdateProps): void {
    /* validate & mutate _props */
  }
}
```

### Interface Rules

- Do not modify the object reference passed to persistence methods.
- `saveNew(entity)` and `persistUpdates(entity)` must accept and return the exact state of the domain entity.

### Dependency Injection Flow

1. **Initialize Infra:** `const repo = new SupabaseRepo();`
2. **Initialize Use Case:** `const useCase = new UpdateUseCase(repo);`
3. **Initialize App Controller:** `export const moduleController = new ModuleController(useCase);`
4. **Presentation Layer:** HTTP Controller imports `moduleController` and calls its methods.

---

## 4. Testing Strategy

- **Location:** All tests reside in `__tests__/` folders within their respective module/component directory.
- **Naming:** `<ComponentName>.test.ts`
- **Isolation:** \* Use Cases: Mock all interfaces (Repositories/Services).
  - Domains: Test creation, hydration, and validation rules purely.
  - Controllers: Test input transformation and Use Case triggering.
- No real databases or external APIs should be hit during unit tests. Utilize isolated mock implementations (e.g., `MockFileRepository.ts`).
