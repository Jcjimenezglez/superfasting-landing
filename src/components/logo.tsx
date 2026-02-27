import { useId } from "react"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
  gradient?: boolean
}

export function Logo({ className, size = 24, gradient = false }: LogoProps) {
  const gradientId = useId()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      {gradient ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0A83B2" />
              <stop offset="100%" stopColor="#18A193" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="12" fill={`url(#${gradientId})`} />
        </>
      ) : (
        <circle cx="12" cy="12" r="12" fill="currentColor" />
      )}
    </svg>
  )
}
