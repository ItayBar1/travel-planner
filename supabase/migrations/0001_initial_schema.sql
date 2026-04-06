-- Travel Planner — Initial Schema

create table stops (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  country     text not null,
  start_date  date not null,
  end_date    date not null,
  order_index integer not null default 0,
  lat         numeric(9, 6),
  lng         numeric(9, 6),
  type        text not null default 'city',  -- city | attraction | transport_hub
  created_at  timestamptz not null default now()
);

create table transport (
  id             uuid primary key default gen_random_uuid(),
  from_stop_id   uuid references stops(id) on delete cascade,
  to_stop_id     uuid references stops(id) on delete cascade,
  type           text not null,  -- flight | bus | train | boat | other
  duration_hours numeric(5, 2),
  cost           numeric(10, 2),
  notes          text,
  created_at     timestamptz not null default now()
);

create table activities (
  id          uuid primary key default gen_random_uuid(),
  stop_id     uuid not null references stops(id) on delete cascade,
  name        text not null,
  type        text not null default 'activity',  -- activity | restaurant | reminder
  day_index   integer,   -- nullable: which day within the stop (0-based)
  event_date  date,      -- nullable: for timed events (phase 3)
  event_time  time,      -- nullable: for timed events (phase 3)
  url         text,
  lat         numeric(9, 6),
  lng         numeric(9, 6),
  created_at  timestamptz not null default now()
);

create table expenses (
  id          uuid primary key default gen_random_uuid(),
  amount      numeric(10, 2) not null,
  currency    text not null default 'ILS',
  category    text not null,  -- accommodation | food | transport | attractions | other
  description text not null,
  date        date,           -- nullable: for future filtering
  stop_id     uuid references stops(id) on delete set null,  -- nullable
  created_at  timestamptz not null default now()
);

create table checklist_items (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  category   text not null,  -- gear | documents | health | other
  done       boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for stop ordering
create index stops_order_idx on stops(order_index);
