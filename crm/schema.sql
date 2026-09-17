-- Harmonics & Healing — CRM schema
-- Run this once in your new Supabase project's SQL Editor (Database > SQL Editor > New query > Run)

create extension if not exists "pgcrypto";

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age int,
  notes text,               -- general standing notes about the client (recurring themes, preferences)
  created_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  session_date date not null default current_date,
  client_followup text,     -- the short, warm message sent to the client
  internal_notes text,      -- the complete clinical/internal record
  raw_paste text,           -- the original pasted block from Claude, kept for reference
  created_at timestamptz not null default now()
);

create index sessions_client_id_idx on sessions(client_id);

-- Row Level Security: only a signed-in user (i.e. you) can read or write anything.
-- There is no public sign-up in the app, so "signed in" effectively means "you".
alter table clients enable row level security;
alter table sessions enable row level security;

create policy "authenticated can do everything on clients"
  on clients for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "authenticated can do everything on sessions"
  on sessions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
