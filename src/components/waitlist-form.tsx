"use client"

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface WaitlistFormProps {
  buttonLabel?: string
  className?: string
  emailPlaceholder?: string
  inputClassName?: string
  lang?: "es" | "en"
}

type StatusType = "idle" | "success" | "error"

export function WaitlistForm({
  buttonLabel = "Entrar al waitlist",
  className = "",
  emailPlaceholder = "tuemail@correo.com",
  inputClassName,
  lang = "es",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<StatusType>("idle")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("idle")
    setMessage("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang }),
      })

      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string }

      if (!response.ok || !data.ok) {
        setStatus("error")
        setMessage(
          data.message ??
            (lang === "es"
              ? "No se pudo guardar tu correo. Intenta de nuevo."
              : "We could not save your email. Please try again.")
        )
        return
      }

      setStatus("success")
      setMessage(
        data.message ?? (lang === "es" ? "Listo, te avisamos cuando abramos." : "Done. We will notify you soon.")
      )
      setEmail("")
    } catch (error) {
      console.error("waitlist_submit_failed", error)
      setStatus("error")
      setMessage(
        lang === "es"
          ? "Error de conexion. Intenta de nuevo en unos segundos."
          : "Connection error. Please try again in a few seconds."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <form
        className={cn(
          "flex overflow-hidden rounded-[100px] border border-input bg-transparent transition-colors",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 focus-within:ring-offset-0"
        )}
        onSubmit={onSubmit}
      >
        <Input
          autoComplete="email"
          className={cn(
            "h-11 min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
            inputClassName
          )}
          name="email"
          placeholder={emailPlaceholder}
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button className="h-11 shrink-0 rounded-none border-0 border-l border-input/50 px-5 hover:bg-primary/95" disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              {lang === "es" ? "Guardando" : "Saving"} <Loader2 className="animate-spin" />
            </>
          ) : (
            <>
              {buttonLabel} <ArrowRight />
            </>
          )}
        </Button>
      </form>
      {status !== "idle" ? (
        <p
          className={
            status === "success" ? "mt-3 text-sm text-foreground" : "mt-3 text-sm text-destructive"
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}

