-- Run this in Supabase SQL editor

create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  level text not null,
  subject text not null,
  author text default 'Student',
  created_at timestamptz not null default now()
);

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text default 'General',
  author text default 'Admin',
  created_at timestamptz not null default now()
);

create table if not exists public.past_papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year int not null,
  url text default '',
  level text not null,
  subject text not null,
  code text,
  paper_type text default 'Question',
  created_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author text default 'Student',
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;
alter table public.updates enable row level security;
alter table public.past_papers enable row level security;
alter table public.community_posts enable row level security;

do $$ begin
  create policy "notes public read" on public.notes for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "notes public insert" on public.notes for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "updates public read" on public.updates for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "updates public insert" on public.updates for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "papers public read" on public.past_papers for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "papers public insert" on public.past_papers for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "community public read" on public.community_posts for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "community public insert" on public.community_posts for insert with check (true);
exception when duplicate_object then null; end $$;
