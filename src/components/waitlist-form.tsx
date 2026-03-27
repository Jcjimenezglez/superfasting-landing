"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface WaitlistFormProps {
  buttonLabel?: string
  className?: string
  emailPlaceholder?: string
  inputClassName?: string
}

type StatusType = "idle" | "success" | "error"

interface WaitlistAttributionPayload {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
}

function readAttribution(searchParams: URLSearchParams): WaitlistAttributionPayload {
  const attribution: WaitlistAttributionPayload = {}

  const utmSource = searchParams.get("utm_source")
  const utmMedium = searchParams.get("utm_medium")
  const utmCampaign = searchParams.get("utm_campaign")
  const utmTerm = searchParams.get("utm_term")
  const utmContent = searchParams.get("utm_content")
  const gclid = searchParams.get("gclid")

  if (utmSource) attribution.utmSource = utmSource
  if (utmMedium) attribution.utmMedium = utmMedium
  if (utmCampaign) attribution.utmCampaign = utmCampaign
  if (utmTerm) attribution.utmTerm = utmTerm
  if (utmContent) attribution.utmContent = utmContent
  if (gclid) attribution.gclid = gclid

  return attribution
}

function WaitlistFormFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div
        className={cn(
          "flex h-11 overflow-hidden rounded-[100px] border border-input bg-muted/25",
          "animate-pulse"
        )}
        aria-hidden
      />
    </div>
  )
}

function WaitlistFormInner({
  buttonLabel = "Join waitlist",
  className = "",
  emailPlaceholder = "you@email.com",
  inputClassName,
}: WaitlistFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
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
      const attribution = readAttribution(searchParams)

      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, attribution }),
      })

      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string }

      if (!response.ok || !data.ok) {
        setStatus("error")
        setMessage(data.message ?? "We could not save your email. Please try again.")
        return
      }

      setStatus("success")
      setEmail("")
      router.push("/thanks")
    } catch (error) {
      console.error("waitlist_submit_failed", error)
      setStatus("error")
      setMessage("Connection error. Please try again in a few seconds.")
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
              Saving <Loader2 className="animate-spin" />
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

export function WaitlistForm(props: WaitlistFormProps) {
  return (
    <Suspense fallback={<WaitlistFormFallback className={props.className} />}>
      <WaitlistFormInner {...props} />
    </Suspense>
  )
}
