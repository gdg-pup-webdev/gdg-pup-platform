# Nexus API v1: Contract-First Layered Architecture

This document explains how `v1` is implemented in this repository, using:

- Contract-first API design from `@packages/nexus-api-contracts`
- Layered architecture in `apps/nexus-api/src/v1`
- Typed request and response enforcement via `@packages/typed-rest/serverExpress`

It is intended to be the practical guide for adding or modifying `v1` endpoints.

## 1) High-Level Architecture

`v1` follows this runtime composition:

1. Entry point (`Version1`) initializes Express and loads parsers, routes, and global error handler.
2. Routers register endpoint paths and auth/permission middleware.
3. HTTP controllers bind each endpoint to a contract via `createExpressController`.
4. Module controllers orchestrate use cases.
5. Use cases execute business logic using domain entities and repository interfaces.
6. Repositories handle data access (Supabase) and map to domain objects.

In short:

Route -> HTTP Controller (contract boundary) -> Module Controller -> Use Case -> Repository -> DB

## 2) Where Things Live

### App side (`apps/nexus-api/src/v1`)

- `index.ts`: Initializes the `v1` app and core loaders.
- `loaders/`: Bootstrapping logic (`loadRoutes`, `loadParsers`, `loadErrorHandler`).
- `routes/`: Express routers + HTTP controllers.
- `modules/`: Domain-oriented modules with use cases and repositories.
- `middlewares/`: Auth, token parsing, error handling.
- `errors/`: Typed errors (`HttpError`, `ServerError`, etc.).

### Contract side (`packages/nexus-api-contracts`)

- `src/routes/api/v1/**`: Endpoint contract fragments (`GET.ts`, `POST.ts`, `PATCH.ts`, etc.).
- `src/models/v1/**`: Zod model schemas used by contracts.
- Generated typed contract object is consumed in `nexus-api` as:
  - `contract.api.v1.<module>...`

## 3) Contract-First in Practice

Each route handler in `v1` is implemented using `createExpressController` with a contract key.

Example pattern:

```ts
createExpressController(
  contract.api.v1.portfolios.GET,
  async ({ input, output }) => {
    // read validated input
    // run domain logic
    // return validated response
    return output(200, payload);
  },
);
```

What this gives you:

- Request validation at the contract boundary.
- Response validation before sending the payload.
- Compile-time and runtime alignment with API contracts.
- Better docs generation from the same source contract metadata.

## 4) Layer Responsibilities

### Routes (`routes/*/*.router.ts`)

- Bind URL paths to controller handlers.
- Apply auth and permission middleware.
- Keep business logic out.

### HTTP Controllers (`routes/*/*.controller.ts`)

- Bridge HTTP to domain.
- Use `createExpressController(contract..., handler)`.
- Read `input.params`, `input.query`, `input.body`.
- Translate domain models to contract response shape.

### Module Controllers (`modules/*/*ModuleController.ts`)

- Orchestrate use cases for a module.
- Expose app-level methods that controllers call.
- Keep transport concerns out.

### Use Cases (`modules/*/useCase/*.ts`)

- Business rules per use case.
- No Express, no contract awareness.
- Depend on repository interfaces, not infrastructure details.

### Repositories (`modules/*/infrastructure/*.ts`)

- Database operations and persistence mapping.
- Return domain entities/props expected by use cases.

## 5) Error Handling and Validation Behavior

`v1` uses a global error middleware that handles:

- `ContractError` from typed-rest:
  - Client-side contract mismatch -> `400`
  - Server-side response contract mismatch -> `500`
- `HttpError`, `ServerError`, and generic `Error`

Implication:

- If your output does not match the response schema in contracts, request may fail as a server contract violation.
- Keep controller response payloads aligned with the contract object.

## 6) How to Add a New v1 Endpoint

Use this workflow for every new endpoint:

1. Define or update model schemas in `packages/nexus-api-contracts/src/models/v1/**`.
2. Define endpoint contract file in `packages/nexus-api-contracts/src/routes/api/v1/**/<METHOD>.ts` with:
   - `request` parts (`params`, `query`, `body`) when needed
   - `response` object (must include `200` + standard errors)
   - docs fields (`docs_summary`, `docs_description`, etc.)
3. Ensure contract is available under `contract.api.v1...` (via contract package build/generation workflow).
4. Add or update repository method in module infrastructure.
5. Add or update use case in `modules/<module>/useCase`.
6. Add or update module controller method in `*ModuleController.ts`.
7. Add or update HTTP controller method using `createExpressController`.
8. Register route in module router.
9. Wire router in `v1/loaders/loadRoutes.ts` if needed.
10. Add tests for use case/controller path.

## 7) Current v1 Implementation Pattern (Concrete Example)

The `portfolios` flow follows this shape today:

1. Router (`routes/portfolios/portfolios.router.ts`) binds:
   - `GET /portfolios`
   - `GET /portfolios/:portfolioId`
   - `PATCH /portfolios/:portfolioId`
2. HTTP controller (`routes/portfolios/portfolios.controller.ts`) uses:
   - `contract.api.v1.portfolios.GET`
   - `contract.api.v1.portfolios.portfolioId.GET`
   - `contract.api.v1.portfolios.portfolioId.PATCH`
3. Module controller (`modules/portfolioModule/PortfolioModuleController.ts`) orchestrates use cases.
4. Use cases delegate to repository.
5. Repository handles Supabase persistence.

This is the reference style to copy when building new modules (including Sparkmates/NFC-related endpoints).

## 8) Docs and OpenAPI

API docs are generated from contracts through the app docs loader:

- OpenAPI JSON
- Swagger UI
- Scalar
- Stoplight
- RapiDoc
- Postman conversion export

Because docs come from contracts, keeping contract metadata complete is required for good API documentation.

## 9) Rules of Thumb for Contributors

- Always start from the contract definition, then implement server logic.
- Keep controllers thin; move logic into use cases.
- Keep use cases independent from Express and contract schemas.
- Keep repository logic isolated to data access concerns.
- Return only contract-compliant response payloads.
- Add docs strings in contract files for discoverability.
- Prefer adding new use cases over overloading unrelated existing ones.

## 10) Sparkmates/NFC Feature Fit (v1)

For upcoming Sparkmates work in `v1`:

- Keep public route handling in `v1` as contract-defined endpoints.
- Keep card state and scan tracking in dedicated module/use cases.
- Keep frontend route concerns in `nexus-web`; backend receives normalized params/query (`gdgId`, `source`).
- Use the same contract-first + layered pattern described above.

---

If you are adding a new endpoint, use the `portfolios` module as your canonical template and replicate the exact layer boundaries.
