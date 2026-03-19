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
