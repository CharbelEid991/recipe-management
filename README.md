# RecipeHub — AI-Powered Recipe Management System

A full-stack recipe management app built with Next.js 14, Supabase Auth, Prisma ORM, and Claude AI.

🌐 **Live Demo:** [https://recipe-management-henna.vercel.app/](https://recipe-management-henna.vercel.app/)

## Features

### Core Recipe Management
- **Add / Edit / Delete** recipes with full metadata: name, ingredients, step-by-step instructions, prep & cook time, servings, difficulty, category, and image URL
- **Status tagging** — mark every recipe as one of:
  - ❤️ **Favorite** — recipes you love
  - 📖 **To Try** — recipes on your wishlist
  - ✅ **Made Before** — recipes you've cooked

### Search & Filter
Search recipes by any combination of:
- **Name** — full-text search on title and description
- **Ingredient** — searches inside the ingredients list
- **Cuisine** — matches against recipe tags (e.g. `italian`, `mexican`)
- **Max prep time** — filter to recipes that fit your schedule
- **Category** — breakfast, lunch, dinner, dessert, snack, beverage
- **Difficulty** — easy, medium, hard
- **Status** — filter by favorite / to try / made before

### AI Features (powered by Claude)
| Feature | Description |
|---|---|
| AI Recipe Generator | Describe a dish in plain English and get a full recipe with ingredients and instructions |
| Ingredient Substitution | Enter any ingredient and get smart alternatives with ratios and dietary info |
| Meal Planner | Generate a personalised 7-day meal plan based on your preferences and dietary needs |

### Multi-User & Sharing
- Supabase Auth (email/password sign-up and sign-in)
- Share any recipe with another user by email
- Choose **view-only** or **can edit** permissions
- Revoke access at any time from the Share dialog
- Dedicated **Shared With Me** page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Supabase Auth |
| Database | PostgreSQL (Supabase) via Prisma ORM |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| State | TanStack React Query |

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd recipe-management
npm install
```

### 3. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<host>:5432/postgres
DIRECT_URL=postgresql://postgres.<project-ref>:<password>@<host>:5432/postgres

# AI
ANTHROPIC_API_KEY=sk-ant-...
```

> **Supabase tip:** Find your keys at **Project Settings > API**. Use the **Session pooler** URL for `DATABASE_URL` and the **Direct connection** URL for `DIRECT_URL`.

### 4. Apply Database Schema

```bash
npm run db:push        # push schema to your Supabase DB
npm run db:generate    # regenerate Prisma client
```

### 5. (Optional) Seed Demo Data

```bash
npm run db:seed
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:studio` | Open Prisma Studio (DB browser) |

---

## Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js and builds it

> Use the **session pooler** URL (port 5432) for `DATABASE_URL` and the **direct connection** URL for `DIRECT_URL` (required for migrations).

---

## Project Structure

```
src/
  app/
    (auth)/login          # Sign-in page
    (auth)/signup         # Sign-up page
    (dashboard)/
      dashboard/          # Home dashboard with stats + AI tools tabs
      recipes/            # Browse all public recipes
      recipes/[id]/       # Recipe detail + share button
      recipes/new/        # Create recipe (manual or AI-assisted)
      my-recipes/         # Your own recipes
      shared/             # Recipes shared with you
    api/
      recipes/            # CRUD endpoints
      recipes/[id]/share/ # Share / unshare endpoints
      shared/             # Fetch recipes shared with me
      ai/generate/        # AI recipe generation
      ai/substitute/      # AI ingredient substitution
      ai/meal-plan/       # AI meal planning
      auth/callback/      # Supabase OAuth callback
      auth/sync/          # Sync Supabase user to Prisma DB
  components/
    layout/               # Navbar, Sidebar
    recipes/              # RecipeCard, RecipeForm, RecipeSearch, ShareDialog, StatusBadge
    ai/                   # AIGenerator, IngredientSubstitute, MealPlanner
  lib/
    supabase/             # Browser/server/middleware Supabase clients
    db.ts                 # Prisma client singleton
    ai.ts                 # Anthropic Claude helpers
  hooks/
    use-user.ts           # Current auth user
    use-recipes.ts        # Recipe CRUD via React Query
  types/index.ts          # Shared TypeScript types
prisma/
  schema.prisma           # DB schema (User, Recipe, SharedRecipe, MealPlan)
  seed.ts                 # Demo seed data
```
