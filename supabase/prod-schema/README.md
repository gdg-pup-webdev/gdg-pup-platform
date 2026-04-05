# Supabase Prod Schema Split

- `app_schema.sql` contains the app-owned `public` schema objects from the dump.
- `storage_setup.sql` contains the storage schema bootstrap, RLS policies, and grants needed for the buckets used by the app.
- The storage file intentionally excludes Supabase-managed storage internals like table and function definitions.
- Buckets such as `public` and `certificates` still need to exist in the target Supabase project.
