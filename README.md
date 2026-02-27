# Superfasting Landing

Landing page for `superfasting.live`, built with Next.js + shadcn/ui.

## Main Sections

The page includes:

1. Hero
2. Problem-awareness
3. Story
4. How it works
5. Features + premium details
6. Free vs Premium comparison table
7. Testimonial
8. FAQ
9. Final CTA

## Waitlist Storage

Waitlist form submits to:

- `POST /api/waitlist`

Emails are stored in Postgres (Supabase) table:

- `waitlist_emails`

The table is auto-created on first insert by `src/lib/waitlist-db.ts`.

## Environment Variables

Create `.env.local` from `.env.example` and set:

- `DATABASE_URL`

Example format (Supabase pooler):

```env
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_SUPABASE_DB_PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require
```

## Local Development

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000`

## Quality Checks

```bash
npm run lint
npm run build
```

