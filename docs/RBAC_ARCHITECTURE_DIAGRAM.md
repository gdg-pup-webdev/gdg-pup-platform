# RBAC Architecture Diagrams

## Dynamic RBAC System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXUS WEB (Frontend)                         │
│  ┌──────────────┐  ┌──────────────────────────────────┐         │
│  │   User UI    │  │   Admin UI (Role Manager)        │         │
│  │              │  │  • Create custom roles           │         │
│  │              │  │    (webdevlead, supportteam...)  │         │
│  │              │  │  • Assign permissions to roles   │         │
│  │              │  │  • Assign roles to users         │         │
│  └──────┬───────┘  └──────┬───────────────────────────┘         │
│         │                 │                                      │
│         └─────────────────┴──────────────────┐                   │
│                                              │                   │
│                       Supabase Session Token │                   │
└──────────────────────────────────────────────┼───────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE AUTH                               │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ✓ Validates JWT tokens (AUTHENTICATION)              │     │
│  │  ✓ Manages user sessions                              │     │
│  │  ✓ Returns authenticated user info                    │     │
│  │  ✗ Does NOT handle roles/permissions (AUTHORIZATION)  │     │
│  └────────────────────────────────────────────────────────┘     │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   NEXUS API (Backend)                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Middleware Layer                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Token Parser │→ │ requireAuth  │→ │requirePerm   │  │   │
│  │  │ + Load Roles │  │ (Check user) │  │(Check access)│  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │         RBAC Route Handlers (AUTHORIZATION)            │     │
│  │  ┌────────────────────────────────────────────────┐   │     │
│  │  │ POST   /api/rbac/roles                         │   │     │
│  │  │ GET    /api/rbac/roles                         │   │     │
│  │  │ PATCH  /api/rbac/roles/:id                     │   │     │
│  │  │ DELETE /api/rbac/roles/:id                     │   │     │
│  │  │                                                │   │     │
│  │  │ POST   /api/rbac/roles/:id/permissions         │   │     │
│  │  │ PATCH  /api/rbac/permissions/:id               │   │     │
│  │  │ DELETE /api/rbac/permissions/:id               │   │     │
│  │  │                                                │   │     │
│  │  │ POST   /api/rbac/users/:userId/roles           │   │     │
│  │  │ DELETE /api/rbac/users/:userId/roles/:roleId   │   │     │
│  │  └────────────────────────────────────────────────┘   │     │
│  └────────────────────────────────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │              Service Layer (Business Logic)            │     │
│  │  ┌──────────────────┐  ┌──────────────────┐           │     │
│  │  │  role.service    │  │permission.service│           │     │
│  │  │  • Wrap repo     │  │  • Wrap repo     │           │     │
│  │  │    with tryCatch │  │    with tryCatch │           │     │
│  │  └──────────────────┘  └──────────────────┘           │     │
│  └────────────────────────────────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │      Repository Layer (Database Access)                │     │
│  │  ┌──────────────────┐  ┌──────────────────┐           │     │
│  │  │ role.repository  │  │permission.repo   │           │     │
│  │  │  • Handle PG     │  │  • Handle PG     │           │     │
│  │  │    error codes   │  │    error codes   │           │     │
│  │  │  • 23505, 23503  │  │  • 23505, 23503  │           │     │
│  │  └──────────────────┘  └──────────────────┘           │     │
│  └────────────────────────────────────────────────────────┘    │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              SUPABASE (PostgreSQL) - Database-First             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  user_role (Dynamic Roles)                               │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │ id | role_name (UNIQUE) | description           │     │   │
│  │  ├─────────────────────────────────────────────────┤     │   │
│  │  │ 1  | webdevlead         | Web Dev Team Lead     │     │   │
│  │  │ 2  | supportteam        | Support Team Member   │     │   │
│  │  │ 3  | learninghead       | Learning Resources    │     │   │
│  │  │ 4  | eventcoordinator   | Event Coordinator     │     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             │ 1:N                                │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  user_role_permission (Granular Permissions)             │   │
│  │  ┌────────────────────────────────────────────────┐      │   │
│  │  │ role_id | resource   | read | write | delete   │      │   │
│  │  ├────────────────────────────────────────────────┤      │   │
│  │  │ 1       | events     | ✓    | ✓     | ✓        │      │   │
│  │  │ 1       | articles   | ✓    | ✓     | ✗        │      │   │
│  │  │ 2       | wallet     | ✓    | ✗     | ✗        │      │   │
│  │  │ 3       | resources  | ✓    | ✓     | ✓        │      │   │
│  │  │ UNIQUE(role_id, resource_name) ← PG Constraint │      │   │
│  │  └────────────────────────────────────────────────┘      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────────┐   │
│  │  user_role_junction (User ↔ Role Assignment)             │   │
│  │  ┌────────────────────────────────────────────────┐      │   │
│  │  │ id | user_id | role_id                         │      │   │
│  │  ├────────────────────────────────────────────────┤      │   │
│  │  │ 1  | uuid1   | 1 (webdevlead)                  │      │   │
│  │  │ 2  | uuid2   | 2 (supportteam)                 │      │   │
│  │  │ 3  | uuid3   | 3 (learninghead)                │      │   │
│  │  │ UNIQUE(user_id, role_id) ← PG Constraint       │      │   │
│  │  └────────────────────────────────────────────────┘      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Dynamic Role Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN CREATES CUSTOM ROLE                                      │
│                                                                  │
│  POST /api/rbac/roles                                           │
│  {                                                              │
│    "role_name": "webdevlead",                                   │
│    "description": "Web Development Team Lead"                   │
│  }                                                              │
│                                                                  │
│  ↓ Repository handles 23505 if duplicate                        │
│  ↓ PostgreSQL enforces UNIQUE constraint on role_name           │
│  ↓                                                              │
│  ✓ Role created in user_role table                             │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN ASSIGNS PERMISSIONS TO ROLE                              │
│                                                                  │
│  POST /api/rbac/roles/1/permissions                             │
│  {                                                              │
│    "resource_name": "events",                                   │
│    "can_read": true,                                            │
│    "can_write": true,                                           │
│    "can_update": true,                                          │
│    "can_delete": true                                           │
│  }                                                              │
│                                                                  │
│  ↓ Repository handles 23505 if duplicate (role+resource)        │
│  ↓ PostgreSQL enforces UNIQUE(role_id, resource_name)           │
│  ↓                                                              │
│  ✓ Permission created in user_role_permission table             │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN ASSIGNS ROLE TO USER                                     │
│                                                                  │
│  POST /api/rbac/users/uuid-123/roles                            │
│  {                                                              │
│    "role_id": 1                                                 │
│  }                                                              │
│                                                                  │
│  ↓ Repository handles 23505 if already assigned                 │
│  ↓ Repository handles 23503 if role_id doesn't exist            │
│  ↓ PostgreSQL enforces UNIQUE(user_id, role_id)                 │
│  ↓                                                              │
│  ✓ Assignment created in user_role_junction table               │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  USER MAKES AUTHENTICATED REQUEST                               │
│                                                                  │
│  GET /api/event-system/events                                   │
│  Authorization: Bearer <supabase_jwt>                           │
│                                                                  │
│  ↓ Token Parser → Verify with Supabase                          │
│  ↓ Load user roles with permissions from DB                     │
│  ↓                                                              │
│  req.user = { id: "uuid-123", email: "..." }                    │
│  req.roles = [{                                                 │
│    role_name: "webdevlead",                                     │
│    permissions: [{                                              │
│      resource_name: "events",                                   │
│      can_read: true,                                            │
│      can_write: true,                                           │
│      can_update: true,                                          │
│      can_delete: true                                           │
│    }]                                                           │
│  }]                                                             │
│                                                                  │
│  ↓ requireAuth() → Check req.user exists                        │
│  ↓ requirePermission("events", "read") → Check permissions      │
│  ↓                                                              │
│  ✓ Access granted → Execute route handler                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow with Dynamic RBAC

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ 1. HTTP Request with Supabase JWT
       │    Authorization: Bearer <token>
       ▼
┌─────────────────────────────────────────────────┐
│      Token Parser Middleware (NEW)              │
│                                                 │
│  1. Extract JWT from headers                    │
│  2. Verify with Supabase Auth                   │
│     const { user } = await supabase             │
│       .auth.getUser(token)                      │
│                                                 │
│  3. Load user's dynamic roles:                  │
│     SELECT ur.*, urp.*                          │
│     FROM user_role_junction urj                 │
│     JOIN user_role ur ON urj.role_id = ur.id    │
│     JOIN user_role_permission urp               │
│       ON ur.id = urp.user_role_id               │
│     WHERE urj.user_id = user.id                 │
│                                                 │
│  4. Attach to request:                          │
│     req.user = user                             │
│     req.roles = [{ role_name: "webdevlead",     │
│                    permissions: [...] }]        │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│    authMiddleware.requireAuth()                 │
│                                                 │
│  if (!req.user) {                               │
│    throw ServerError.unauthorized()             │
│  }                                              │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│   authMiddleware.requirePermission()            │
│   (resource: string, action: string)            │
│                                                 │
│  const hasPermission = req.roles.some(role =>   │
│    role.permissions.some(perm =>                │
│      perm.resource_name === resource &&         │
│      perm[`can_${action}`] === true             │
│    )                                            │
│  );                                             │
│                                                 │
│  if (!hasPermission) {                          │
│    throw ServerError.forbidden(                 │
│      `Missing ${action} permission on ${res}`   │
│    )                                            │
│  }                                              │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│      Ownership Check (if applicable)            │
│                                                 │
│  // For user-owned resources                    │
│  if (resource.user_id !== req.user.id) {        │
│    throw ServerError.forbidden(                 │
│      "Cannot modify another user's resource"    │
│    )                                            │
│  }                                              │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│          Route Handler                          │
│                                                 │
│  • Execute business logic                       │
│  • Access database via repository               │
│  • Return JSON response                         │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   Client    │
│  Response   │
└─────────────┘
```

---

## Authentication Flow (Supabase-First)

```
┌─────────────────┐
│  User Login     │
│  (Frontend)     │
└────────┬────────┘
         │
         │ supabase.auth.signInWithPassword()
         ▼
┌─────────────────────────────────────┐
│      SUPABASE AUTH SERVICE          │
│  • Validates credentials            │
│  • Creates session                  │
│  • Returns JWT + refresh token      │
└────────┬────────────────────────────┘
         │
         │ Session stored in browser
         ▼
┌─────────────────────────────────────┐
│    Subsequent API Requests          │
│  • Browser sends session cookie     │
│  • OR Authorization: Bearer <JWT>   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│    NEXUS API: Token Parser          │
│  const { data: { user } } =         │
│    await supabase.auth.getUser()    │
│                                     │
│  if (user) {                        │
│    req.user = user                  │
│    // Load roles & permissions      │
│  }                                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   authMiddleware.requireAuth()      │
│  ✓ User authenticated by Supabase   │
└─────────────────────────────────────┘
```

---

## Current auth.middleware.ts Methods

### 1. requireAuth()

```typescript
// Ensures user is authenticated (by Supabase)
router.get("/profile", authMiddleware.requireAuth(), userController.getProfile);
```

**Flow**:

```
Request → Check req.user
          ├─ User exists? ✓ Continue
          └─ No user? ✗ throw 401 Unauthorized
```

### 2. requireAdminRole()

```typescript
// Ensures user has 'admin' role
router.delete(
  "/users/:id",
  authMiddleware.requireAuth(),
  authMiddleware.requireAdminRole(),
  userController.delete,
);
```

**Flow**:

```
Request → Check req.role === 'admin'
          ├─ Is admin? ✓ Continue
          └─ Not admin? ✗ throw 403 Forbidden
```

### 3. requireAnyOfTheseRoles([...])

```typescript
// Ensures user has one of the specified roles
router.post(
  "/events",
  authMiddleware.requireAuth(),
  authMiddleware.requireAnyOfTheseRoles(["admin", "moderator"]),
  eventController.create,
);
```

**Flow**:

```
Request → Check req.role in allowedRoles
          ├─ Match found? ✓ Continue
          └─ No match? ✗ throw 403 Forbidden
```

---

## Enhanced Middleware Chain (Recommended)

### Current State

```typescript
// What you have now
router.post(
  "/events",
  authMiddleware.requireAuth(), // ✓ Auth check
  authMiddleware.requireAnyOfTheseRoles(["admin"]), // ✓ Role check
  eventController.create,
);
```

### What's Missing (To Add)

```typescript
// What you should add
router.post(
  "/events",
  tokenParserFromHeaders, // ← ADD: Parse token & load roles/permissions
  authMiddleware.requireAuth(), // ✓ Already have
  authMiddleware.requirePermission(
    // ← ADD: Check granular permissions
    "events",
    "write", (Dynamic RBAC)

```

┌─────────────────────┐
│ auth.users │ ← Supabase Auth (JWT, sessions, passwords)
│─────────────────────│
│ id (PK) │
│ email │
│ encrypted_password │
└──────┬──────────────┘
│
│ 1:1 (Reference)
▼
┌─────────────────────┐
│ public.user │ ← Your custom user profile
│─────────────────────│
│ id (PK) = auth.id │
│ gdg_id │
│ display_name │
│ status │
└──────┬──────────────┘
│
│ 1:N (User can have multiple roles)
▼
┌──────────────────────────────────────────┐
│ user_role_junction │
│──────────────────────────────────────────│
│ id (PK) │
│ user_id (FK) ──────────► user.id │
│ role_id (FK) ──────────► user_role.id │
│ │
│ CONSTRAINT: UNIQUE(user_id, role_id) │
│ CONSTRAINT: FK CASCADE on role delete │
└──────────────────────────────────────────┘
│
│ N:1
▼
┌──────────────────────────────────────────┐
│ user_role (Dynamic Roles) │
│──────────────────────────────────────────│
│ id (PK) │
│ role_name (VARCHAR) ← "webdevlead" │
│ description │
│ created_at │
│ │
│ CONSTRAINT: UNIQUE(role_name) │
│ │
│ Examples: │
│ • webdevlead │
│ • supportteam │
│ • learninghead │
│ • eventcoordinator │
│ • contentcreator │
└──────────────────┬───────────────────────┘
│
│ 1:N (Role can have permissions on many resources)
▼
┌──────────────────────────────────────────────────┐
│ user_role_permission (Granular Permissions) │
│──────────────────────────────────────────────────│
│ id (PK) │
│ user_role_id (FK) ──────────► user_role.id │
│ resource_name (VARCHAR) ← "events", "articles" │
│ can_read (BOOLEAN) │
│ can_write (BOOLEAN) │
│ can_update (BOOLEAN) │
│ can_delete (BOOLEAN) │
│ │
│ CONSTRAINT: UNIQUE(user_role_id, resource_name) │
│ CONSTRAINT: FK CASCADE on role delete │
│ │
│ Example: webdevlead on "events" │
│ • can_read = true │
│ • can_write = true │
│ • can_update = true │
│ • can_delete = true │
└──────────────────────────────────────────────────┘

KEY DESIGN DECISIONS:

1. Roles are NOT hardcoded - admins create them dynamically
2. Permissions are granular per resource (events, articles, wallet, etc.)
3. PostgreSQL constraints enforce uniqueness (not application code)
4. Cascade delete: Deleting a role removes all assignments & permissions
5. One user can have multiple roles (many-to-many via junction)

---

## Supabase Integration Points

### Frontend (nexus-web)

```typescript
// User logs in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password",
});

// Supabase automatically manages session
// Session is sent with every API request
```

### Backend (nexus-api)

```typescript
// Token parser extracts and validates
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// Get authenticated user from Supabase
const {
  data: { user },
  error,
} = await supabase.auth.getUser(token);

if (user) {
  req.user = user;
  // Load your custom RBAC data
  req.role = await getUserPrimaryRole(user.id);
  req.roles = await getUserRoles(user.id);
  req.userPermissions = await getUserPermissions(user.id);
}
```

---

## Database Entity Relationship

````
┌─────────────────────┐
│    auth.users       │  ← Supabase managed
│─────────────────────│
│ id (PK)             │
│ email               │
│ encrypted_password  │
└──────┬──────────────┘
       │
       │ 1:1 (Reference)
       ▼
┌─────────────────────┐
│   public.user       │  ← Your custom table
│─────────────────────│
│ id (PK) = auth.id   │
│ gdg_id              │
│ display_name        │
│ status              │
└──────┬──────────────┘
       │
       │ 1:N
       ▼
┌─────────────────────────────┐
│  user_role_junction         │
│─────────────────────────────│
│ id (PK)                     │
│ user_id (FK) ───────────────┼──► user.id
│ role_id (FK)                │
└──────┬──────────────────────┘
       │ N:1
       ▼
┌─────────────────────┐
│   user_role         │
│─────────────────────│
│ id (PK)             │
│ role_name (unique)  │
│ description         │
└──────┬──────────────┘
       │ 1:N
       ▼
┌─────────────────────────────┐
│  user_role_permission       │
│─────────────────────────────│
│ id (PK)                     │
│ user_role_id (FK) ──────────┼──► user_role.id
│ resource_name               │
│ can_read   ynamic RBAC Architecture

### Division of Responsibilities

| Component                         | Responsibility                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Supabase Auth**                 | • User authentication (login, signup)<br>• Session management<br>• JWT validation<br>• Password hashing                  |
| **Token Parser Middleware**       | • Extract JWT from headers<br>• Verify with Supabase<br>• Load user's dynamic roles<br>• Load role permissions          |
| **requireAuth()**                 | • Check if req.user exists<br>• Throw 401 if not authenticated                                                           |
| **requirePermission()**           | • Check req.roles for specific permission<br>• Verify resource + action (read/write/update/delete)<br>• Throw 403 if no |
| **Role Repository**               | • Create/read/update/delete roles<br>• Handle PostgreSQL error codes (23505, 23503)<br>• Assign roles to users          |
| **Permission Repository**         | • Create/read/update/delete permissions<br>• Handle PostgreSQL error codes<br>• Link permissions to roles               |
| **PostgreSQL Constraints**        | • Enforce UNIQUE(role_name)<br>• Enforce UNIQUE(user_id, role_id)<br>• Enforce UNIQUE(role_id, resource_name)           |
| **Route Handlers (RBAC System)**  | • POST /api/rbac/roles<br>• POST /api/rbac/roles/:id/permissions<br>• POST /api/rbac/users/:userId/roles                |
| **Protected Route Handlers**      | • Use requireAuth() + requirePermission()<br>• Execute business logic<br>• Return response                               |

### Key Architectural Decisions

1. **Supabase handles ONLY authentication** - JWT validation, sessions, passwords
2. **Application handles authorization** - Dynamic roles, granular permissions
3. **Database-first approach** - PostgreSQL enforces uniqueness, foreign keys
4. **Error handling** - Repository catches PostgreSQL codes (23505, 23503, PGRST116)
5. **Dynamic roles** - Admins create custom roles ("webdevlead", "supportteam") via API
6. **Granular permissions** - Per-resource permissions (events.read, articles.write, wallet.delete)
7. **Separate endpoints** - Role management and permission management are separate API routes

### Implementation Pattern

```typescript
// 1. Admin creates role
POST /api/rbac/roles
{ "role_name": "webdevlead" }

// 2. Admin assigns permissions to role
POST /api/rbac/roles/1/permissions
{ "resource_name": "events", "can_read": true, "can_write": true }

// 3. Admin assigns role to user
POST /api/rbac/users/uuid-123/roles
{ "role_id": 1 }

// 4. User makes request
GET /api/event-system/events
→ Token Parser loads roles + permissions
→ requireAuth() checks authentication
→ requirePermission("events", "read") checks authorization
→ Route handler executes
````

---

**Key Takeaways**:

- ✅ **Supabase Auth = Authentication** (Who are you?)
- ✅ **Your RBAC System = Authorization** (What can you do?)
- ✅ **Dynamic Roles** - Not hardcoded, created by admins
- ✅ **Granular Permissions** - Per-resource read/write/update/delete
- ✅ **Database-First** - PostgreSQL enforces rules, app handles errors

---

**Architecture Version**: 3.0 (Dynamic RBAC)
**Last Updated**: January 23, 2026
**Status**: In Development (40% Repository, 20% Service, 0% Controllers)
);

````

### Example 3: Permission-Based (Future)

```typescript
router.post(
  "/events",
  tokenParserFromHeaders, // ← TO ADD
  authMiddleware.requireAuth(),
  authMiddleware.requirePermission(
    // ← TO ADD
    "events",
    "write",
  ),
  eventController.create,
);
````

---

## API Endpoint Security Levels

### 🔓 Public (No Auth)

```
GET  /api/event-system/events
GET  /api/publication-system/articles
GET  /api/resource-system/resources
```

### 🔒 Authenticated (Supabase Auth Required)

```
POST   /api/event-system/checkin
GET    /api/user-system/users/:userId/wallet  (own only)
PATCH  /api/user-resource-system/projects/:id (own only)
```

### 🔐 Role-Based (requireAdminRole / requireAnyOfTheseRoles)

```
POST   /api/event-system/events              (admin/moderator)
DELETE /api/event-system/events/:id          (admin)
POST   /api/rbac-system/roles                (admin)
```

### 🛡️ Permission-Based (Future - requirePermission)

```
POST   /api/event-system/events              (events.write)
DELETE /api/event-system/events/:id          (events.delete)
PUT    /api/publication-system/articles/:id  (articles.update)
```

---

## Summary: Division of Responsibilities

| Component         | Responsibility |
| ----------------- | -------------- |
| **Supabase Auth** |

```
• User authentication
• Session management
• Token validation
• Password hashing |
```

| **Token Parser** |

```
• Extract session/token
• Call Supabase to verify
• Load roles & permissions from DB
• Populate req.user |
```

| **authMiddleware.requireAuth()** |

```
• Check if req.user exists
• Throw 401 if not authenticated |
```

| **authMiddleware.requireAdminRole()** |

```
• Check if req.role === 'admin'
• Throw 403 if not authorized |
```

| **authMiddleware.requireAnyOfTheseRoles()** |

```
• Check if req.role in allowed list
• Throw 403 if not authorized |
```

| **requirePermission() (Future)** |

```
• Check granular permissions
• Verify resource + action
• Throw 403 if not allowed |
```

| **Route Handlers** |

```
• Business logic
• Database operations
• Return response |

---

**Key Takeaway**:
- ✅ **Supabase handles ALL authentication** (login, tokens, sessions)
- ✅ **Your middleware handles authorization** (roles, permissions, ownership)
- ✅ **Current auth.middleware.ts works** - just needs permission methods added

---

**Diagrams Version**: 2.0
**Compatible With**: RBAC_ANALYSIS_AND_BLUEPRINT.md v1.0
**Last Updated**: January 23, 2026
```
