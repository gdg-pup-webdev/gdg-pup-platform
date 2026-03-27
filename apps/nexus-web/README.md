# Nexus Web

## Local Run

From workspace root:

```bash
pnpm --filter nexus-web dev
```

Always use the URL printed by Next.js (`Local: http://localhost:xxxx`).

## Route Diagnostics (`/events/gallery/[year]/[id]`)

If the gallery detail route appears as 404, verify runtime first:

1. Confirm only one `next dev` instance is running for `nexus-web`.
2. Confirm the active port from terminal output. Do not assume `3000`.
3. If you see `.next/dev/lock` warnings, stop all `next dev` processes and restart.
4. Re-test using the active local URL.

## Event Gallery Data Behavior

Gallery detail page (`/events/gallery/[year]/[id]`) is the active route for
`View More Event Highlights` and renders a placeholder gallery grid/carousel.

Event metadata fetch (title/date/tag/location) is optional:

1. If event detail is found, header metadata is shown.
2. If event detail fails/missing, fallback title from query param is used.
3. Placeholder gallery tiles still render in both cases (no redirect back to year page).

## Supabase Verification (Safe Path)

Use Supabase SQL Editor or another protected server-side environment (not browser-exposed secret keys).

Check specific event:

```sql
select gdg_id, title, cover_image_url, url, start_date
from scraped_gdg_events
where gdg_id = 87073;
```

Check available image-related columns:

```sql
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'scraped_gdg_events'
order by ordinal_position;
```
