"use client"

import type React from "react"

type MembershipTier = "gold" | "silver" | "bronze" | "none"

export type ReservationRequest = {
  id: string
  name: string
  membership?: MembershipTier
  reservationType: string
  guests: number
  linkedTicket: string
  date: string // e.g. "2025-10-15"
  timeStart: string // e.g. "20:00"
  timeEnd: string // e.g. "23:00"
}

type Props = {
  request: ReservationRequest
  className?: string
  onAccept?: (id: string) => void
  onUpgrade?: (id: string) => void
  onReject?: (id: string) => void
  accentColor?: string
}

const tierAccent: Record<MembershipTier, { bar: string; badge: string; badgeText: string }> = {
  gold: {
    bar: "bg-amber-500",
    badge: "bg-amber-100 text-amber-900 dark:bg-amber-200/20 dark:text-amber-200",
    badgeText: "Gold Member",
  },
  silver: {
    bar: "bg-slate-400",
    badge: "bg-slate-100 text-slate-900 dark:bg-slate-200/20 dark:text-slate-200",
    badgeText: "Silver Member",
  },
  bronze: {
    bar: "bg-orange-500",
    badge: "bg-orange-100 text-orange-900 dark:bg-orange-200/20 dark:text-orange-200",
    badgeText: "Bronze Member",
  },
  none: {
    bar: "bg-primary",
    badge: "bg-muted text-muted-foreground",
    badgeText: "Member",
  },
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        "border border-border/60",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={["inline-flex items-center gap-1 rounded-md border border-border/60", "bg-muted/50 px-2 py-1"].join(
        " ",
      )}
      aria-label={label}
      title={`${label}: ${value}`}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  )
}

export function AccentReservationCard({ request, className = "", onAccept, onUpgrade, onReject, accentColor }: Props) {
  const tier = request.membership ?? "none"
  const t = tierAccent[tier]
  const accentBarClass = accentColor ? "" : t.bar

  return (
    <article
      role="group"
      aria-labelledby={`reservation-${request.id}-title`}
      className={[
        "relative overflow-hidden rounded-lg border border-border bg-card text-foreground",
        "shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md",
        className,
      ].join(" ")}
    >
      {/* Accent bar */}
      <span
        className={["pointer-events-none absolute left-0 top-0 h-full w-1", "rounded-l-lg", accentBarClass].join(" ")}
        style={accentColor ? { backgroundColor: accentColor } : undefined}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 id={`reservation-${request.id}-title`} className="text-pretty text-base font-semibold leading-6">
                {request.name}
              </h3>
              {request.membership && <Badge className={t.badge}>{t.badgeText}</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {request.date} • {request.timeStart}–{request.timeEnd}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <MetaChip label="Reservation" value={request.reservationType} />
          <MetaChip label="Guests" value={`${request.guests}`} />
          <MetaChip label="Ticket" value={request.linkedTicket} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onAccept?.(request.id)}
            className={[
              "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
              "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            <span aria-hidden="true">✔</span>
            <span>Accept</span>
          </button>

          <button
            type="button"
            onClick={() => onUpgrade?.(request.id)}
            className={[
              "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
              "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            <span aria-hidden="true">⇪</span>
            <span>Offer Upgrade</span>
          </button>

          <button
            type="button"
            onClick={() => onReject?.(request.id)}
            className={[
              "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
              "bg-red-600 text-white hover:bg-red-500 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-red-600/50 focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            <span aria-hidden="true">✕</span>
            <span>Reject</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default AccentReservationCard
