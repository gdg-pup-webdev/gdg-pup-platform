-- Full Sparkmates NFC system migration (idempotent)
-- Includes:
-- 1) Unified source analytics table + helper view/function
-- 2) NFC lifecycle table keyed by gdg_id business identifier

-- ------------------------------------------------------------
-- Analytics source enum
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- Normalize public.user.gdg_id into the business identifier
-- ------------------------------------------------------------
alter table public."user"
  alter column gdg_id drop default;

alter table public."user"
  alter column gdg_id type text using gdg_id::text;

update public."user" u
set gdg_id = gm.gdg_id
from public.gdg_members gm
where lower(u.email) = lower(gm.email);

create unique index if not exists idx_user_gdg_id_unique
  on public."user" (gdg_id)
  where gdg_id is not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_gdg_id_fkey'
      and connamespace = 'public'::regnamespace
  ) then
    alter table public."user"
      add constraint user_gdg_id_fkey
      foreign key (gdg_id)
      references public.gdg_members (gdg_id)
      on update cascade
      on delete restrict
      not valid;
  end if;
end
$$;

-- ------------------------------------------------------------
-- Sparkmates metric events
-- ------------------------------------------------------------
create table if not exists public.sparkmates_metric_events (
  id uuid primary key default gen_random_uuid(),
  gdg_id text not null,
  source public.sparkmates_source not null default 'direct_link',
  user_agent text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'sparkmates_metric_events_gdg_id_fkey'
      and connamespace = 'public'::regnamespace
  ) then
    alter table public.sparkmates_metric_events
      add constraint sparkmates_metric_events_gdg_id_fkey
      foreign key (gdg_id)
      references public.gdg_members (gdg_id)
      on update cascade
      on delete restrict
      not valid;
  end if;
end
$$;

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

-- ------------------------------------------------------------
-- NFC card status enum
-- ------------------------------------------------------------
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'nfc_card_status'
      and n.nspname = 'public'
  ) then
    create type public.nfc_card_status as enum ('issued', 'activated', 'suspended', 'revoked');
  end if;
end
$$;

-- ------------------------------------------------------------
-- NFC lifecycle table
-- ------------------------------------------------------------
create table if not exists public.nfc_cards (
  id uuid primary key default gen_random_uuid(),
  gdg_id text not null unique,
  owner_user_id uuid,
  status public.nfc_card_status not null default 'issued',
  activated_at timestamptz,
  suspended_at timestamptz,
  revoked_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'nfc_cards_gdg_id_fkey'
      and connamespace = 'public'::regnamespace
  ) then
    alter table public.nfc_cards
      add constraint nfc_cards_gdg_id_fkey
      foreign key (gdg_id)
      references public.gdg_members (gdg_id)
      on update cascade
      on delete restrict
      not valid;
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'nfc_cards_owner_user_id_fkey'
      and connamespace = 'public'::regnamespace
  ) then
    alter table public.nfc_cards
      add constraint nfc_cards_owner_user_id_fkey
      foreign key (owner_user_id)
      references public."user" (id)
      on update cascade
      on delete set null
      not valid;
  end if;
end
$$;

create index if not exists idx_nfc_cards_owner_user_id
  on public.nfc_cards (owner_user_id);

create index if not exists idx_nfc_cards_status
  on public.nfc_cards (status);

create or replace function public.set_nfc_cards_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_nfc_cards_updated_at on public.nfc_cards;
create trigger trg_nfc_cards_updated_at
before update on public.nfc_cards
for each row
execute function public.set_nfc_cards_updated_at();

-- ------------------------------------------------------------
-- Backfill from existing user_profile visibility
-- ------------------------------------------------------------
insert into public.nfc_cards (
  gdg_id,
  owner_user_id,
  status,
  activated_at
)
select
  u.gdg_id,
  u.id,
  case when coalesce(up.is_public, false) then 'activated'::public.nfc_card_status else 'issued'::public.nfc_card_status end,
  case when coalesce(up.is_public, false) then now() else null end
from public."user" u
join public.user_profile up on up.user_id = u.id
where u.gdg_id is not null
on conflict (gdg_id) do update
set
  owner_user_id = excluded.owner_user_id,
  status = excluded.status,
  activated_at = coalesce(public.nfc_cards.activated_at, excluded.activated_at),
  updated_at = now();
