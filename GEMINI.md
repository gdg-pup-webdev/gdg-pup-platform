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
- **`<Module>Controller.ts`:** Adapts primitive inputs to Use Cases. NO BUSINESS LOGIC. This is what other modules and layers see. Everything must pass through the controller instead of directly to the use case or repositories.
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
