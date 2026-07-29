# Organizer Subscription Module — Complete Test Case List

> Companion to `SUBSCRIPTION-MODULE-SPEC.md`. All expected amounts are computed from the sample pricing config:
> `ordering=20, loyalty=30, reservations=30, analytics=20 · bundle 2→10% / 3+→15% · multiOrg 100/95/90/85/80/75 · yearly −25%`
>
> If the live pricing config differs, re-derive the expected values through the §5 pipeline — the *assertions* stay the same.

---

## A. Plan Identity & Initial Load

| # | Test Case | Steps | Expected Result |
|---|---|---|---|
| A1 | Free user detection | Login as user whose `subscription.subscriptionTypes` includes `"free"` | UI treats user as free: Free card shown, update button disabled until selection made |
| A2 | Paid user detection | Login as user with e.g. `["ordering","loyalty"]` | Current-subscription card shown instead of Free card |
| A3 | No subscription response | User with no subscription data at all | Treated as new (non-free) subscription context; nothing pre-selected |
| A4 | Pre-fill from active subscription | Paid user opens page | Selected modules, analytics, org count, billing cycle reflect the active `subscription` object |
| A5 | Queued change visible | Paid user who previously downgraded (has non-free `inactiveSubscription`) | Data loads without error; active plan still drives the current card |

---

## B. Pricing — Module Base & Bundle Discount (monthly, 1 org)

| # | Selection | Calculation | Expected `totalSubscriptionAmount` |
|---|---|---|---|
| B1 | 1 module (`ordering`) | 20, no bundle discount | **20** |
| B2 | 2 modules (`ordering+loyalty`) | 50 − 10% = 45 | **45** |
| B3 | 3 modules (all) | 80 − 15% = 68 | **68** |
| B4 | Analytics only | base 0 + 20, no bundle discount | **20** (and this IS a paid plan, not free) |
| B5 | 1 module + analytics | 20 (no bundle, only 1 module) + 20 | **40** |
| B6 | 2 modules + analytics | (50 − 10%) + 20 = 45 + 20 | **65** — ⚠️ NOT 63 (10% off 70 would mean analytics wrongly discounted) |
| B7 | 3 modules + analytics | (80 − 15%) + 20 = 68 + 20 | **88** — ⚠️ NOT 85 |

> B6/B7 are the key regression cases proving analytics never receives bundle discount, and that analytics does not count toward the 2/3-module bundle threshold.

---

## C. Pricing — Multi-Org Tiers (2 modules = 45 subtotal, monthly)

| # | Orgs | Calculation | Expected |
|---|---|---|---|
| C1 | 1 | 45 × 100% × 1 | **45** |
| C2 | 2 | 45 × 95% × 2 = 42.75 × 2 | **85.5** |
| C3 | 3 | 45 × 90% × 3 = 40.5 × 3 | **121.5** |
| C4 | 4 | 45 × 85% × 4 = 38.25 × 4 | **153** |
| C5 | 5 | 45 × 80% × 5 = 36 × 5 | **180** |
| C6 | 6 (via 6+) | 45 × 75% × 6 = 33.75 × 6 | **202.5** |
| C7 | 10 (custom) | 45 × 75% × 10 | **337.5** |

### Org-count input edge cases

| # | Test Case | Expected |
|---|---|---|
| C8 | Select 6+, leave custom input empty | Calculation uses **6** |
| C9 | Select 6+, enter 5 (below min) | Value < 6 not accepted for calc; falls back to **6** |
| C10 | Select 6+, enter 1000 | Accepted (max allowed) |
| C11 | Select 6+, enter 1001 | Rejected / capped at **1000** |
| C12 | Select 6+, enter 6 | Accepted, uses 6 |
| C13 | Switch from 6+ back to standard button (e.g. 3) | Custom value ignored; tier `threeOrgs` used |

---

## D. Pricing — Billing Cycle

| # | Test Case | Calculation | Expected |
|---|---|---|---|
| D1 | Monthly (2 modules, 3 orgs) | totalMultiOrg | **121.5** |
| D2 | Yearly (same selection) | 121.5 × 12 = 1458 − 25% | **1093.5** (matches sample sub) |
| D3 | Yearly `monthlyPrice` display | 1093.5 / 12 | **91.13** (2-dp rounding) |
| D4 | Full stack yearly: 3 modules + analytics, 6 orgs | 88 × 0.75 × 6 = 396/mo → 4752 − 25% | **3564** |
| D5 | Yearly discount order | Verify discount applied AFTER ×12, not on monthly figure first | Same result numerically, but breakdown UI must show yearlyBase 1458 → −364.5 |
| D6 | Monthly plan gets no yearly discount | Monthly selected | No yearly discount anywhere in breakdown |

---

## E. First-Time / Free-to-Paid Purchase

| # | Test Case | Expected |
|---|---|---|
| E1 | Free user selects 2 modules, 3 orgs, yearly → submit | `PUT /organizer/subscriptions` body: `{ subscriptionTypes: ["ordering","loyalty"], pricingPlan: "yearly", numberOfOrganizations: 3, totalSubscriptionAmount: 1093.5 }` |
| E2 | After success | `subscription` object updated directly (NOT `inactiveSubscription`); commissions on user become 0 |
| E3 | Free user, empty selection | Update button **disabled** (cannot "buy free") |
| E4 | Free user selects analytics only → submit | Paid flow, `subscriptionTypes: ["analytics"]` (or per implementation), amount 20/mo |
| E5 | Billing Cycle section visible for free/new user | Always shown |

---

## F. Change Detection (paid user, `analyzeSubscriptionChange()`)

Baseline for all F cases: active = `["ordering","loyalty"]`, monthly, 3 orgs.

| # | Change made | Expected `changeType` |
|---|---|---|
| F1 | Add `reservations` | `upgrade` |
| F2 | Add analytics | `upgrade` |
| F3 | Increase orgs 3 → 5 | `upgrade` |
| F4 | Add module + increase orgs | `upgrade` (pure additions) |
| F5 | Remove `loyalty` | `downgrade` |
| F6 | Decrease orgs 3 → 2 | `downgrade` |
| F7 | Add `reservations` AND remove `loyalty` (mixed) | **NOT** `upgrade` → `downgrade` (only pure additions are upgrades) |
| F8 | Billing cycle only: monthly → yearly | `downgrade`-path (next-recurring), **no immediate charge** |
| F9 | Billing cycle only: yearly → monthly | Same — next-recurring, no immediate charge |
| F10 | No changes at all | `no_change` |
| F11 | Deselect everything (no modules, no analytics) | `free_plan` |

---

## G. Paid Upgrade — Immediate Prorated Charge

Baseline: active `["ordering"]` (20/mo), monthly, 1 org, exactly half the period remaining (15 of 30 days).

| # | Test Case | Calculation | Expected |
|---|---|---|---|
| G1 | Add `loyalty` mid-period | new module 30, **no bundle discount**, ×100% ×1 org ×(15/30) | Charge now = **15** — ⚠️ NOT 12.5 (which would mean bundle discount was wrongly applied to 50−10%=45 delta) |
| G2 | Proration ratio (monthly) | `daysRemaining / totalDaysInCurrentPeriod` | Ratio matches actual dates from `startDate`/`endDate` |
| G3 | Proration ratio (yearly plan) | `daysRemaining / 365 (or 366)` | Leap year handled |
| G4 | Yearly-plan upgrade includes yearly discount | Upgrade on a yearly subscription | Prorated amount includes −25% yearly discount |
| G5 | Multi-org applied in proration | Upgrade with 3 orgs active | Prorated delta uses 90% payable × 3 orgs |
| G6 | Analytics added mid-period | 20 × orgTier × orgs × ratio, never bundle-discounted | Correct prorated analytics charge |
| G7 | Payload amount on upgrade | Submit upgrade | `totalSubscriptionAmount` = `proratedUpgrade.totalProratedAmount` |
| G8 | Upgrade near period end (1 day left) | Tiny ratio | Small positive charge, no negative/zero anomalies |
| G9 | Upgrade on day 1 (full period remaining) | Ratio ≈ 1 | Charge ≈ full-price delta |

---

## H. Paid Downgrade / No-Change — Next-Cycle Amount

| # | Test Case | Expected |
|---|---|---|
| H1 | Remove a module → submit | Amount sent = `nextRecurring.displayAmount` (full §5 pipeline for the NEW config, bundle discount INCLUDED) |
| H2 | Downgrade takes effect next cycle | `inactiveSubscription` updated; active `subscription` unchanged until `endDate` |
| H3 | No refund on downgrade | No credit/refund anywhere; current plan runs to `endDate` |
| H4 | Billing-cycle change monthly → yearly | Sent as next-recurring amount (yearly-discounted full cycle), no prorated charge |
| H5 | `no_change` submit path | If reachable, amount = `nextRecurring.displayAmount` for identical config |
| H6 | Next Recurring card hidden | Card not rendered in UI, but downgrade payload amount still correct (proves internal calc alive) |
| H7 | Next-cycle rollover | After active `endDate` passes, `inactiveSubscription` becomes active `subscription` |

---

## I. Downgrade to Free

| # | Test Case | Expected |
|---|---|---|
| I1 | Paid user deselects everything → submit | Payload force-normalized: `{ subscriptionTypes: ["free"], pricingPlan: "monthly", numberOfOrganizations: 1, totalSubscriptionAmount: 0 }` |
| I2 | Normalization overrides prior state | Even if user was yearly / 5 orgs, payload still `monthly` / `1` / `0` |
| I3 | Applies next cycle | Active paid plan keeps running until `endDate`; `inactiveSubscription` = free |
| I4 | Modules stay usable until period end | Paid features work until `endDate` (no immediate cutoff) |

---

## J. UI Control Rules

| # | Test Case | Expected |
|---|---|---|
| J1 | Billing Cycle hidden — paid active, no changes | Section not visible |
| J2 | Billing Cycle shown — paid user makes any change | Section becomes visible |
| J3 | Billing Cycle shown — free/new user | Always visible |
| J4 | Update button — paid active, no changes | Disabled |
| J5 | Update button — paid active, any change | Enabled |
| J6 | Update button — free user, empty selection | Disabled |
| J7 | Update button — free user, non-empty selection | Enabled |
| J8 | Free card vs current card | Free user sees Free card; paid user sees current-subscription card |
| J9 | Price breakdown reactivity | Every toggle (module/analytics/orgs/cycle) recalculates displayed price instantly per §5 order |

---

## K. Payload Contract & Data Integrity

| # | Test Case | Expected |
|---|---|---|
| K1 | Payload shape (all scenarios) | Exactly 4 fields: `subscriptionTypes: string[]`, `pricingPlan: "monthly"\|"yearly"`, `numberOfOrganizations: number`, `totalSubscriptionAmount: number` |
| K2 | Amount source per scenario | first-time → pipeline final; upgrade → `proratedUpgrade.totalProratedAmount`; downgrade/no-change/cycle → `nextRecurring.displayAmount`; free → `0` |
| K3 | Commissions after paid sub | User's `orderingCommission` / `ticketingCommission` / `reservationCommission` = 0 while paid subscription active |
| K4 | Rounding | All money values displayed to 2 dp; `monthlyPrice` = total/12 rounded (91.125 → 91.13) |
| K5 | Dates | `startDate`/`endDate` returned by API drive proration; yearly plan `endDate` = start + 1 year |

---

## L. Suggested Priority Order for a Test Run

1. **Smoke:** A1–A4, B2, C3, D2, E1 (the happy path that reproduces the sample 1093.5)
2. **Money-critical regressions:** B6, B7 (analytics no-bundle), G1 (no bundle on prorated delta), F7 (mixed ≠ upgrade), F8 (cycle change not charged now), I1–I2 (free normalization)
3. **Boundaries:** C8–C13 (org input), G8–G9 (proration extremes), D3/K4 (rounding)
4. **State/lifecycle:** E2, H2, H7, I3, K3 (subscription vs inactiveSubscription, rollover, commissions)
5. **UI gates:** J1–J9
