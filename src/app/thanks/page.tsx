"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Logo } from "@/components/logo"

const GOOGLE_ADS_ID = "AW-17981379200"
const THANKS_CONVERSION_FIRED_KEY = "superfasting_thanks_conversion_fired"

export default function ThanksPage() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Prevent duplicate conversion events on refreshes in same session.
    if (sessionStorage.getItem(THANKS_CONVERSION_FIRED_KEY) === "1") return

    const gtag = (window as Window & {
      gtag?: (...args: unknown[]) => void
    }).gtag

    if (!gtag) return

    gtag("event", "conversion", { send_to: GOOGLE_ADS_ID })
    sessionStorage.setItem(THANKS_CONVERSION_FIRED_KEY, "1")
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-0">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-poppins)" }}>
            <Logo size={28} className="text-primary" />
            <span>Superfasting</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <CheckCircle2 className="mb-6 size-16 text-primary" strokeWidth={1.5} />
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          You&apos;re on the list!
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          We&apos;ll notify you as soon as Superfasting launches. Get ready to start your fasting journey.
        </p>
        <Link
          href="/"
          className="mt-8 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          &larr; Back to home
        </Link>
      </main>
    </div>
  )
}
