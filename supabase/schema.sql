create table if not exists routes (
  id text primary key,
  origin text not null,
  destination text not null,
  departure_date date not null,
  return_date date not null,
  passengers integer not null default 1,
  target_price numeric not null,
  memo text,
  created_at timestamptz not null default now()
);

create table if not exists prices (
  id text primary key,
  route_id text not null references routes(id) on delete cascade,
  price numeric not null,
  currency text not null,
  airline text not null,
  booking_site text not null,
  baggage_included boolean not null default false,
  departure_time text not null,
  arrival_time text not null,
  transfers integer not null default 0,
  url text not null,
  checked_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists alert_settings (
  id text primary key,
  enabled boolean not null default true,
  email text not null default '',
  line_id text not null default '',
  drop_threshold_percent integer not null default 10,
  notify_below_target boolean not null default true,
  notify_near_lowest boolean not null default true,
  last_updated_at timestamptz not null default now()
);

alter table routes enable row level security;
alter table prices enable row level security;
alter table alert_settings enable row level security;

drop policy if exists "public routes read" on routes;
create policy "public routes read"
on routes for select
to anon, authenticated
using (true);

drop policy if exists "public routes write" on routes;
create policy "public routes write"
on routes for insert
to anon, authenticated
with check (true);

drop policy if exists "public routes update" on routes;
create policy "public routes update"
on routes for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "public prices read" on prices;
create policy "public prices read"
on prices for select
to anon, authenticated
using (true);

drop policy if exists "public prices write" on prices;
create policy "public prices write"
on prices for insert
to anon, authenticated
with check (true);

drop policy if exists "public prices update" on prices;
create policy "public prices update"
on prices for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "public alert settings read" on alert_settings;
create policy "public alert settings read"
on alert_settings for select
to anon, authenticated
using (true);

drop policy if exists "public alert settings write" on alert_settings;
create policy "public alert settings write"
on alert_settings for insert
to anon, authenticated
with check (true);

drop policy if exists "public alert settings update" on alert_settings;
create policy "public alert settings update"
on alert_settings for update
to anon, authenticated
using (true)
with check (true);
