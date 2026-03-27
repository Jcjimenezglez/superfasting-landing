import { Pool } from "pg"

interface WaitlistInsertInput {
  email: string
  source: string
  metadata: Record<string, unknown>
}

interface WaitlistInsertResult {
  created: boolean
}

let pool: Pool | null = null
let tableReadyPromise: Promise<void> | null = null

function withLibpqCompatibility(connectionString: string): string {
  if (!connectionString.includes("sslmode=require")) {
    return connectionString
  }

  if (connectionString.includes("uselibpqcompat=")) {
    return connectionString
  }

  const separator = connectionString.includes("?") ? "&" : "?"
  return `${connectionString}${separator}uselibpqcompat=true`
}

function shouldUseSsl(connectionString: string): boolean {
  return !connectionString.includes("localhost") && !connectionString.includes("127.0.0.1")
}

function getPool(): Pool {
  if (pool) {
    return pool
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured")
  }

  const connectionString = withLibpqCompatibility(databaseUrl)

  pool = new Pool({
    connectionString,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
  })

  return pool
}

async function ensureWaitlistTable(): Promise<void> {
  if (!tableReadyPromise) {
    tableReadyPromise = (async () => {
      const db = getPool()
      await db.query(`
        create table if not exists public.waitlist_emails (
          id bigint generated always as identity primary key,
          email text not null unique,
          source text not null default 'superfasting.live',
          platform text not null default 'telegram',
          audience text not null default 'latam_miami_florida_30_plus',
          metadata jsonb not null default '{}'::jsonb,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          check (position('@' in email) > 1)
        );

        alter table if exists public.waitlist_emails enable row level security;
      `)
    })()
  }

  await tableReadyPromise
}

export async function insertWaitlistEmail(input: WaitlistInsertInput): Promise<WaitlistInsertResult> {
  await ensureWaitlistTable()

  const db = getPool()
  const normalizedEmail = input.email.trim().toLowerCase()

  const result = await db.query<{ created: boolean }>(
    `
      insert into public.waitlist_emails (email, source, metadata)
      values ($1, $2, $3::jsonb)
      on conflict (email)
      do update
      set
        source = excluded.source,
        metadata = public.waitlist_emails.metadata || excluded.metadata,
        updated_at = now()
      returning (xmax = 0) as created;
    `,
    [normalizedEmail, input.source, JSON.stringify(input.metadata)]
  )

  return {
    created: result.rows[0]?.created ?? false,
  }
}

