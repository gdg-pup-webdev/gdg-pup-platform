# Products Module Implementation

## Overview

The Products module is a complete CRUD API implementation following the project's Clean Architecture pattern. It provides endpoints to manage GDG products with full contract definition, business logic, and database integration.

## Architecture

### Clean Architecture Layers

```text
Presentation Layer (HTTP)
       ↓
ProductHttpController → ProductRouter
       ↓
Application Layer (Business Logic)
       ↓
ProductController → Use Cases
       ↓
Domain Layer (Business Rules)
       ↓
Product Entity → IProductRepository Interface
       ↓
Infrastructure Layer (Database)
       ↓
SupabaseProductRepository
```

## File Structure

### Contracts (TypeScript-Rest)

```text
packages/nexus-api-contracts/src/
├── models/v1/products/
│   └── products.ts              # ProductObject, ProductInsertDTO, ProductUpdateDTO
└── routes/api/v1/products/
    ├── GET.ts                   # List products
    ├── POST.ts                  # Create product
    └── [id]/
        ├── GET.ts               # Get single product
        ├── PATCH.ts             # Update product
        └── DELETE.ts            # Delete product
```

### Module Implementation

```text
apps/nexus-api/src/v1/modules/products/
├── domain/
│   ├── Product.ts               # Domain entity with validation
│   └── IProductRepository.ts    # Repository interface
├── useCases/
│   ├── CreateProduct.ts
│   ├── GetProduct.ts
│   ├── ListProducts.ts
│   ├── UpdateProduct.ts
│   └── DeleteProduct.ts
├── infrastructure/
│   └── SupabaseProductRepository.ts   # Database implementation
├── ProductController.ts         # Boundary between HTTP and Use Cases
└── index.ts                     # Dependency injection setup
```

### Routes

```text
apps/nexus-api/src/v1/routes/products/
├── products.controller.ts       # HTTP controller
└── products.router.ts           # Express router
```

## API Endpoints

### List Products

```http
GET /api/v1/products?pageNumber=1&pageSize=10
```

**Response:**

```json
{
  "status": "success",
  "message": "Products list fetched successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "category": "Category",
      "image": "https://...",
      "link": "https://...",
      "createdAt": "2026-04-06T...",
      "updatedAt": "2026-04-06T..."
    }
  ],
  "meta": {
    "totalRecords": 100,
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### Create Product

```http
POST /api/v1/products
Content-Type: application/json

{
  "name": "GDG Platform",
  "description": "The main platform for GDG communities",
  "category": "Platform",
  "image": "https://...",
  "link": "https://..." // optional
}
```

**Response:** `201 Created`

### Get Single Product

```http
GET /api/v1/products/:id
```

### Update Product

```http
PATCH /api/v1/products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "category": "Updated Category",
  "image": "https://...",
  "link": "https://..."
}
```

All fields are optional - only provided fields will be updated.

### Delete Product

```http
DELETE /api/v1/products/:id
```

## Database Schema

The module expects a `products` table in Supabase with the following columns:

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  image VARCHAR NOT NULL,
  link VARCHAR,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

## Key Design Patterns

### 1. Domain Entity Pattern

The `Product` class encapsulates business logic:

- Private constructor prevents invalid object creation
- `create()` static method for new products (generates UUID and timestamps)
- `hydrate()` static method for loading from database
- `update()` method for controlled mutations

### 2. Repository Pattern

`IProductRepository` interface abstracts database operations:

- Implementation: `SupabaseProductRepository`
- Enables easy swapping of database providers
- Methods work with Domain entities, not raw data

### 3. Use Case Pattern

Each operation is a separate class:

- `CreateProduct`, `UpdateProduct`, `DeleteProduct`, `GetProduct`, `ListProducts`
- Single responsibility principle
- Easy to test in isolation

### 4. Dependency Injection

All dependencies are wired in `index.ts`:

- Repository instantiated once
- Use cases receive repository
- Controller receives use cases
- HTTP layer receives controller

### 5. HTTP Abstraction

- `ProductHttpController`: Maps HTTP requests to domain operations
- `ProductRouter`: Defines Express routes
- Uses `createExpressController` for contract validation

## Testing (Optional)

To add unit tests, create mock repository:

```typescript
// infrastructure/MockProductRepository.ts
export class MockProductRepository implements IProductRepository {
  public items: Product[] = [];

  async saveNew(product: Product): Promise<void> {
    this.items.push(product);
  }

  // ... implement other methods
}
```

Then test use cases with mocks:

```typescript
// useCases/__tests__/CreateProduct.test.ts
const mockRepo = new MockProductRepository();
const useCase = new CreateProduct(mockRepo);
const product = await useCase.execute({...});
expect(mockRepo.items).toContainEqual(product);
```

## Type System

### ProductObject (DTO from Database)

Represents a product as returned from API:

- id, name, description, category, image, link
- createdAt, updatedAt (ISO strings)

### ProductInsertDTO (Request Body for Create)

Validates creation requests:

- Required: name, description, category, image
- Optional: link
- Validates URLs for image and link

### ProductUpdateDTO (Request Body for Update)

Validates update requests:

- All fields optional
- When provided, validates as per insert rules

### ProductProps (Domain)

Internal representation of a product entity with proper typing

## Integration

The module is automatically integrated through:

1. Route registration in `apps/nexus-api/src/v1/loaders/loadRoutes.ts`
2. Routes mounted at `/products`
3. Contract validation through `contract.api.v1.products.*`

## Next Steps

1. Build contracts: `pnpm --filter @packages/nexus-api-contracts build`
2. Create database table with schema above
3. Start backend: `pnpm dev:backend`
4. Test endpoints at `/api/v1/products`

## Notes

- IDs are generated as UUIDs automatically on creation
- Timestamps (createdAt, updatedAt) are managed by the entity
- All database errors are thrown from repository for proper error handling
- Pagination defaults: pageNumber=1, pageSize=10
- The module follows the exact same patterns as gdgMerch and other modules
