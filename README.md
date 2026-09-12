# 3 Zone Sports

Production-ready sports media starter built with a completely free stack:

- **Frontend**: Next.js App Router + React + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js Route Handlers
- **Database/Auth**: Supabase PostgreSQL + Supabase Auth
- **Hosting**: Vercel free tier

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev        # start local development server
npm run build      # create production build
npm run start      # run production server
npm run lint       # lint the codebase
npm run typecheck  # TypeScript validation
npm test           # run route-level API tests
```

## Project Structure

```text
app/              Next.js 13+ app router, pages, and API route handlers
api/              Shared API contracts and payload types
components/       Reusable UI building blocks
lib/              Utilities, Supabase helpers, and starter data
public/           Static assets
styles/           Tailwind-connected styling tokens
supabase/         SQL schema for profiles and articles
```

## Supabase Setup

1. Create a free Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Run the SQL in `/supabase/schema.sql` inside the Supabase SQL editor.
5. In Supabase Auth, add your local and production callback URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-vercel-domain.vercel.app/auth/callback`

## Included Starter Features

- Homepage layout with sports media hero section
- Reusable article card component
- Header and footer navigation
- Login and signup pages
- Protected `/profile` route backed by Next.js proxy auth checks
- Auth session, users, and articles API routes
- Supabase SSR helpers for browser, server, and middleware usage

## API Routes

- `GET /api/articles` - returns Supabase articles or seeded fallback content
- `POST /api/articles` - creates an article when Supabase is configured
- `GET /api/users` - returns the current authenticated user session
- `POST /api/users` - upserts the current user profile
- `GET /api/auth/session` - returns current auth session info
- `POST /api/auth/login` - signs a user in
- `POST /api/auth/signup` - creates a user account
- `POST /api/auth/logout` - signs a user out

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add the same environment variables from `.env.local`.
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL or custom domain.
5. Deploy. Vercel automatically runs `npm install` and `npm run build`.

`vercel.json` is included for a clean Next.js deployment baseline.

## Free Tier Notes

- **Supabase**: free PostgreSQL storage and built-in auth for MVP traffic
- **Vercel**: free hobby deployment for personal or early-stage launches
- **Tailwind CSS**: open-source styling with no paid requirement
- **Next.js**: open-source full-stack React framework

This gives 3 Zone Sports a professional $0/month foundation you can extend with live scores, editorial workflows, memberships, and media publishing features.
