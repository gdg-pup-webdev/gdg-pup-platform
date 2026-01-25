**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 401 - File Structure

## Overview

Our monorepo follows a **flat and shallow** file structure with **folder-by-feature** organization. This makes code easier to find, modify, and maintain.

## General Guidelines

### 1. Keep Structure Flat and Shallow

**Avoid nesting files and folders too deeply** throughout the entire project.

```
✅ Good: Flat structure
apps/nexus-api/src/
├── users/
│   ├── user.service.ts
│   ├── user.repository.ts
│   ├── user.controller.ts
│   └── user.types.ts

❌ Bad: Deep nesting
apps/nexus-api/src/
├── services/
│   └── domain/
│       └── user/
│           └── implementations/
│               └── user.service.ts
```

**Rationale**: Deep nesting makes navigation tedious and import paths unnecessarily long.

### 2. Follow Folder-by-Feature Convention

**Always collocate related files.** Group files by feature or domain, not by type.

This means:
- ✅ Keep tests alongside the code they test
- ✅ Keep types, services, and controllers for a feature together
- ❌ Don't separate by technical role (all controllers in one folder, all services in another)

## Examples

### ✅ Good: Folder-by-Feature

```
apps/nexus-api/src/
├── users/
│   ├── user.service.ts
│   ├── user.service.test.ts          ← Test next to implementation
│   ├── user.repository.ts
│   ├── user.repository.test.ts
│   ├── user.controller.ts
│   ├── user.types.ts
│   └── user.validation.ts
├── events/
│   ├── event.service.ts
│   ├── event.service.test.ts
│   ├── event.repository.ts
│   ├── event.controller.ts
│   └── event.types.ts
└── shared/
    ├── utils/
    └── middleware/
```

**Benefits:**
- All user-related code is in one place
- Easy to find and modify related files
- Deleting a feature means deleting one folder
- Tests are right next to the code they validate

### ❌ Bad: Folder-by-Technical-Type

```
apps/nexus-api/src/
├── controllers/
│   ├── user.controller.ts
│   └── event.controller.ts
├── services/
│   ├── user.service.ts
│   └── event.service.ts
├── repositories/
│   ├── user.repository.ts
│   └── event.repository.ts
├── types/
│   ├── user.types.ts
│   └── event.types.ts
└── tests/
    ├── user.service.test.ts
    └── event.service.test.ts
```

**Problems:**
- Related files are scattered across multiple folders
- Modifying a feature requires navigating many directories
- Import paths are inconsistent
- Hard to delete or move features


## When to Create Subdirectories

You may create subdirectories when:
- A feature has **many** related sub-features (e.g., `users/profile/`, `users/authentication/`)
- It improves clarity without adding unnecessary depth

**Rule of thumb**: If you're nesting more than 3 levels deep, reconsider your structure.

---

## Related Guidelines

- **[505 - Code Structure](./505-CodeStructure.md)** – Organizing logic within files
- **[Onboarding: Project Architecture](../Onboarding/1-ProjectArchitecture.md)** – Understanding the monorepo structure

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
