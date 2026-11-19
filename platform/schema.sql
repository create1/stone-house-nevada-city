-- Event platform system of record.
-- Apply this to a new Postgres database. Do not point it at the live marketing site.
-- Money columns are integer cents. Ticket prices are fee-inclusive.

create extension if not exists pgcrypto;

create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  time_zone text not null,
  capacity integer not null check (capacity > 0),
  created_at timestamptz not null default now()
);

create table staff_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null check (role in ('owner', 'marketing', 'event_manager', 'finance', 'door')),
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references venues (id),
  owner_user_id uuid references staff_users (id),
  slug text not null unique,
  title text not null,
  event_type text not null,
  status text not null default 'draft' check (
    status in ('draft', 'published', 'sold_out', 'canceled', 'completed')
  ),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  doors_at timestamptz not null,
  time_zone text not null,
  description text not null default '',
  performers text not null default '',
  age_rule text not null default '',
  accessibility_notes text not null default '',
  parking_notes text not null default '',
  refund_policy text not null default '',
  primary_audience text not null default '',
  marketing_goal text not null default '',
  ad_spend_budget_cents integer not null default 0 check (ad_spend_budget_cents >= 0),
  ad_ends_at timestamptz,
  rights_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (doors_at <= starts_at)
);

create table event_versions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id),
  fact_snapshot jsonb not null,
  changed_by uuid references staff_users (id),
  change_reason text not null,
  created_at timestamptz not null default now()
);

alter table events
  add column current_version_id uuid references event_versions (id);

create table assets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id),
  file_url text not null,
  asset_type text not null,
  rights_status text not null default 'pending' check (
    rights_status in ('pending', 'approved', 'rejected')
  ),
  alt_text text not null default '',
  crops jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table events
  add column hero_asset_id uuid references assets (id);

create table ticket_types (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id),
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  includes_food_and_beverage boolean not null default false,
  admission_cents integer check (admission_cents is null or admission_cents >= 0),
  food_and_beverage_cents integer check (
    food_and_beverage_cents is null or food_and_beverage_cents >= 0
  ),
  included_items text not null default '',
  includes_alcohol boolean not null default false,
  tax_profile text check (tax_profile in ('admission', 'split')),
  capacity integer not null check (capacity > 0),
  sale_starts_at timestamptz not null,
  sale_ends_at timestamptz not null,
  check (sale_ends_at > sale_starts_at),
  check (
    includes_food_and_beverage = false
    or (
      admission_cents is not null
      and food_and_beverage_cents is not null
      and admission_cents + food_and_beverage_cents = price_cents
      and length(trim(included_items)) > 0
    )
  )
);

create index ticket_types_event_id_idx on ticket_types (event_id);
create index events_status_starts_at_idx on events (status, starts_at);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references staff_users (id),
  action text not null,
  object_type text not null,
  object_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);
