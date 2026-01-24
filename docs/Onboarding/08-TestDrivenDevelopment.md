# Test-Driven & Verified Development

This guide explains the testing strategy and development workflow used in the GDG PUP Platform to ensure reliability and production-grade quality.

## 🧪 Testing Philosophy

We employ **Integration Testing** to verify that our API contracts, controllers, services, and repositories work together seamlessly. Instead of testing isolated units, we test the "happy paths" and "error cases" of our API endpoints.

### Key Tools
- **Vitest**: Our primary test runner (fast, compatible with Vite/ESM).
- **Supertest**: Used to simulate HTTP requests against our Express application.
- **Mocking**: We mock the Service layer and Auth middleware to isolate endpoint logic from external dependencies (like the real Supabase database) during local testing.

---

## 🏗️ Architecture for Testability

To make the backend testable, we separate the **Server Listener** from the **Application Logic**:

1.  **`src/app.ts`**: Configures Express, mounts loaders (Swagger, Routes, Error Handlers), and exports the `app` instance. **This file is imported by tests.**
2.  **`src/index.ts`**: Imports `app` and calls `app.listen()`. This is the entry point for production but is *never* imported by tests.

This separation prevents tests from trying to start a real server on a network port, making them faster and avoiding port conflicts.

---

## 🛠️ Development Workflow (TDD-ish)

When adding a new feature (like Achievements or Certificates):

1.  **Define the Contract**: Create the Zod schemas and Route definitions in `packages/nexus-api-contracts`.
2.  **Generate Types**: Run `pnpm run gen-types` to ensure the backend and frontend have the latest definitions.
3.  **Implement the Stack**:
    - **Repository**: Inherit from `BaseRepository` for standard CRUD.
    - **Service**: Handle business logic and `try/catch` wrapping.
    - **Controller**: Map the contract to the service.
4.  **Write the Integration Test**: Create a file in `src/tests/` (e.g., `achievements.test.ts`).
5.  **Verify**: Run `pnpm run test` to ensure everything works as expected.

---

## 🏃 Running Tests

### All Tests (Monorepo)
From the root directory:
```bash
pnpm run test
```

### Specific App (Nexus API)
```bash
cd apps/nexus-api
pnpm test
```

### Specific Test File
```bash
npx vitest run src/tests/achievements.test.ts
```

---

## 📋 Best Practices for Tests

1.  **Follow the Contract**: Always use the same input/output structure defined in your `@packages/nexus-api-contracts`.
2.  **Descriptive Names**: Use clear `describe` and `it` blocks (e.g., `it('should return 400 if title is missing')`).
3.  **Clean State**: Use `beforeEach(() => vi.clearAllMocks())` to ensure tests don't leak state to each other.
4.  **Mock Auth**: Use the mocked `AuthMiddleware` to simulate different user roles and authenticated states.
5.  **Verify Assertions**: Check not just the status code, but the structure and content of the `response.body`.
