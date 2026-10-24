# Architecture

**Source:** [Google Doc, Architecture tab](https://docs.google.com/document/d/1MtkL7wC80pJ0efL8-qb7bjn3P2U8R96av5bigVQy5X4/edit?tab=t.bvh73mtz24z7)

**Snapshot date:** 2026-10-19. This is a manually maintained copy of the Google Doc draft. The files and Google Doc do not synchronize automatically. Implementation claims and test results retain the assessment date stated below.

**Related:** [Current features](current-features.md) | [Future features](future-features.md) | [Current architecture](current-architecture.md)


GDG PUP Nexus | Current technical architecture

Assessment date: 2 October 2026

## Architecture statement

Nexus uses a contract-first, full-stack TypeScript monorepo. It combines feature-based Next.js frontends with a versioned Express REST API whose current modules follow Clean Architecture patterns. Shared packages provide API definitions, validation tools, frontend utilities, and a common design system.

Monorepo describes how the code is organized. Clean Architecture describes backend responsibilities and dependency direction. Feature-based architecture describes frontend organization. They apply together at different levels.

## 1. Applications

| Application | Responsibility |
| --- | --- |
| `apps/nexus-web` | Public website, member portfolios, projects, events, and member-facing features |
| `apps/nexus-admin-web` | Organizer dashboard and management interfaces |
| `apps/nexus-api` | Main API, current authentication, business operations, and persistence adapters |
| `apps/identity-api` | Separate identity/card service retained in the repository; excluded from the normal development workflow |
| `apps/storybook` | Shared UI component previews and documentation |

These are applications in one repository. Their presence alone does not establish a fully independent microservices architecture.

## 2. Shared packages

| Package | Responsibility |
| --- | --- |
| `packages/nexus-api-contracts` | Shared main API schemas and endpoint definitions |
| `packages/identity-api-contracts` | Separate identity-service contracts |
| `packages/typed-rest` | Contract generation, typed clients, and request/response validation helpers |
| `packages/spark-ui` | Reusable brand components, layout primitives, and styles |
| `packages/spark-tools` | Shared data-fetching utilities, hooks, services, and error handling |
| `configs/*` | Shared TypeScript, ESLint, and Tailwind configuration |

## 3. Current technology stack

| Layer | Technologies found in the reviewed checkout |
| --- | --- |
| Public and admin frontends | Next.js 16.1.1, React 19.2.3, TypeScript |
| Frontend data and state | TanStack Query, React Context, Zustand |
| Styling and motion | Tailwind CSS, Spark UI, Motion, Lenis |
| Backend | Express, TypeScript, Node.js |
| API contracts | Zod schemas and internal typed-rest tooling |
| Database | Supabase/PostgreSQL |
| File handling | Supabase storage, Google Cloud Storage adapters, Sharp image processing |
| Email | ZeptoMail adapter with a mock fallback |
| Workspace | pnpm and Turborepo |
| Tests | Vitest, with API route tests using Supertest |
| Infrastructure | Docker, GitHub Actions, Terraform configuration for Google Cloud Run and Cloudflare DNS |

The root README still mentions Next.js 14. The web application manifests specify Next.js 16.1.1 and are the basis for the version stated here. Infrastructure configuration is not proof of current deployed state.

## 4. Frontend architecture

Both web applications use Next.js App Router and organize business functionality by feature.

src/app/ contains pages, route groups, layouts, loading states, and errors.

src/features/<feature>/ contains feature-specific components, hooks, API interactions, and types.

src/components/ contains application-level reusable interface elements.

src/providers/ contains application-wide providers.

src/lib/ and src/configs/ contain shared utilities and configuration.

Typical frontend flow:

```text
Page or feature component
  -> Query or mutation hook
  -> Typed API client and shared contract
  -> Nexus API
  -> Query cache update and interface rendering
```

Business-specific interfaces stay inside applications. Reusable brand components belong in Spark UI when their reuse is established.

## 5. Backend  Architecture

Presentation: Express routers and HTTP controllers parse requests, apply validation, call application operations, and format responses.

Application: module controllers and use cases coordinate operations such as creating a project, activating a card, or awarding points.

Domain: entities and repository/service interfaces describe business state, rules, and the capabilities required from external systems. Current conventions use controlled entity construction and mutation.

Infrastructure: Supabase repositories, file storage adapters, email providers, and other service adapters implement those interfaces.

Dependency injection: module index.ts files construct infrastructure implementations and inject them into use cases and application controllers.

Request execution usually follows:

```text
Frontend
  -> Express route and HTTP controller
  -> Application controller and use case
  -> Domain objects and repository/service interfaces
  -> Infrastructure adapter
  -> Database or external service
```

Code dependency direction is a separate concern: use cases depend on interfaces, while infrastructure implements those interfaces. This allows tests to substitute mock implementations. Older and unfinished modules do not follow every convention consistently.

## 6. Contract-first development

Shared endpoint schemas are defined in packages/nexus-api-contracts before changing the corresponding backend and frontend behavior. Internal tooling generates the typed contract used by client calls and backend validation helpers.

Recommended implementation sequence:

1. Update the shared model and endpoint contract.
2. Add or update the backend domain behavior and use case.
3. Implement repository or external-service changes when needed.
4. Wire the HTTP controller and route into the active application.
5. Connect frontend queries, mutations, and components.
6. Run meaningful checks for the affected behavior.

A contract file or generated client property does not prove its route is mounted. Event attendance currently demonstrates this integration gap.

## 7. API versions and identity

/api/v1 is the main active API surface.

/api/v0 and unversioned /api paths retain deprecated compatibility behavior.

Current Sparkmates member profiles use /api/v1/gdgmembers. Older documentation references Sparkmates and portfolio API paths that are not registered in the current v1 route loader.

The main Nexus API currently implements member credentials, password hashing, JWT handling, email OTP flows, and role/permission information. A separate Identity API remains in-tree, and some older frontend card flows still call it.

New changes should distinguish the supported current path from compatibility and older implementations.

## 8. Persistence and external services

Supabase/PostgreSQL stores member, project, event, content, card, wallet, and other application records. Domain objects are mapped to database rows through repository implementations.

Schema snapshots and migrations live under supabase/. They differ, so database-dependent work must identify the relevant schema baseline and verify deployed state separately.

File storage is configurable through backend adapters. Email delivery uses ZeptoMail when configured; otherwise the module uses a mock mail service.

## 9. Testing and delivery

API use-case and domain tests use isolated dependencies. Existing route tests exercise selected Express behavior. Spark Tools has its own tests for shared frontend infrastructure.

Verified review baseline: 248 Nexus API tests and 37 Spark Tools tests passed on 1 October 2026. This does not establish full browser, production, integration, or hardware coverage.

GitHub Actions contains build/test, Docker image, deployment, and scheduled event synchronization workflows. Terraform separates dev, staging, and production configuration. Deployment configuration was inspected; actual cloud deployment state was not verified.

## 10. Development entrypoints

Read docs/state.md, docs/index.md, and FLAGS.md first. Use task-specific onboarding and coding guidelines next. Read active implementation alongside older architecture documentation.

Core source paths:

- apps/nexus-api/src/loaders/loadApps.ts: API version mounting.
- apps/nexus-api/src/v1/loaders/loadRoutes.ts: active module routing.
- apps/nexus-api/src/v1/modules: current backend modules.
- apps/nexus-web/src/features: member and public frontend features.
- apps/nexus-admin-web/src/features: admin frontend features.
- packages/nexus-api-contracts/src: main API contracts.
- packages/spark-ui/src: shared interface system.
- supabase/: migrations and schema snapshots.
- .github/workflows/ and terraform/: delivery and infrastructure configuration.

