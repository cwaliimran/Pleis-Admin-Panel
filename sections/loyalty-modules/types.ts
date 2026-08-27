/**
 * Shared across the loyalty v2 modules, which all render on both dashboards.
 *
 * Scoping differs by role: admin sends the header's selected company as
 * `companyOrganizer` and waits for that selection before querying, while an
 * organizer sends no company at all — the token identifies it, and the
 * role-routed slice picks the `/organizer` URL.
 */
export type LoyaltyUserType = 'organizer' | 'super-admin';

export interface LoyaltyViewProps {
  userType?: LoyaltyUserType;
}
