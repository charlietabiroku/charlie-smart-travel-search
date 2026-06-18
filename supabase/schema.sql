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
