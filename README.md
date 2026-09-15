# CardNest

A personal flashcard app where you can organize cards into categories, each with text and images. Built with Next.js, TypeScript, and Supabase.

## Features

- **User authentication** — sign up / log in with email & password (Supabase Auth)
- **Categories** — create, rename, and delete categories; they appear in a navbar-style list
- **Flashcards** — each card has a front and back, each with optional text and image
- **Image uploads** — images are stored in Supabase Storage and served via CDN
- **Per-user data** — every user only sees their own categories and flashcards
- **Responsive design** — works on desktop and mobile

## Tech Stack

| Layer       | Technology     |
|-------------|----------------|
| Frontend    | Next.js 15 App Router, TypeScript, Tailwind CSS |
| Backend     | Supabase (PostgreSQL + Auth + Storage) |
| Deployment  | Vercel (frontend) + Supabase (DB/API) |
| Icons       | Lucide React |

## Getting Started

### 1. Set up Supabase

1. Go to [app.supabase.com](https://app.supabase.com) and create a new project.
2. Wait for the project to be ready (this takes a few minutes).
3. Go to **Project Settings → API** and copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Go to **Database → Table editor** → **SQL editor** and run the schema setup (see [Database Setup](#database-setup)).
5. Go to **Storage → Buckets** and create a bucket named `flashcard-images` with **Public** access.

### 2. Clone and install

```bash
git clone https://github.com/dafatsq/cardnest.git
cd cardnest
npm install
```

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login` to sign up or log in.

## Database Setup

Run this SQL in your Supabase project's SQL editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories table
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Flashcards table
create table public.flashcards (
  id uuid primary key default uuid_generate_v4(),
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
```

## Deploy to Vercel

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "feat: initial cardnest app"
   git push origin main
   ```
2. Import the project on [vercel.com](https://vercel.com/new) from your GitHub repo.
3. In the Vercel project settings, add these Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. (Optional) Set up a custom domain.

## Project Structure

```
src/
├── app/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── page.tsx               # Dashboard
│   ├── categories/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   ├── [id]/page.tsx
│   │   ├── [id]/edit/page.tsx
│   │   └── [id]/flashcards/
│   │       ├── new/page.tsx
│   │       └── [cardId]/edit/page.tsx
│   └── actions/
│       ├── category-actions.ts
│       └── flashcard-actions.ts
├── components/
│   ├── Navbar.tsx
│   ├── CategoryList.tsx
│   ├── FlashcardList.tsx
│   └── FlashcardForm.tsx
├── context/AuthContext.tsx
├── lib/supabase/
│   ├── client.ts
│   ├── server.ts
│   └── middleware.ts
├── types/index.ts
└── middleware.ts
```

## License

MIT
