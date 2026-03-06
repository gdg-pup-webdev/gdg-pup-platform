# API Design and Routing Guidelines

## Purpose

This document establishes centralized, opinionated rules for structuring our API endpoints. By adhering to these guidelines, we ensure our system remains intuitive for clients and maintainable for our engineers.

## Goals

- **Predictability:** You can clearly infer what a URL does just by reading it.
- **Consistency:** There is always one standard way to accomplish a task that is guaranteed to work.
- **Usability:** The API is easy to consume, with routes that directly map to developer intent.
- **Maintainability:** Each route has a very specific, singular purpose, making it easier to define implementation details and boundaries.

---

## 1. Request and Response Conventions

We use a simplified, standardized version of the JSON API specification.

### Request Shape

- **Query:** `Record<string, string | string[]>` (Used for filtering, sorting, pagination)
- **Path Params:** `Record<string, string>` (Used for resource identification)
- **Body:** `Object`
- **Data:** `Any` (The primary payload)

### Response Shape

Every response guarantees a predictable top-level structure.

**Good Response (2xx)**

```json
{
  "status": "success",
  "message": "Successfully retrieved the resource.",
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5
  }
}

```

**Bad Response (4xx, 5xx)**
_Note: `status` must be `"fail"` for caller/client faults (4xx) and `"error"` for server faults (5xx)._

```json
{
  "status": "fail",
  "message": "Validation failed for the request payload.",
  "errors": [
    {
      "title": "Invalid Field",
      "detail": "The 'email' field must be a valid email address.",
      "moredetails": { "providedValue": "not-an-email" },
      "source": "body.data.email"
    }
  ]
}
```

---

## 2. Resource Architecture

### The General Route Structure

```http
{method} /api/{version}/{collection1}/:resource1Id/{collection2}/:resource2Id/{action}

```

- **Prefix:** All routes must start with `/api/{version}` (defaults to `v1`).
- **Collections:** A plural noun referring to a collection of resources.
- **Targeting:** Collections can _only_ be followed by the ID of that resource (or the reserved keyword `batch`).
- **Nesting:** IDs can be followed by another collection to target related members.
- **Constraints:** Routes can have a **maximum of two resource collections** and **one action**.

### Resource Types

- **Independent:** A resource that can exist by itself without a parent (e.g., `roles`, `events`). Name it by what it is called.
- **Dependent:** A resource that requires a parent to exist. Prefix its name with the parent's name. Continue the chain until you hit an independent resource (e.g., `userWalletTransactions`, `rolePermissions`).

### Root vs. Target Resources

- **Root Resource:** The first resource defined in the URL.
- **Target Resource:** The last resource defined in the URL.
- _Rule:_ If the root and target are different, the target _must_ be a child of the root.

---

## 3. HTTP Methods & Endpoint Rules

### GET: Retrieving Data

**List Collection**
`GET /api/v1/{collection}`

- General access route.
- **Pagination:** Takes `pageNumber` and `pageSize` in query params.
- **Response:** Success response with `list` in `data` and pagination details in `meta`.

**Get Specific Resource**
`GET /api/v1/{collection}/:resourceId`

- **Sparse Fieldsets:** Use `?fields=id,name` to limit the payload size.
- **Inclusions:** Use `?include=childName` to embed specific children into the response payload. _Deep nesting is strictly forbidden unless explicitly documented._

**List Nested Collection**
`GET /api/v1/{parentCollection}/:parentId/{collection}`

- Retrieves children of a specific parent.
- **Security/Filtering:** You cannot filter by children on this route. Filtering may _only_ be applied to attributes of the target resource.

### POST: Creating and Associating

**Create Resource**
`POST /api/v1/{collection}`

- Creates a new resource. Payload defaults to a DTO.
- If the resource is dependent, `parent_id` _must_ be included in the request body `data`.
- **Batch Creation:** Can accept an array of DTOs.
- _All succeed:_ Returns list of new resources.
- _Partial success:_ Returns `207 Multi-Status` with success list and failed list (includes DTO and failure reason).
- _All fail:_ Returns `4xx/5xx` with failure list.

**Associate Resource**
`POST /api/v1/{parentCollection}/:parentId/{childCollection}/`

- Establishes a parent-child relationship between existing resources.
- **Constraint:** This does NOT create a resource. Passing a full DTO will throw an error. It accepts _only_ IDs (single ID or array of IDs).
- Follows the same partial-success logic as Batch Creation above.

### PUT & PATCH: Updating

**Completely Replace**
`PUT /api/v1/{collection}/:resourceId`

- Completely replaces the resource data.

**Partially Update**
`PATCH /api/v1/{collection}/:resourceId`

- Partially updates the resource.

### DELETE: Removing Data

**Delete Relationship**
`DELETE /api/v1/{parentCollection}/:parentId/{childCollection}/:childId`

- Removes the link. If the child is fully dependent (1:1), the child is permanently deleted. If independent, only the relationship is severed.

**Delete Specific**
`DELETE /api/v1/{collection}/:resourceId`

- Deletes the resource and resolves relationships (either cascading deletes or nullifying foreign keys, depending on implementation).

**Batch Delete**
`DELETE /api/v1/{collection}/batch`

- Deletes multiple resources using an array of IDs provided in the request body.

---

## 4. Advanced Concepts

### Actions (Complex Business Logic)

Actions are verbs placed after a resource ID. They handle operations that standard REST verbs cannot sufficiently describe.

**Action on Specific Resource**
`POST /api/v1/{collection}/:resourceId/{action}`

- **Method:** Always `POST`.
- **Params:** No query parameters allowed. All context must be in the request body.
- **Idempotency:** Complex actions _must_ require (or strongly recommend) an `Idempotency-Key` header to prevent data corruption from retries on spotty connections.

**Action on Batch of Resources**
`POST /api/v1/{collection}/batch/{action}`

- Performs the action on an array of IDs in the body.

### Computed Attributes

Computed attributes are nouns placed after a resource ID that represent derived data, not physical collections.

**Get Computed Attribute**
`GET /api/v1/{collection}/:resourceId/{noun}`

- **Method:** Always `GET`.
- **Constraint:** Cannot be followed by an ID, as they are computed shapes, not collections.

### Reserved Keywords

- **`batch`**: Cannot be used as a resource ID. Endpoint logic must intercept `batch` in the URL path and branch to multi-resource logic.

---

## 5. Standardized Querying

To maintain predictability across all list endpoints, use the following conventions:

- **Sorting:** `?sort_by=fieldName&sort_order=asc|desc` (Alternatively, `?sort=-fieldName`).
- **Basic Filtering:** `?attribute=value` or `?child_name_id=id`.
- **Complex Filtering (Arrays):** `?status[]=active&status[]=pending`
- **Complex Filtering (Operators):** `?price[lt]=50` or `?created_at[gte]=2023-01-01`

---

## 6. HTTP Status Codes

Always return the most accurate status code for the operation.

| Code    | Status        | Usage                                                                         |
| ------- | ------------- | ----------------------------------------------------------------------------- |
| **200** | OK            | Standard success, or successful `DELETE`                                      |
| **201** | Created       | Successful `POST` creation                                                    |
| **207** | Multi-Status  | Batch operations where some succeeded and some failed                         |
| **401** | Unauthorized  | Missing or invalid authentication                                             |
| **403** | Forbidden     | Authenticated, but lacks required permissions                                 |
| **404** | Not Found     | Resource or route does not exist                                              |
| **409** | Conflict      | State conflict (e.g., resource already exists)                                |
| **422** | Unprocessable | Payload is syntactically correct but semantically invalid (Validation failed) |

---

## 7. API Versioning (Breaking Changes)

A new API version (e.g., `v2`) must be created if any of the following occur:

1. **Route Changes:** Removing a route or fundamentally changing its business semantic.
2. **Request Changes:** Removing a field, making an optional field required, or changing a field's data type.
3. **Response Changes:** Removing a field, changing a field type, altering the shape of the JSON response, or changing the error format.
4. **Behavioral Changes:** Changing auth requirements, altering standard pagination behavior, or introducing changes that crash the client or fail existing validations.
