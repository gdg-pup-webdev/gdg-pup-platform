# RBAC System Implementation - Current Progress

**Last Updated:** January 23, 2026  
**Status:** Phase 1 - Repository Layer (In Progress)

---

## 🔄 Changes Made to RBAC System

### 1. Centralized Supabase Client (`src/lib/supabase.ts`)

**Purpose:** Single source of truth for Supabase database client across the entire application.

```typescript
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";
import { configs } from "../configs/configs";

export const supabase = createClient<Database>(
  configs.supabaseUrl,
  configs.supabaseKey,
);
```

`
**Why:** Eliminates duplicate client instantiation, ensures consistent configuration, simplifies testing.

---

### 2. Extended ServerError Classes

**File:** `src/classes/ServerError.ts`

#### RepositoryConflictError

**Purpose:** Handles PostgreSQL unique constraint violations (error code 23505) when a resource already exists.

```typescript
export class RepositoryConflictError extends ServerError {
  constructor(detail: string = "Resource already exists") {
    super({ statusCode: 409, title: "Resource Error", detail: detail });
  }
}
```

**Usage in RBAC:**

- Thrown when creating a role with duplicate `role_name`
- Thrown when assigning a role to a user who already has that role
- Thrown when creating permission for role+resource combination that already exists

**HTTP Response:**

```json
{
  "statusCode": 409,
  "status": "fail",
  "title": "Resource Error",
  "detail": "Role 'webdevlead' already exists",
  "context": []
}
```

#### NotFoundError

**Purpose:** Handles resource not found scenarios (PostgreSQL PGRST116 error code).

```typescript
export class NotFoundError extends ServerError {
  constructor(detail: string = "Resource not found") {
    super({ statusCode: 404, title: "Not Found", detail: detail });
  }
}
```

**Usage in RBAC:**

- Thrown when querying a role by ID that doesn't exist
- Thrown when attempting to update/delete non-existent role
- Thrown when foreign key constraint fails (23503) - referenced resource missing

#### DatabaseError

**Purpose:** Generic database errors that aren't conflict or not-found scenarios.

```typescript
export class DatabaseError extends ServerError {
  constructor(detail: string = "Database Error") {
    super({ statusCode: 500, title: "Database Error", detail: detail });
  }
}
```

**Usage in RBAC:**

- Thrown for unexpected database errors
- Thrown when PostgreSQL returns errors other than 23505, 23503, PGRST116

#### RepositoryError

**Purpose:** General repository layer errors (fallback).

```typescript
export class RepositoryError extends ServerError {
  constructor(detail: string = "Database Error") {
    super({ statusCode: 500, title: "Database Error", detail: detail });
  }
}
```

---

### 3. Database-First Error Handling Pattern

**Key Principle:** Let PostgreSQL constraints enforce rules, catch error codes in repository layer.

**Before (Application-Level Check):**

```typescript
// ❌ Race condition risk - two simultaneous requests could both pass this check
const existing = await this.roleExistsByName(roleName);
if (existing) {
  throw new Error("Role already exists");
}
await this.createRole(roleData);
```

**After (Database-First):**

```typescript
// ✅ PostgreSQL enforces uniqueness atomically
try {
  const { data, error } = await supabase
    .from(this.roleTable)
    .insert(roleData)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new RepositoryConflictError(
        `Role "${roleData.role_name}" already exists`,
      );
    }
    throw new DatabaseError(error.message);
  }
  return data;
} catch (error) {
  // Service layer catches and handles
  throw error;
}
```

**PostgreSQL Error Codes We Handle:**
| Code | Meaning | Our Error Class |
|------|---------|----------------|
| 23505 | Unique constraint violation | RepositoryConflictError |
| 23503 | Foreign key violation | NotFoundError |
| 23502 | Not null violation | DatabaseError |
| PGRST116 | No rows returned | Return null (not error) |

---

### 4. Role Repository - Implemented Methods

#### createRole()

**Purpose:** Create a new dynamic role with database-level duplicate prevention.

```typescript
createRole = async (roleData: TablesInsert<"user_role">): Promise<roleRow> => {
  const { data, error } = await supabase
    .from(this.roleTable)
    .insert(roleData)
    .select()
    .single();

  if (error) {
    // PostgreSQL unique constraint violation
    if (error.code === "23505") {
      throw new RepositoryConflictError(
        `Role "${roleData.role_name}" already exists`,
      );
    }
    throw new DatabaseError(error.message);
  }
  return data;
};
```

**What it does:**

- Inserts role into `user_role` table
- Catches 23505 if role_name already exists
- Returns created role with auto-generated ID

---

#### getRolesOfUser()

**Purpose:** Fetch all roles assigned to a user with nested permissions.

```typescript
getRolesOfUser = async (userId: string): RepositoryResultList<roleRow> => {
  const { data, error } = await supabase
    .from(this.junctionTable)
    .select(`*, user_role(*, user_role_permission (*))`)
    .eq("user_id", userId);

  if (error) throw new DatabaseError(error.message);

  const { count, error: countError } = await supabase
    .from(this.junctionTable)
    .select("*, user_role(*)", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) throw new DatabaseError(countError.message);

  return {
    list: data.map((item) => item.user_role as roleRow),
    count: count || 0,
  };
};
```

**What it does:**

- Queries `user_role_junction` table for user's role assignments
- Joins with `user_role` and `user_role_permission` tables
- Returns array of roles with nested permissions
- Provides total count for pagination

**Example Response:**

```json
{
  "list": [
    {
      "id": 1,
      "role_name": "webdevlead",
      "description": "Web Development Team Lead",
      "user_role_permission": [
        {
          "resource_name": "events",
          "can_read": true,
          "can_write": true,
          "can_update": true,
          "can_delete": true
        }
      ]
    }
  ],
  "count": 1
}
```

---

#### getRoleById()

**Purpose:** Fetch a single role by ID, return null if not found (not an error).

```typescript
getRoleById = async (roleId: string): Promise<roleRow | null> => {
  const { data, error } = await supabase
    .from(this.roleTable)
    .select()
    .eq("id", roleId)
    .maybeSingle();

  if (error) throw new DatabaseError(error.message);
  return data;
};
```

**What it does:**

- Uses `.maybeSingle()` instead of `.single()` to avoid PGRST116 error
- Returns `null` if role doesn't exist (not an error - valid scenario)
- Service layer decides whether null is acceptable or should throw NotFoundError

---

### 5. Role Service Layer - tryCatch Pattern

**Purpose:** Wrap repository calls with error handling utility.

```typescript
import { tryCatch } from "../../utils/tryCatch";

export class RoleService {
  createRole = async (
    roleData: TablesInsert<"user_role">,
  ): Promise<roleRow> => {
    return await tryCatch(
      async () => await roleRepositoryInstance.createRole(roleData),
    );
  };

  getRolesOfUser = async (userId: string): RepositoryResultList<roleRow> => {
    return await tryCatch(
      async () => await roleRepositoryInstance.getRolesOfUser(userId),
    );
  };
}
```

**What it does:**

- Catches repository errors (RepositoryConflictError, DatabaseError, etc.)
- Adds context to error stack
- Propagates errors to controller layer
- Controller returns appropriate HTTP response

---

## 📊 Implementation Status Overview

| ** Component **              | ** Status **   | ** Progress ** (Estimated) | ** Priority ** |
| ---------------------------- | -------------- | -------------------------- | -------------- |
| ** Role Repository **        | ✅ Complete    | 100%                       | ✅ HIGH        |
| ** Permission Repository **  | ✅ Complete    | 100%                       | ✅ MEDIUM      |
| ** Role Service **           | ✅ Complete    | 100%                       | ✅ HIGH        |
| ** Permission Service **     | ✅ Complete    | 100%                       | ✅ MEDIUM      |
| ** Role Controller **        | ❌ Not Started | 0%                         | 🟡 MEDIUM      |
| ** Permission Controller **  | ❌ Not Started | 0%                         | 🟡 MEDIUM      |
| ** RBAC Router **            | ❌ Not Started | 0%                         | 🟡 MEDIUM      |
| ** Middleware Enhancement ** | ❌ Not Started | 0%                         | 🟡 MEDIUM      |

---

---

#### 2. Role Repository - Partial Implementation

File [role.repository.ts](../apps/nexus-api/src/modules/rbacSystem/role.repository.ts)

** ✅ Methods Implemented Correctly: **

createRole()

    createRole = async (roleData: TablesInsert<"user_role">): Promise<roleRow> => {
        const { data, error } = await supabase
            .from(this.roleTable)
            .insert(roleData)
            .select()
            .single();
        if (error) {
            // Handle PostgreSQL unique constraint violation
            if (error.code === "23505") {
            throw new RepositoryConflictError(
                `Role "${roleData.role_name}" already exists`,
            );
            }
            throw new DatabaseError(error.message);
        }
        return data;
    };

getRolesOfUser()

    getRolesOfUser = async (userId: string): RepositoryResultList<roleRow> => {
        const { data, error } = await supabase
            .from(this.junctionTable)
            .select(`*, user_role(*, user_role_permission (*))`)
            .eq("user_id", userId);

        if (error) throw new DatabaseError(error.message);

        const { count, error: countError } = await supabase
            .from(this.junctionTable)
            .select("*, user_role(*)", { count: "exact", head: true })
            .eq("user_id", userId);

        if (countError) throw new DatabaseError(countError.message);

        return {
            list: data.map((item) => item.user_role as roleRow),
            count: count || 0,
        };
    };

**Status:** ✅ Working correctly with nested relations

getRoleById()
