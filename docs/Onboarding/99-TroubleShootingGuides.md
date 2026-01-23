# Troubleshooting Guide

This guide provides solutions to common issues you may encounter during development.

---

### Issue: "Property 'X' does not exist on `contract`"

This error typically occurs in the frontend or backend when trying to access an API endpoint definition that doesn't seem to exist on the auto-generated `contract` object.

-   **Cause 1: Typo in Contract Path**: You may have a typo in the path you are using to access the endpoint on the `contract` object.
    -   **Fix**: Carefully check the path for any misspellings or incorrect segments. Use your IDE's autocompletion to navigate the `contract` object.

-   **Cause 2: Contract Not Updated**: The `typed-rest` build process that generates the contract might not have run or completed successfully after you created or modified a route contract file.
    -   **Fix**: Stop your development server and restart it. Check the console output for any build errors from the `nexus-api-contracts` package.

-   **Cause 3: Incorrect File Naming**: The file-based routing system is case-sensitive and relies on specific naming conventions.
    -   **Fix**: Ensure your route file (e.g., `GET.ts`, `POST.ts`) is named correctly and placed in the right directory structure under `packages/nexus-api-contracts/src/routes/`.

---

### Issue: "Module not found: Can't resolve '[package-name]'"

This error indicates that a package required by one of your applications or libraries is not installed or properly linked in the monorepo.

-   **Cause**: Dependencies are out of sync or were not installed correctly. This can happen after pulling new changes or switching branches.
    -   **Fix**: Run `pnpm install` from the root of the repository. This command will reinstall all dependencies and correctly link the local packages within the monorepo.

    ```bash
    pnpm install
    ```

---

### Issue: "Supabase request blocked by RLS"

This error means that a database query was blocked by Supabase's Row-Level Security (RLS) policies.

-   **Cause 1: Missing or Incorrect Policy**: The table you are trying to query does not have an RLS policy that grants access for the current user's role or `user_id`.
    -   **Fix**: Go to the Supabase Dashboard, navigate to **Authentication > Policies**, and select the relevant table. Review the existing policies or create a new one that allows the intended operation (e.g., `SELECT`, `INSERT`).

-   **Cause 2: Not Authenticated**: The request was made without a valid JWT, so Supabase treats it as an anonymous request.
    -   **Fix**: Ensure your API client is correctly attaching the user's authentication token to the request headers. Verify that the user is logged in and the token is not expired.

-   **Cause 3: Testing in a Local Environment**: When running tests or developing locally, it can sometimes be easier to bypass RLS temporarily.
    -   **Fix (for testing only)**: In the Supabase Dashboard, you can temporarily disable RLS for a specific table. **Warning**: Never do this in a production environment, as it will expose all data in that table.
