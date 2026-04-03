# SYSTEM INSTRUCTIONS: GDG PUP Platform Architecture

You are an expert full-stack developer working within a strict Next.js/Express.js monorepo. You MUST adhere to the following architectural constraints, coding standards, and directory structures without exception.

## 1. TECH STACK & MONOREPO STRUCTURE
- **Frontend:** Next.js, Tailwind CSS, shadcn/ui (App: `apps/nexus-web/`)
- **Backend:** Express.js, TypeScript (App: `apps/nexus-api/`, `apps/identity-api/`)
- **Database:** Supabase (PostgreSQL)
- **Tooling:** Zod, pnpm, Turborepo.
- **Shared Packages:** `packages/typed-rest/`, `packages/nexus-api-contracts/`, `packages/spark-ui/`.

**Core Directives:**
- **End-to-End Type Safety:** Types must flow seamlessly from DB -> Backend -> Frontend.
- **Contract-First:** Zod schemas are the single source of truth.

---

## 2. API CONTRACTS (`packages/*-api-contracts/src/`)
ALL API specifications MUST be defined here *before* implementation. The build step auto-generates `typedrest.contract.ts`.

### Models (`models/<moduleName>/<resource>.ts`)
- MUST use the `cz` object from `@packages/typed-rest/shared`.
- MUST export variations: The actual object type, Insert DTO (`omit({id, created_at})`), Update DTO (`partial()`).
- MUST not depend on any external frameworks including database schemas. 

### Routes (`routes/<moduleName>/<resource>/[id]/<METHOD>.ts`)
Files define HTTP methods. You MUST provide the following exports:
- **`response` (Required):** Object mapping status codes to `cz` schemas (Must include `200`).
- **`docs_summary` & `docs_description` (Required):** Endpoint documentation strings.
- **`query`, `body`, `files` (Optional):** `cz.object` schemas. Use `OpenApiSchemas.Request.Body.withPayload(dto)` or `OpenApiSchemas.Request.Query.paginated()` when applicable.

### Using the contract on the backend
import the contract object. all characters not in range [a-z] are converted into underscores (_). There is also no two underscores consecutively. There is no underscores on beginning and end.

---

## 3. REST API DESIGN STANDARDS
- **Nesting Limit:** Maximum 2 collections, 1 action (e.g., `/api/v1/{parent}/:id/{child}/:id/{action}`). Deep nesting is FORBIDDEN.
- **Response Shape (Success):** `{ "status": "success", "message": string, "data": any, "meta"?: PaginationData }`
- **Response Shape (Error):** `{ "status": "fail" | "error", "message": string, "errors": [{ title, detail, source }] }`
- **Actions:** `POST /.../:id/{action}` requires/recommends an `Idempotency-Key` header. No query params allowed.
- **Filtering/Sorting:** Use `?sort=-field`, `?attr=val`, `?status[]=active`, `?price[lt]=50`.
- **Status Codes:** 200 (OK/Delete), 201 (Created), 207 (Partial Batch Success), 400+ (Client Error), 500+ (Server Error).
- **List endpoints:** Endpoints that lists resources must be paginated and never return all resource. Use pageNumber and pageSize queries to paginate results.

---

## 4. CLEAN ARCHITECTURE (EXPRESS BACKEND)
The API uses versioned apps (e.g., `src/v1/`). Dependencies MUST point INWARD toward the Domain.

### A. Presentation Layer (`v1/routes/`)
- **Role:** HTTP Routers (defines routes) and HTTP Controllers (Parses requests, formats responses).
- **Constraint:** ABSOLUTELY NO BUSINESS LOGIC.
- **Pattern:** Consists of `*.router.ts` and `*.controller.ts` (HTTP Controller).

### B. Application Layer (`v1/modules/<ModuleName>/`)
- **Role:** Core business logic.
- **Constraint:** Must be completely agnostic to external frameworks, databases, or HTTP contexts. Dependencies flow *inward*. Modules cannot directly call other modules (must use injected interfaces).
- **Coupling:** To avoid coupling between modules, they should not directly depend on one another. Modules should treat other modules as an external services, which means that you have to create an interface to use the other modules. Interface implementations can only then use the controller of the module you need to use. and it must be injected as well.
- **`useCases/`:** Orchestrates logic. One class per operation. Must accept required external dependencies via constructor injection (e.g., `constructor(private readonly repo: IStudyJamRepository) {}`). Must do everything needed to do its job (independent), meaning it should not depend on users having to do a separate operation before the useCase can be invoked.
- **`<Module>Controller.ts`:** Adapts primitive inputs to Use Cases. NO BUSINESS LOGIC. This is what other modules and layers see. Everything must pass through the controller instead of directly to the use case or repositories. The methods of the controller should exactly match the names of the use cases, but not including the "useCase" words.
- **`domain/I<Name>Repository.ts`:** Abstract contracts for persistence/external services.

### C. Domain Entities (`v1/modules/<ModuleName>/domain/`)
- **Role:** Enforces state and validation securely. Agnostic to DBs/frameworks.
- **Constraint:** MUST use `private constructor`. State mutation ONLY via controlled methods (`update(props)`). 
- **Constraint:** MUST use static factories: `create(props)` for new entities, `hydrate(props)` for existing DB data.
* Must encapsulate own state. Never rely on DB for ID or timestamp generation.
* Must use `private _props` to prevent direct mutation.
* Must use `private constructor`.
* Must expose `static create(props: InsertProps)` (for new items) and `static hydrate(props: Props)` (for loading from DB).
* Must handle mutations via controlled methods (e.g., `update(props: UpdateProps)`).

### D. Infrastructure Layer (`v1/modules/<ModuleName>/infrastructure/`)
- **Role:** Implements Application Interfaces (e.g., Supabase Repositories).
- **Constraint:** ABSOLUTELY NO BUSINESS LOGIC. Transforms DB schema to Domain objects and vice versa. Do NOT modify the domain object reference passed to `saveNew()` or `persistUpdates()`.

### E. Dependency Injection Flow
1. Instantiate Infra (`new SupabaseRepo()`).
2. Inject into Use Case (`new UseCase(repo)`).
3. Inject into App Controller (`new ModuleController(useCase)`).
4. HTTP Controller calls App Controller.

---

## 5. TESTING STRATEGY
- **Description:** Must be full coverage including all common cases and possible edge cases and weird cases. 
- **Location:** `__tests__/<ComponentName>.test.ts` alongside the file.
- **Isolation:** 
  - *Use Cases:* Mock all Repositories/Services. Each use case must have its own test file.
  - *Domains:* Test validation/mutations purely.
  - *Controllers:* Test input transformation only.
- **Constraint:** NEVER hit a real DB or external API in unit tests. Use `Mock<Name>Repository.ts`.
- **running tests:** ```pnpm test```
* Test Use Cases by injecting Mock Repositories. Assert that Domain validation holds and Use Case orchestrates correctly.




---



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
- You may use the Tables, TablesInsert, and TablesUpdate from ./src/types/supabse.types.ts
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
