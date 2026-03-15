-- Sparkmates analytics tracking for NFC/QR/direct-link traffic.

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'sparkmates_source'
      and n.nspname = 'public'
  ) then
    create type public.sparkmates_source as enum ('nfc_card', 'qr_code', 'direct_link');
  end if;
end
$$;

create table if not exists public.sparkmates_metric_events (
  id uuid primary key default gen_random_uuid(),
  gdg_id text not null,
  source public.sparkmates_source not null default 'direct_link',
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_sparkmates_metric_events_gdg_id
  on public.sparkmates_metric_events (gdg_id);

create index if not exists idx_sparkmates_metric_events_created_at
  on public.sparkmates_metric_events (created_at desc);

create index if not exists idx_sparkmates_metric_events_source
  on public.sparkmates_metric_events (source);

create or replace view public.sparkmates_scan_counts as
select
  gdg_id,
  source,
  count(*)::bigint as scan_count
from public.sparkmates_metric_events
group by gdg_id, source;

create or replace function public.get_sparkmates_analytics(p_gdg_id text)
returns table (
  source public.sparkmates_source,
  scan_count bigint
)
language sql
stable
as $$
  select source, count(*)::bigint as scan_count
  from public.sparkmates_metric_events
  where gdg_id = p_gdg_id
  group by source
  order by scan_count desc;
$$;
