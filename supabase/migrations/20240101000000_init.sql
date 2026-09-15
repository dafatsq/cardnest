-- CardNest database schema
-- Categories and flashcards with per-user row-level security

-- Enable UUID extension (pgcrypto provides gen_random_uuid on Supabase)
create extension if not exists "pgcrypto";

-- Categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Flashcards table
create table public.flashcards (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories on delete cascade not null,
  front_text text,
  back_text text,
  front_image_url text,
  back_image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Row-Level Security
alter table public.categories enable row level security;
alter table public.flashcards enable row level security;

create policy "Users can view their own categories"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Users can create their own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own categories"
  on public.categories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

create policy "Users can view their own flashcards"
  on public.flashcards for select
  using (
    auth.uid() = (
      select user_id from public.categories where id = category_id
    )
  );

create policy "Users can create their own flashcards"
  on public.flashcards for insert
  with check (
    auth.uid() = (
      select user_id from public.categories where id = category_id
    )
  );

create policy "Users can update their own flashcards"
  on public.flashcards for update
  using (
    auth.uid() = (
      select user_id from public.categories where id = category_id
    )
  );

create policy "Users can delete their own flashcards"
  on public.flashcards for delete
  using (
    auth.uid() = (
      select user_id from public.categories where id = category_id
    )
  );
