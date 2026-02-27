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
import { ChevronDown } from "lucide-react"

type Locale = "es" | "en"
type MockupMessage = {
  from: "user" | "bot"
  text: React.ReactNode
}

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
    mockupBotName: "Superfasting bot",
    mockupStatus: "Online ahora",
    mockupToday: "Hoy",
    mockupInputPlaceholder: "Mensaje",
    mockupMessages: [
      { from: "bot", text: <>Hey 👋 soy tu asistente de <b>ayuno intermitente</b>. Cuéntame tu peso actual, tu meta, y yo me encargo del resto. ¿En qué te ayudo?</> },
      { from: "user", text: <>Peso 92 kg y quiero llegar a 78 kg</> },
      { from: "bot", text: <>¡Genial! Aquí va tu plan personalizado:{"\n\n"}🕐 <b>Protocolo 16:8</b> — 8 horas para comer, 16 de ayuno{"\n"}⚖️ <b>Meta: 92 → 78 kg</b>{"\n"}📸 Envíame foto de tu pesa al pesarte y de tu comida — te digo si vas bien y qué ajustar{"\n"}💬 Pregúntame <b>&quot;status&quot;</b> cuando quieras ver tu progreso{"\n\n"}Cuando estés listo dime <b>Start</b> y empezamos 🚀</> },
    ] as MockupMessage[],
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
    mockupBotName: "Superfasting bot",
    mockupStatus: "Online now",
    mockupToday: "Today",
    mockupInputPlaceholder: "Message",
    mockupMessages: [
      { from: "bot", text: <>Hey 👋 I&apos;m your <b>intermittent fasting</b> assistant. Tell me your current weight, your goal, and I&apos;ll take it from there. How can I help?</> },
      { from: "user", text: <>I weigh 203 lb and I want to get to{"\n"}172&nbsp;lb</> },
      { from: "bot", text: <>Love it! Here&apos;s your personalized plan:{"\n\n"}🕐 <b>16:8 protocol</b> — 8 hours to eat, 16 fasting{"\n"}⚖️ <b>Goal: 203 → 172 lb</b>{"\n"}📸 Send me a photo of your scale when you weigh in and your meals — I&apos;ll tell you if you&apos;re on track and what to tweak{"\n"}💬 Just ask me <b>&quot;status&quot;</b> anytime to check your progress{"\n\n"}Whenever you&apos;re ready just say <b>Start</b> and we&apos;ll begin 🚀</> },
    ] as MockupMessage[],
    footer: "Superfasting.live",
  },
} as const

function randomIncrement() {
  return Math.floor(Math.random() * 5) + 1
}

const socialProofAvatars = [
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80", alt: "Waitlist user avatar 1" },
  { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80", alt: "Waitlist user avatar 2" },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80", alt: "Waitlist user avatar 3" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80", alt: "Waitlist user avatar 4" },
  { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80", alt: "Waitlist user avatar 5" },
  { src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=80&h=80&q=80", alt: "Waitlist user avatar 6" },
] as const

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
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-0">
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

      <main id="main-content" className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:py-6">
        <div className="mx-auto w-full max-w-5xl">
          <section className="grid items-center justify-items-center gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,440px)]">
            <div className="w-full max-w-xl space-y-3 text-center sm:space-y-5 lg:text-left">
              <h1
                className="mx-auto max-w-[13ch] font-bold leading-[1.15] tracking-tight text-[clamp(2.35rem,8vw+1.2rem,3.5rem)] sm:text-[clamp(2.75rem,9vw+1.5rem,4.5rem)] lg:mx-0 lg:text-[clamp(2.5rem,5vw+0.75rem,5.25rem)]"
                style={{
                  fontFamily: "var(--font-poppins)",
                }}
              >
                {t.heroTitleBefore}
                <span className="text-primary">
                  {t.heroTitleHighlight}
                </span>
              </h1>
              <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
                {t.heroSubtitle}
              </p>
              <div id="waitlist" className="mx-auto pt-2 sm:pt-4 lg:mx-0">
                <WaitlistForm
                  lang={lang}
                  buttonLabel={t.ctaLabel}
                  emailPlaceholder={lang === "es" ? "tuemail@correo.com" : "you@email.com"}
                  className="max-w-md"
                />
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground sm:mt-6 lg:justify-start">
                  <span className="flex items-center gap-2.5">
                    <span className="flex items-center">
                      {socialProofAvatars.map((avatar, index) => (
                        <span
                          key={avatar.src}
                          className={`inline-flex size-6 overflow-hidden rounded-full border border-background ${index === 0 ? "" : "-ml-1.5"}`}
                        >
                          <img src={avatar.src} alt={avatar.alt} width={24} height={24} className="size-6 object-cover" loading="lazy" />
                        </span>
                      ))}
                    </span>
                    <strong className="font-medium text-foreground">{socialProofCount.toLocaleString()}</strong>{" "}
                    {t.socialProof}
                  </span>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[440px]">
              <div className="relative mx-auto aspect-[780/1688] w-[min(75vw,300px)] min-h-[450px] overflow-hidden rounded-[2rem] border border-foreground/10 bg-card shadow-md">
                <img
                  src="/hero-mobile-chat-v2.png"
                  alt="Telegram mobile mockup with fasting assistant"
                  className="absolute inset-0 h-full w-full object-cover object-[center_72%] sm:object-[center_68%] lg:object-center"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-16 space-y-1.5 p-3 lg:bottom-16">
                  {t.mockupMessages.map((message, index) => {
                    return (
                      <div
                        key={index}
                        className={
                          message.from === "user"
                            ? "relative ml-auto max-w-[86%] whitespace-pre-line rounded-[14px] rounded-br-none bg-[linear-gradient(to_bottom_right,_#0A83B2,_#18A193)] px-2.5 py-1.5 text-[12px] leading-[1.45] text-white shadow-sm"
                            : "relative max-w-[90%] whitespace-pre-line rounded-[14px] rounded-bl-none bg-[linear-gradient(to_bottom_right,_#152020,_#1A1D1D)] px-2.5 py-1.5 text-[12px] leading-[1.45] text-white shadow-sm"
                        }
                      >
                        {message.text}
                        <span className={`mt-0.5 flex items-center justify-end gap-0.5 text-[8px] ${message.from === "user" ? "text-white/70" : "text-white/45"}`}>
                          10:51
                          {message.from === "user" && (
                            <span className="ml-0.5 inline-flex shrink-0" style={{ color: "#B3EDFF" }}>
                              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 3l2.5 2.5L9 1" />
                              </svg>
                              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="-ml-1.5">
                                <path d="M1 3l2.5 2.5L9 1" />
                              </svg>
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

    </div>
  )
}
