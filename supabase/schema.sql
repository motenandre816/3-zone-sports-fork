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
  content text not null default '',
  category text not null,
  author text not null,
  author_slug text not null,
  image_url text,
  tags text[] not null default '{}',
  team text,
  league text not null default 'General',
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  read_time text not null default '5 min read',
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null references public.articles(slug) on delete cascade,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.page_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  pathname text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.comments enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.page_events enable row level security;

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
  using (status = 'published' or created_by = auth.uid());

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

create policy "Comments are viewable by everyone"
  on public.comments
  for select
  using (true);

create policy "Anyone can create comments"
  on public.comments
  for insert
  with check (true);

create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers
  for insert
  with check (true);

create policy "Authenticated users can view newsletter subscribers"
  on public.newsletter_subscribers
  for select
  using (auth.role() = 'authenticated');

create policy "Anyone can create page events"
  on public.page_events
  for insert
  with check (true);
