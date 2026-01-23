
## Best Practices

### ✅ Contract Best Practices

1. **Always use `createEndpoint()`** for endpoints
2. **Use `SchemaFactory`** for consistent response formats
3. **Include standard errors** (400, 500) in all endpoints
4. **Define DTOs** for insert and update operations
5. **Use Zod refinements** for complex validation

### ✅ Backend Best Practices

1. **Follow the 3-layer architecture**: Controller → Service → Repository
2. **Use dependency injection** in constructors
3. **Return `{ data, error }` tuples** from services
4. **Throw `ServerError`** for HTTP errors
5. **Use middleware** for cross-cutting concerns (auth, logging)

### ✅ Frontend Best Practices

1. **Use the type-safe API client** (`callEndpoint`)
2. **Create custom hooks** for reusable API logic
3. **Handle loading and error states** properly
4. **Use environment variables** for API URLs
5. **Implement optimistic updates** for better UX

### ✅ Database Best Practices

1. **Use UUID** for primary keys
2. **Add timestamps** (`created_at`, `updated_at`)
3. **Define foreign key constraints** for data integrity
4. **Use Row-Level Security (RLS)** in Supabase
5. **Index frequently queried columns**

---