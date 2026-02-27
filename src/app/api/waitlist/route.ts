import { NextResponse } from "next/server"

import { insertWaitlistEmail } from "@/lib/waitlist-db"

export const runtime = "nodejs"

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const messages = {
  invalid_email: "Enter a valid email to join the waitlist.",
  created: "Done, you are on the waitlist.",
  already_exists: "You are already on the waitlist. We will notify you at launch.",
  server_error: "We could not save your email. Please try again in a few minutes.",
} as const

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const rawEmail = typeof body.email === "string" ? body.email : ""
    const email = rawEmail.trim().toLowerCase()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, message: messages.invalid_email },
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
      message: result.created ? messages.created : messages.already_exists,
    })
  } catch (error) {
    console.error("waitlist_insert_failed", error)
    return NextResponse.json(
      { ok: false, message: messages.server_error },
      { status: 500 }
    )
  }
}
