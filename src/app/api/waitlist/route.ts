import { NextResponse } from "next/server"

import { insertWaitlistEmail } from "@/lib/waitlist-db"

export const runtime = "nodejs"
type Locale = "es" | "en"

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function getLocale(value: unknown): Locale {
  return value === "en" ? "en" : "es"
}

function getMessage(locale: Locale, key: "invalid_email" | "created" | "already_exists" | "server_error"): string {
  const messages = {
    es: {
      invalid_email: "Ingresa un correo valido para entrar al waitlist.",
      created: "Listo, ya estas dentro del waitlist.",
      already_exists: "Ya estabas en el waitlist. Te avisamos cuando abramos.",
      server_error: "No pudimos guardar tu correo. Intenta de nuevo en unos minutos.",
    },
    en: {
      invalid_email: "Enter a valid email to join the waitlist.",
      created: "Done, you are on the waitlist.",
      already_exists: "You are already on the waitlist. We will notify you at launch.",
      server_error: "We could not save your email. Please try again in a few minutes.",
    },
  } as const

  return messages[locale][key]
}

export async function POST(request: Request) {
  let locale: Locale = "es"
  try {
    const body = await request.json().catch(() => ({}))
    const rawEmail = typeof body.email === "string" ? body.email : ""
    const email = rawEmail.trim().toLowerCase()
    locale = getLocale(body.lang)

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          message: getMessage(locale, "invalid_email"),
        },
        { status: 400 }
      )
    }

    const result = await insertWaitlistEmail({
      email,
      source: "superfasting.live",
      metadata: {
        userAgent: request.headers.get("user-agent"),
        language: request.headers.get("accept-language"),
      },
    })

    return NextResponse.json({
      ok: true,
      created: result.created,
      message: result.created ? getMessage(locale, "created") : getMessage(locale, "already_exists"),
    })
  } catch (error) {
    console.error("waitlist_insert_failed", error)
    return NextResponse.json(
      {
        ok: false,
        message: getMessage(locale, "server_error"),
      },
      { status: 500 }
    )
  }
}

