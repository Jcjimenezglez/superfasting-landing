"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/logo"
import { WaitlistForm } from "@/components/waitlist-form"
import { ChevronDown, Users } from "lucide-react"

type Locale = "es" | "en"

const SOCIAL_PROOF_BASE = 247
const STORAGE_KEY = "superfasting_social_proof"

function getStoredCount(): number {
  if (typeof window === "undefined") return SOCIAL_PROOF_BASE
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return SOCIAL_PROOF_BASE
  const n = parseInt(stored, 10)
  return !Number.isNaN(n) && n >= SOCIAL_PROOF_BASE ? n : SOCIAL_PROOF_BASE
}

const copy = {
  es: {
    skip: "Ir al contenido principal",
    langLabel: "Idioma",
    heroTitleBefore: "Ayuno intermitente para ",
    heroTitleHighlight: "bajar de peso.",
    heroSubtitle: "Un asistente personal que te ayuda a mantener tu ayuno, registrar comidas y seguir adelante—todo en Telegram.",
    ctaLabel: "Unirme al waitlist",
    socialProof: "personas se unieron",
    timing: "Lanzando en marzo 2026",
    footer: "Superfasting.live",
  },
  en: {
    skip: "Skip to main content",
    langLabel: "Language",
    heroTitleBefore: "Intermittent fasting for ",
    heroTitleHighlight: "weight loss.",
    heroSubtitle: "A personal assistant that helps you stick to your fast, track meals, and stay on track—all in Telegram.",
    ctaLabel: "Join waitlist",
    socialProof: "people joined",
    timing: "Launching March 2026",
    footer: "Superfasting.live",
  },
} as const

function randomIncrement() {
  return Math.floor(Math.random() * 5) + 1
}

export default function Home() {
  const [lang, setLang] = useState<Locale>("en")
  const [socialProofCount, setSocialProofCount] = useState(SOCIAL_PROOF_BASE)
  const t = copy[lang]

  useEffect(() => {
    setSocialProofCount(getStoredCount())
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSocialProofCount((c) => {
        const next = c + randomIncrement()
        localStorage.setItem(STORAGE_KEY, String(next))
        return next
      })
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        {t.skip}
      </a>

      <header className="shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between sm:h-16">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-poppins)" }}>
            <Logo size={28} className="text-primary" />
            <span>Superfasting</span>
          </Link>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={t.langLabel}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none hover:text-foreground"
              >
                {lang === "en" ? "EN" : "ES"}
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLang("en")}>EN</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLang("es")}>ES</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex min-h-0 flex-1 flex-col justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <section className="flex flex-col justify-center space-y-3 sm:space-y-5">
            <h1
              className="font-bold leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "clamp(1.75rem, 6vw + 1.5rem, 6rem)",
              }}
            >
              {t.heroTitleBefore}
              <span
                className="inline-block bg-[rgba(0,136,204,0.3)] px-1.5 py-0.5"
                style={{ boxDecorationBreak: "clone", transform: "skewX(-2deg)" }}
              >
                {t.heroTitleHighlight}
              </span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              {t.heroSubtitle}
            </p>
            <div id="waitlist" className="pt-2 sm:pt-4">
            <WaitlistForm
              lang={lang}
              buttonLabel={t.ctaLabel}
              emailPlaceholder={lang === "es" ? "tuemail@correo.com" : "you@email.com"}
              className="max-w-md"
            />
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground sm:mt-6">
              <span className="flex items-center gap-2">
                <Users className="size-4 shrink-0" />
                <strong className="font-medium text-foreground">{socialProofCount.toLocaleString()}</strong>{" "}
                {t.socialProof}
              </span>
              <span className="text-muted-foreground/90">{t.timing}</span>
            </div>
          </div>
          </section>
        </div>
      </main>

      <footer className="shrink-0 border-t border-border/40 py-4 sm:py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          {t.footer}
        </div>
      </footer>
    </div>
  )
}
