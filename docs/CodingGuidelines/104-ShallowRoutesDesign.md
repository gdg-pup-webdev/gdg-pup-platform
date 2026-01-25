**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**

---

# 104 - Shallow Routes Design

## Overview

Our API endpoints follow a **hybrid approach** combining domain-based, resource-based, and shallow routing conventions. This keeps endpoints intuitive, maintainable, and predictable.

## Core Principles

### 1. Shallow Endpoints

**Endpoints are maximum two resources deep**, where the first resource is a direct parent of the second.

```
✅ /user-system/users/:userId
✅ /events/:eventId/registrations
❌ /organizations/:orgId/events/:eventId/registrations/:regId  (too deep)
```

**Rationale**: Shallow routes prevent overly complex URLs and reduce coupling between resources.

### 2. Resource-Based

Follow the **`/resourceName/:resourceId`** format:

- **Collection**: `/resourceName` – Lists or creates items
- **Item**: `/resourceName/:resourceId` – Access a specific resource

Use **HTTP methods** to specify the action:

| Method | Endpoint | Action |
|--------|----------|--------|
| `GET` | `/users` | List all users |
| `POST` | `/users` | Create a new user |
| `GET` | `/users/:userId` | Get specific user |
| `PUT` | `/users/:userId` | Update user |
| `DELETE` | `/users/:userId` | Delete user |

### 3. Domain-Based

All parent resources must be under a **specific domain** for organization.

```
/user-system/users          # All users
/user-system/users/:userId  # Specific user
/events-system/events              # All events
/events-system/events/:eventId     # Specific event
```

**Rationale**: Domains logically group related resources and make API navigation clearer.

## Examples

### ✅ Good: Shallow, Domain-Based Routes

```typescript
// User domain
GET    /user-system/users                    // List users
POST   /user-system/users                    // Create user
GET    /user-system/users/:userId            // Get user
PUT    /user-system/users/:userId            // Update user
DELETE /user-system/users/:userId            // Delete user

// Event domain
GET    /events-system/events                        // List events
POST   /events-system/events                        // Create event
GET    /events-system/events/:eventId               // Get event
GET    /events-system/events/:eventId/registrations // Get event registrations
POST   /events-system/events/:eventId/registrations // Register for event
```

### ❌ Bad: Deep Nesting

```typescript
// Too deep - violates shallow principle
GET /organizations/:orgId/departments/:deptId/teams/:teamId/members/:memberId

// Instead, flatten it:
GET /organizations/members/:memberId
// Or use query parameters:
GET /organizations/members?teamId=:teamId&deptId=:deptId
```

### ✅ Good: Using Query Parameters Instead of Deep Nesting

```typescript
// Instead of:
GET /users/:userId/events/:eventId/tasks/:taskId

// Use:
GET /tasks/:taskId
GET /tasks?userId=:userId&eventId=:eventId
```

## Route Structure Template

```
/{domain}/{resource}
/{domain}/{resource}/:resourceId
/{domain}/{resource}/:resourceId/{childResource}
/{domain}/{resource}/:resourceId/{childResource}/:childResourceId
```

**Maximum allowed depth**: `domain > parent resource > child resource`

## Benefits

✅ **Predictable**: Consistent patterns make API intuitive  
✅ **Maintainable**: Shallow routes are easier to refactor  
✅ **Decoupled**: Resources aren't tightly bound to complex hierarchies  
✅ **Scalable**: Adding new resources doesn't create deep nesting  

---

## Related Guidelines

- **[103 - Contract-First Development](./103-ContractFirstDevelopment.md)** – Defining endpoint contracts
- **[102 - Layered Architecture](./102-LayeredArchitecture.md)** – Implementing route handlers
- **[Onboarding: Project Architecture](../Onboarding/1-ProjectArchitecture.md)** – Understanding domain organization

---

**[🏠 Repository](../../README.md)** • **[📚 Onboarding](../Onboarding/README.md)** • **[📖 Coding Guidelines](./README.md)**
