 


## Troubleshooting

### ❌ Common Issues

**Issue: "Property 'X' does not exist on Contract"**

- **Cause**: typo in the export name
- **Fix**: check if the export name is correct
 

**Issue: "Module not found"**

- **Cause**: Package not installed or linked
- **Fix**: Run `pnpm install` at the root of the repository to reinstall packages

**Issue: "Supabase RLS blocking requests"**

- **Cause**: Row-Level Security policies not configured
- **Fix**: Add policies in Supabase Dashboard or disable RLS for testing
