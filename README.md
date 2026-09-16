# TeamFlow

Real-time Kanban workspace — Next.js 16, TypeScript, Tailwind CSS v4, Supabase (auth + database + realtime), Cloudinary (file uploads), Nodemailer (contact form), dnd-kit (drag & drop), Framer Motion (animations).

## Features

- Email/password auth (Supabase Auth) — multiple users, each with their own boards
- Kanban board with drag-and-drop cards across To do / In progress / Done (fully custom columns, add more anytime)
- **Real-time**: any change a teammate makes (move a card, add a comment, edit a task) appears live for everyone on the board, no refresh — powered by Supabase Realtime (Postgres change feed) + Presence ("X online" indicator)
- Task detail: title, description, deadline, assignee, priority
- Comments thread per task
- File attachments per task via Cloudinary
- Invite teammates to a board by email
- Contact page wired to a real inbox via Nodemailer
- Fully responsive (mobile → desktop), dark luxury UI with Framer Motion micro-animations

---

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**. Pick any name/region, set a database password (save it somewhere).
2. Once it's ready, open **SQL Editor** → **New query**, paste in the entire contents of **`supabase/schema.sql`** from this project, and click **Run**.
   - This creates every table (profiles, boards, board_members, columns, tasks, comments, attachments), sets up Row Level Security so users can only see boards they're a member of, adds triggers so a profile is auto-created on signup and the board creator is auto-added as its owner, and turns on realtime for the tables that need it.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. (Recommended for local dev) Go to **Authentication → Providers → Email** and turn **off** "Confirm email" while you're testing, so new signups can log in immediately. Turn it back on before going live.

## 3. Create a Cloudinary account (for file uploads)

1. Sign up free at [cloudinary.com](https://cloudinary.com).
2. Your **cloud name** is shown on the dashboard home page → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. Go to **Settings → Upload → Upload presets → Add upload preset**.
   - Set **Signing Mode** to **Unsigned**.
   - Give it a name, e.g. `teamflow_uploads` → this is `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
   - Save.

## 4. Set up email sending (for the Contact page)

The contact form sends mail with Nodemailer. Easiest option is Gmail:

1. Turn on 2-Step Verification on the Gmail account you want to send from.
2. Create an **App Password**: Google Account → Security → 2-Step Verification → App passwords → generate one for "Mail".
3. Use those values in the env vars below (`SMTP_USER` = your Gmail address, `SMTP_PASS` = the 16-character app password).

Any other SMTP provider (SendGrid, Mailgun, your host's SMTP, etc.) also works — just change `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE` to match.

## 5. Environment variables

Copy the example file and fill in the values from steps 2–4:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=
```

## 6. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, create a board, and start dragging cards. Open the same board in a second browser (or invite a teammate by email and log in as them) to see real-time updates.

## 7. Deploy

Push to GitHub and import the repo into [Vercel](https://vercel.com) (or any Next.js host). Add the same environment variables in the project's settings before the first deploy.

---

## Project structure

```
app/
  page.tsx                     Landing page
  (auth)/login, (auth)/signup  Auth pages
  dashboard/                   Boards list, empty state
  dashboard/board/[boardId]/   The Kanban board
  contact/                     Contact form
  api/contact/                 Nodemailer route
components/
  landing/                     Marketing page sections
  board/                       Sidebar, Kanban board, columns, cards, task modal
  ui/                          Button, Input, Avatar, Modal primitives
lib/
  supabase/                    Browser/server/middleware Supabase clients
  api.ts                       Data functions (create board, task, comment, etc.)
  types.ts                     Shared TypeScript types
supabase/
  schema.sql                   Run this once in Supabase's SQL editor
```

## Notes

- Realtime relies on the `alter publication supabase_realtime add table ...` lines at the bottom of `schema.sql` — they're already included and safe to re-run.
- If invites say "No TeamFlow account found with that email yet," that's expected — a person has to sign up once before they can be added to a board.
- To add more columns than the default three, use the board's column data directly in Supabase for now (a "manage columns" UI is a natural next feature to add).
