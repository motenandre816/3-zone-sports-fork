create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  favorite_team text,
  bio text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  category text not null,
  author text not null,
  read_time text not null default '5 min read',
  published_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.articles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

create policy "Users can upsert their own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Articles are viewable by everyone"
  on public.articles
  for select
  using (true);

create policy "Authenticated users can insert their own articles"
  on public.articles
  for insert
  with check (created_by = auth.uid());

create policy "Authenticated users can update their own articles"
  on public.articles
  for update
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "Authenticated users can delete their own articles"
  on public.articles
  for delete
  using (created_by = auth.uid());
