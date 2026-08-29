# SideQuest

Student-first gig marketplace for Australian uni students. Find short work, post tasks, rent equipment, and drop confirmed gigs onto Google Calendar.

Brand: **SideQuest AU**. Positioning: jobs are brutal to land in Sydney (and elsewhere) while you are at uni — this is gigs on your timetable, for students, by students.

## Run locally

```bash
cd SideQuest
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo logins (password ignored until Supabase is on):

- Student: `maya.chen@student.unsw.edu.au`
- Client: `priya@localstudio.co`

Marketplace data lives in the browser (`localStorage`) so you can click through every flow without a database.

## GitHub → Vercel

1. Create a GitHub repo and push this folder (do not commit `.env.local`).
2. Import the repo in [Vercel](https://vercel.com). Framework: Next.js.
3. Add the same env vars as `.env.example`.
4. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://thesidequest.com.au`).

```bash
git init
git add .
git commit -m "SideQuest marketplace"
gh repo create sidequest --private --source=. --remote=origin --push
```

## Supabase (optional, for real accounts)

1. Create a project (Sydney region if you can).
2. Paste [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql) then [`002_seed_equipment.sql`](supabase/migrations/002_seed_equipment.sql) into the SQL editor.
3. Auth → URL configuration: add `http://localhost:3000/auth/callback` and `https://YOURDOMAIN/auth/callback`.
4. Put `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and Vercel.

Until those keys exist, signup/login still work in demo mode.

### Cursor MCP (optional)

This session already has the browser tools. To let the agent inspect your live Supabase project, add the [Supabase MCP](https://github.com/supabase-community/supabase-mcp) in **Cursor Settings → MCP** with a personal access token. GitHub can stay on the `gh` CLI.

## Google Calendar (optional)

1. Google Cloud project → enable Calendar API.
2. OAuth client (Web) with redirect `http://localhost:3000/api/google/callback` (and production equivalent).
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. Students open **Calendar** → Connect Google. Free windows become gig suggestions. Confirm writes an event titled `SideQuest · …`.

Without keys, **Suggest from demo timetable** still works.

Notion calendar is not in this version.

## What is in the product

| Path | Role |
|---|---|
| `/` | Hero, live cities, stats, categories |
| `/signup` `/login` | Student (`.edu.au`) vs client |
| `/tasks` | Filters: category, city, pay, date |
| `/tasks/[id]` | Apply |
| `/tasks/new` | Client post |
| `/my-tasks` | Hire from rated applicants, complete, review |
| `/dashboard` | Student applications, jobs, earnings |
| `/profile` `/profile/[id]` | Bio, skills, verified badge, ratings |
| `/equipment` | Rent tools, book dates |
| `/calendar` | Google / demo suggestions |
| `/terms` `/privacy` | ACL / Privacy Act stubs |

Live Stripe / ABN / paid verified badges / boosted listings are documented in the business plan and left out of v1 (budgets and earnings are recorded on complete).

## Stack

Next.js 15 (App Router) · Tailwind 4 · Framer Motion · Supabase (optional) · Google APIs (optional) · Vercel
