# Supabase Schema CLI Sync Workflow

This guide details the steps to safely migrate your database schema from your **Development** Supabase environment to your **Production** Supabase environment using a custom diffing script.

## Step-by-Step Guide

### 1. Extract the Development Schema
1. Link your Supabase CLI to your **Development** project (or update your `.env` password if you're managing connections manually).
2. Use the Supabase CLI to export the structure (schema) without data:
   ```powershell
   # Ensures that table schemas are exported to remote_schema_utf8.sql
   npx supabase db dump --linked --schema public > dev_schema_utf8.sql
   ```
   This will create a `dev_schema_utf8.sql` file inside the `supabase/` folder.

### 2. Extract the Production Schema
1. Link your Supabase CLI to your **Production** project, or change the environment variables/password to point to your Production database.
2. Export the production database structure:
   ```powershell
   # Export to prod_schema_utf8.sql
   npx supabase db dump --linked --schema public > prod_schema_utf8.sql
   ```
   This will create a `prod_schema_utf8.sql` file inside the `supabase/` folder.

### 3. Run the Schema Diff Tool
With both `remote_schema_utf8.sql` (from Dev) and `prod_schema_utf8.sql` (from Prod) sitting in the `supabase/` directory, run the node utility script:

```powershell
node diff_schemas.js
```

This script reads both `remote_schema_utf8.sql` and `prod_schema_utf8.sql` and intelligently compares them. It will identify:
- **New Tables** (in Dev but not Prod)
- **New Columns** (in Dev but not Prod)
- **Removed Tables** (in Prod but not Dev)
- **Removed Columns** (in Prod but not Dev)

It outputs all necessary `CREATE`, `ALTER`, and `DROP` commands into a new file called `sync_dev_to_prod.sql`. This generated SQL is safely formatted and placed in the `supabase/` folder.

### 4. Execute the Output SQL
The generated `sync_dev_to_prod.sql` is ready to be executed:
1. Open the Supabase Studio dashboard for your Production project.
2. Navigate to the **SQL Editor**.
3. Copy the contents of `sync_dev_to_prod.sql` directly into a new query.
4. Review the statements to ensure they correctly represent the changes you wish to apply, and then hit **Run**.
