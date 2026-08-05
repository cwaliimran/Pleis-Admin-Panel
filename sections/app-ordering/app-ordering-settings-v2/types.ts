// ============================================================
// Ordering Settings V2 — module-wide types
//
// Every section owns its own domain types and mappers; only what is
// genuinely shared across sections lives here.
// ============================================================

export type UserType = 'organizer' | 'super-admin';

/** Mirrors the variants accepted by the shared `CustomBadge` chip. */
export type CustomBadgeVariant = 'success' | 'error' | 'info' | 'warning' | 'default';
