# Products API - Quick Reference

## Base URL
```
/api/v1/products
```

## Endpoints

### 1. List Products
```bash
curl -X GET "http://localhost:3000/api/v1/products?pageNumber=1&pageSize=10"
```

**Query Parameters:**
- `pageNumber` (optional, default: 1)
- `pageSize` (optional, default: 10)

**Response:**
```json
{
  "status": "success",
  "message": "Products list fetched successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "GDG Platform",
      "description": "The main community platform",
      "category": "Platform",
      "image": "https://example.com/image.png",
      "link": "https://gdg-platform.com",
      "createdAt": "2026-04-06T10:00:00.000Z",
      "updatedAt": "2026-04-06T10:00:00.000Z"
    }
  ],
  "meta": {
    "totalRecords": 1,
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

### 2. Create Product
```bash
curl -X POST "http://localhost:3000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GDG Sparky Fortune",
    "description": "Fortune game for GDG community",
    "category": "Game",
    "image": "https://example.com/sparky.png",
    "link": "https://sparky-fortune.com"
  }'
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "category": "string (required)",
  "image": "URL (required)",
  "link": "URL (optional)"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "GDG Sparky Fortune",
    "description": "Fortune game for GDG community",
    "category": "Game",
    "image": "https://example.com/sparky.png",
    "link": "https://sparky-fortune.com",
    "createdAt": "2026-04-06T10:00:00.000Z",
    "updatedAt": "2026-04-06T10:00:00.000Z"
  }
}
```

---

### 3. Get Single Product
```bash
curl -X GET "http://localhost:3000/api/v1/products/550e8400-e29b-41d4-a716-446655440000"
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Product fetched successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "GDG Sparky Fortune",
    "description": "Fortune game for GDG community",
    "category": "Game",
    "image": "https://example.com/sparky.png",
    "link": "https://sparky-fortune.com",
    "createdAt": "2026-04-06T10:00:00.000Z",
    "updatedAt": "2026-04-06T10:00:00.000Z"
  }
}
```

---

### 4. Update Product
```bash
curl -X PATCH "http://localhost:3000/api/v1/products/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "category": "Updated Category"
  }'
```

**Request Body:** (All fields optional)
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "category": "string (optional)",
  "image": "URL (optional)",
  "link": "URL (optional)"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Name",
    "description": "Fortune game for GDG community",
    "category": "Updated Category",
    "image": "https://example.com/sparky.png",
    "link": "https://sparky-fortune.com",
    "createdAt": "2026-04-06T10:00:00.000Z",
    "updatedAt": "2026-04-06T11:00:00.000Z"
  }
}
```

---

### 5. Delete Product
```bash
curl -X DELETE "http://localhost:3000/api/v1/products/550e8400-e29b-41d4-a716-446655440000"
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Product deleted successfully",
  "data": {
    "success": true
  }
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "status": "fail",
  "message": "Product not found",
  "errors": [...]
}
```

### 400 Bad Request (Validation)
```json
{
  "status": "fail",
  "message": "Validation failed for the request payload",
  "errors": [
    {
      "title": "Invalid Field",
      "detail": "The 'image' field must be a valid URL",
      "moredetails": { "providedValue": "not-a-url" },
      "source": "body.data.image"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error",
  "errors": [...]
}
```

---

## Validation Rules

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | Yes | Non-empty |
| description | string | Yes | Non-empty |
| category | string | Yes | Non-empty |
| image | URL | Yes | Valid URL |
| link | URL | No | Valid URL if provided |

---

## Status Codes

| Code | Meaning | Use |
|------|---------|-----|
| 200 | OK | GET, PATCH, DELETE successful |
| 201 | Created | POST successful |
| 400 | Bad Request | Validation failed |
| 404 | Not Found | Product doesn't exist |
| 500 | Server Error | Server-side issue |

---

## Example: Using TypeScript/JavaScript

```typescript
// Import the contract if needed internally
import { contract } from "@packages/nexus-api-contracts";

// List products
const response = await fetch('/api/v1/products?pageNumber=1&pageSize=10');
const data = await response.json();

// Create product
const createResponse = await fetch('/api/v1/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'New Product',
    description: 'Description',
    category: 'Category',
    image: 'https://example.com/image.png'
  })
});

// Update product
const updateResponse = await fetch('/api/v1/products/{id}', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Updated Name'
  })
});

// Delete product
await fetch('/api/v1/products/{id}', {
  method: 'DELETE'
});
```

---

## Notes

- IDs are UUIDs generated by the system
- Timestamps are in ISO 8601 format (UTC)
- Pagination is zero-based (first page = 1)
- Default page size is 10 items
- All string fields are trimmed
- URLs must be valid and properly formed
