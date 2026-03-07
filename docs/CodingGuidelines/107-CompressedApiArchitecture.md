

# System Prompt: Clean Architecture Backend Guidelines

**Core Stack:** Node.js, Express, TypeScript, Clean Architecture.
**Goal:** Strict separation of concerns, complete decoupling of business logic from framework/database tools, and heavy reliance on Dependency Injection.

## 1. Directory Structure

```text
src/
├── app.ts                 # Global Express initialization
├── v1/                    # API Version (Independent Express App)
│   ├── routes/            # Presentation Layer (HTTP/Express)
│   └── modules/           # Application & Infrastructure Layers
│       └── [ModuleName]/
│           ├── domain/          # Entities & Interfaces
│           ├── useCases/        # Business actions
│           ├── infrastructure/  # DB/External implementations
│           ├── __tests__/       # Isolated tests using mocks
│           ├── [Module]Controller.ts # Entry to App Layer
│           └── index.ts         # Dependency Injection wiring

```

## 2. Layer Rules & Constraints

### A. Presentation Layer (`src/v1/routes/`)

* **Role:** Handle HTTP requests (Express), map routes to Application Controllers, and format responses.
* **Constraint:** **NO BUSINESS LOGIC.** Must only call the Module's Application Controller.
* **Pattern:** Consists of `*.router.ts` and `*.controller.ts` (HTTP Controller).

### B. Application Layer (`src/v1/modules/[Module]/`)

* **Role:** Core business logic.
* **Constraint:** Must be completely agnostic to external frameworks, databases, or HTTP contexts. Dependencies flow *inward*. Modules cannot directly call other modules (must use injected interfaces).

**1. Domain Entities (`domain/*.ts`)**

* Must encapsulate own state. Never rely on DB for ID or timestamp generation.
* Must use `private _props` to prevent direct mutation.
* Must use `private constructor`.
* Must expose `static create(props: InsertProps)` (for new items) and `static hydrate(props: Props)` (for loading from DB).
* Must handle mutations via controlled methods (e.g., `update(props: UpdateProps)`).

**2. Repository Interfaces (`domain/I*Repository.ts`)**

* Abstract classes/interfaces defining data contracts (e.g., `findById`, `saveNew`, `persistUpdates`, `delete`).
* **Constraint:** Signatures must take and return Domain Entity objects, NOT raw database rows.

**3. Use Cases (`useCases/*.ts`)**

* One class per workflow (e.g., `CreateStudyJam`, `CheckInUser`).
* Must accept required external dependencies via constructor injection (e.g., `constructor(private readonly repo: IStudyJamRepository) {}`).

**4. Module Controller (`[Module]Controller.ts`)**

* **Role:** The boundary between the HTTP Route and the Use Cases.
* Accepts primitive input (strings, numbers), executes the corresponding Use Case, and maps the returned Domain Object into a plain DTO for the Presentation Layer.

### C. Infrastructure Layer (`infrastructure/`)

* **Role:** Implement the Repository Interfaces (e.g., Supabase, GCP).
* **Constraint:** Collocated inside the module folder for convenience, but conceptually an outer layer. **NO BUSINESS LOGIC.**
* **Pattern:** Must include a `private mapToDomain(row: any): DomainEntity` method to convert raw DB outputs into `Entity.hydrate()` calls. Methods like `saveNew` must translate Domain props to DB formats without mutating the Domain object.

### D. Dependency Injection Wiring (`index.ts`)

* Every module must have an `index.ts` file that manually wires the dependencies.
* **Flow:** Instantiate Repo -> Instantiate Use Cases (passing Repo) -> Instantiate Controller (passing Use Cases) -> Export Controller.

## 3. Testing Strategy (`__tests__/`)

* **Rule:** All tests must be completely isolated using Mock Infrastructure.
* Create `Mock*Repository.ts` in the `infrastructure` folder holding an in-memory array (`public items: Entity[] = []`).
* **File Naming:** `<ComponentName>.test.ts`
* Test Use Cases by injecting Mock Repositories. Assert that Domain validation holds and Use Case orchestrates correctly.
