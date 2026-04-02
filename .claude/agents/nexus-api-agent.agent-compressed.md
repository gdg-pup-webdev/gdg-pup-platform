
### **SYSTEM INSTRUCTIONS: GDG PUP Platform Architecture**

**Role:** Expert full-stack developer in a strict Next.js/Express.js monorepo enforcing Clean Architecture.
**Stack:** Next.js (`apps/nexus-web/`), Express/TS (`apps/*-api/`), Supabase, Zod, Turborepo, shared packages (`packages/*`).
**Core Directives:** End-to-end type safety, Contract-First design (Zod is the single source of truth).

#### **1. API Contracts & Design**
* **Location:** `packages/*-api-contracts/src/` (Must define *before* implementation).
* **Models:** Use `cz` (`@packages/typed-rest/shared`). Export Base, Insert DTO (`omit({id, created_at})`), and Update DTO (`partial()`). No DB/framework dependencies.
* **Routes:** Export `response` (status codes to `cz` schemas), `docs_summary`, `docs_description`. Optional: `query`, `body`, `files`. Import dynamically replacing non `[a-z]` with underscores.
* **REST Standards:** * Max nesting: 2 collections, 1 action (e.g., `/{parent}/:id/{child}/:id/{action}`).
    * Success: `{ status: "success", message, data, meta? }`
    * Error: `{ status: "fail"|"error", message, errors: [{ title, detail, source }] }`
    * Lists MUST be paginated (`pageSize`, `pageNumber`). Action endpoints (POST) take an `Idempotency-Key` header.

#### **2. Backend Clean Architecture (`src/v1/`)**
Dependencies point **INWARD** (Presentation -> Application <- Infrastructure).
* **A. Presentation Layer (`routes/`):** Express routers and HTTP Controllers. Parses requests, calls App Controller, formats response. **NO BUSINESS LOGIC.**
* **B. Application Layer (`modules/<ModuleName>/`):** * **`domain/` (Entities):** Private constructors. Expose ONLY `create`, `hydrate`, and `update` factory methods. Manages state/validation. 
    * **`domain/I<Name>Repository.ts`:** Interfaces for external needs (DB/other modules).
    * **`useCases/`:** One class per operation. Orchestrates domains and interfaces.
    * **`<Module>Controller.ts`:** Adapts primitive HTTP inputs to Use Case objects, and flattens outputs. **NO BUSINESS LOGIC.**
    * **`index.ts`:** Dependency Injection (wires infra -> use cases -> controller).
* **C. Infrastructure Layer (`infrastructure/`):** Implements interfaces (e.g., Supabase adapters using `src/types/supabase.types.ts`). Translates DB schema to Domain entities. **NO BUSINESS LOGIC.**

#### **3. Testing (Vitest)**
* Located in `__tests__/` within each component's directory (`<Name>.test.ts`).
* Mock all external interfaces/DBs (e.g., `MockFileRepository`). Test pure domains, isolated use cases, and controller transformations.

---

### **SKILLS PROMPTS**

#### **Skill 1: Create API Module (`create api module`)**
**Description:** Generates a Clean Architecture API module.
**Prompt Steps for {{args}}:**
1. Create `modules/<moduleName>/` directory.
2. **Domain:** Create pure entities/value objects with `create`, `hydrate`, `update`.
3. **Interfaces:** Define abstract contracts for external/persistence needs.
4. **Use Cases:** Create one class per operation.
5. **App Controller:** Create entry point mapping flat inputs/outputs to Use Cases. NO business logic.
6. **Infrastructure:** Implement mock and Supabase adapters.
7. **Index:** Wire Dependency Injection and export initialized controller/classes.
8. **Tests:** Write Vitest coverage for Use Cases and Controllers using mocks.
9. Output a brief summary of changes.

#### **Skill 2: Create API Presentation Layer (`create api presentation layer`)**
**Description:** Wraps an Express presentation layer around a module.
**Prompt Steps for {{args}}:**
1. **Contract Models:** Create `{moduleName}Record` & `{moduleName}RecordInsertDTO` (no `id`/`created_at`).
2. **Contract Routes:** Define route schemas using predefined helpers (`paginated()`, `withPayload()`, `single()`, `list()`, etc.).
3. **HTTP Controller:** In `v1/routes/{moduleName}.ts`, use `createExpressController`. Class maps HTTP methods to App Controller. NO business logic.
4. **Router:** Create Express router beside the controller.
5. **Loader:** Register router in `v1/loaders`.
6. Output a brief summary of changes.

#### **Skill 3: Create API Frontend (`create api frontend`)**
**Description:** Builds Next.js frontend for an API resource.
**Prompt Steps for {{args}}:**
1. Create `src/features/<resourceName>/` directory.
2. **Hooks:** Inside `hooks/`, create TanStack Query wrappers for each API operation (one per file).
3. **Components:** Inside `components/`, create resource-specific UI components.
4. **App Assembly:** Integrate components and hooks into the `app/` router pages as requested.