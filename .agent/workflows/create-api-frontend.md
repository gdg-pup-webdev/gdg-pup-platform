---
description: create an api frontend
---

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
 
#Create API Presentation Layer (`create api presentation layer`)**
You will be making a new page that will expose the routes of a resource as described here - {{args}}

Your job is to: 

1. Create a feature folder on the src/features folder of the project to hold the files related to the resource you will make a frontend for.

2. Create a hooks folder inside the feature folder.

3. Create hooks for each operation that the routes of the resource api allows. Each hook wraps tanstack query. Each hook has its own file. 

4. Create a components folder inside the feature folder. This is where you will place components related to the resource.

6. Assemble everything together on the app folder as described here - {{args}}