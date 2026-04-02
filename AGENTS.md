# Superfasting Landing

Next.js 16 landing page for superfasting.live with a waitlist signup form backed by PostgreSQL.

## Cursor Cloud specific instructions

### Services

| Service | How to run |
|---------|-----------|
| Next.js dev server | `npm run dev` (port 3000) |
| PostgreSQL | `sudo pg_ctlcluster 16 main start` |

### Database

A local PostgreSQL 16 instance is used for development. The `DATABASE_URL` is set in `.env.local`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/superfasting
```

The `waitlist_emails` table is auto-created on first API call to `POST /api/waitlist` — no manual migrations needed.

**Important:** PostgreSQL does not auto-start on VM boot. Run `sudo pg_ctlcluster 16 main start` before starting the dev server if you need the waitlist API to work.

### Standard commands

See `README.md` for lint/build/dev commands (`npm run lint`, `npm run build`, `npm run dev`).

### Gotchas

- `npm run lint` exits with code 1 due to a pre-existing `react-hooks/set-state-in-effect` error in `src/app/page.tsx`. This is expected and not a blocker.
- The app uses Next.js 16 with Turbopack. Hot reloading works out of the box.
- No `.env.example` file is committed; `.env.local` is gitignored.
