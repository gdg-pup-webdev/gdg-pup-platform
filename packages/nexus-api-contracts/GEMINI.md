# Contract-First API Development

All API specifications must be defined before implementation to ensure end-to-end type safety between the frontend and backend.

Contracts are located in `packages/nexus-api-contracts/src` and other similar package projects

## Directory Structure

```text
src/
├── models/
│   └── <moduleName>/
│       └── <resource>.ts      # Zod/cz schemas (Rows, Insert DTOs, Update DTOs)
└── routes/
    └── <moduleName>/
        └── <resource>/
            ├── [id]/          # Bracket notation for path parameters
            │   └── GET.ts     # Defines GET /<moduleName>/<resource>/:id
            └── POST.ts        # Defines POST /<moduleName>/<resource>
```

## 1. Defining Models (`models/`)

- Schemas must be created using the `cz` object.
- Always export variations for different use cases (e.g., Database Row, Insert DTO, Update DTO).

**Example:**

```typescript
import { cz } from "@packages/typed-rest/shared";

export const user = cz.object({
  id: cz.string().uuid(),
  email: cz.string().email(),
  created_at: cz.string().datetime(),
});

export const userInsert = user.omit({ id: true, created_at: true });
export const userUpdate = userInsert.partial();
```

## 2. Defining Routes (`routes/`)

Endpoints use a file-based routing system mapping to the API path. Each file (e.g., `GET.ts`, `POST.ts`) defines the contract for that specific HTTP method.

### Required & Optional Exports

- `response` **(Required)**: Object mapping HTTP status codes to schemas. Must include at least a `200` response.
- `query` _(Optional)_: `cz.object` for URL query parameters.
- `body` _(Optional)_: `cz.object` for request payloads.
- **Documentation Exports**:
  - `docs_summary` **(Required)**: Brief endpoint summary.
  - `docs_description` **(Required)**: Detailed behavior description.
  - _Optional Docs_ (Use only if non-obvious): `docs_params`, `docs_query`, `docs_body`, `docs_response_<status>`.

### Helper Schemas

Leverage pre-made schemas for standard responses:
`import { OpenApiSchemas } from "@packages/typed-rest/shared";`

#### OpenApiSchemas Summary

* **Models**
    * `file()`
    * `files()`
* **Response**
    * `empty()`
    * `boolean()`
    * `single(dataSchema)`
    * `list(dataSchema)`
    * `paginated(dataSchema)`
    * `error()`
    * `standardErrors()`
* **Request**
    * **Query**
        * `paginated()`
    * **Body**
        * `withPayload(dataSchema)`

---

#### OpenApiSchemas Object Shapes (Fields Only)

| Category | Method | Fields |
| :--- | :--- | :--- |
| **Response** | `empty / boolean / single` | `status`, `message`, `data` |
| **Response** | `list / paginated` | `status`, `message`, `data` (array) |
| **Response** | `paginated (meta)` | `totalRecords`, `pageSize`, `currentPage`, `totalPages` |
| **Response** | `error` | `status`, `message`, `errors` (`title`, `detail`, `moreDetails`, `source`) |
| **Request** | `Query.paginated` | `pageNumber`, `pageSize` |
| **Request** | `Body.withPayload` | `data` |


## 3. Auto-Generation

A build step automatically compiles `models/` and `routes/` into `typedrest.contract.ts`. This file exports a single `contract` namespace containing the full API schema, inferred TypeScript types, and flat endpoint definitions used by the backend controllers and frontend API clients.

# API Design & Routing Standards

## 1. Request & Response Shapes

- **Request:** URL Query (filters/sort/paginate), Path Params (IDs), Body (Data).
- **Success Response (2xx):**
  ```json
  {
    "status": "success",
    "message": "...",
    "data": {},
    "meta": { "page": 1, "pageSize": 20, "totalCount": 100, "totalPages": 5 }
  }
  ```
- **Error Response (4xx/5xx):** `status` must be `"fail"` (4xx) or `"error"` (5xx).
  ```json
  {
    "status": "fail",
    "message": "...",
    "errors": [
      {
        "title": "...",
        "detail": "...",
        "moredetails": {},
        "source": "body.data.field"
      }
    ]
  }
  ```

## 2. Resource Architecture

**Base Path:** `{method} /api/{version}/{col1}/:id1/{col2}/:id2/{action}`

- **Constraints:** Maximum **2 collections**, **1 action**. Deep nesting is strictly forbidden.
- **Targeting:** If root and target collections differ, the target _must_ be a child of the root.
- **Naming:** Dependent resources must be prefixed with their parent's name (e.g., `userWalletTransactions`).

## 3. Endpoint Rules by Method

### GET

- **List (`/{col}`):** Use `?pageNumber` and `?pageSize`. Returns `list` inside `data` and pagination in `meta`.
- **Single (`/{col}/:id`):** Support sparse fieldsets (`?fields=id,name`) and shallow inclusions (`?include=childName`).
- **Nested (`/{parent}/:id/{child}`):** Cannot filter by child attributes here; filter only via the target resource's direct endpoint.

### POST

- **Create (`/{col}`):** Expects DTO. Dependent resources _must_ include `parent_id` in the body. Supports batch creation (Array of DTOs).
- **Associate (`/{parent}/:id/{child}`):** Links existing resources. Accepts **IDs only**, NOT full DTOs.
- _Batch Returns:_ 201 (All succeed), 207 (Partial success - returns success list + fail list), 4xx/5xx (All fail).

### PUT / PATCH

- **PUT (`/{col}/:id`):** Complete replacement.
- **PATCH (`/{col}/:id`):** Partial update.

### DELETE

- **Sever Link (`/{parent}/:id/{child}/:id`):** Removes relationship (deletes child only if 1:1 fully dependent).
- **Delete Specific (`/{col}/:id`):** Deletes resource + resolves cascades.
- **Batch Delete (`/{col}/batch`):** Accepts array of IDs in body.

## 4. Advanced Routing Concepts

- **Actions (`POST /.../:id/{action}`):** For complex logic. No query params allowed. **Must** require/recommend an `Idempotency-Key` header. Supports `/batch/{action}`.
- **Computed Attributes (`GET /.../:id/{noun}`):** Derived data. Cannot be followed by an ID.
- **Reserved Keyword:** `batch` cannot be used as an ID.

## 5. Query Conventions

- **Sort:** `?sort_by=field&sort_order=asc|desc` OR `?sort=-field`
- **Filter (Basic):** `?attr=val`
- **Filter (Arrays):** `?status[]=active&status[]=pending`
- **Filter (Operators):** `?price[lt]=50`, `?created_at[gte]=2023-01-01`

## 6. Status Codes & Versioning

- **Codes:** `200` (OK/Delete), `201` (Created), `207` (Multi-Status/Partial), `401` (Unauth), `403` (Forbidden), `404` (Not Found), `409` (Conflict), `422` (Unprocessable/Validation).
- **Versioning:** Bump API version (`v2`) for breaking changes: route removals, changing required fields/types, altering response shapes, or changing pagination/auth behaviors.
