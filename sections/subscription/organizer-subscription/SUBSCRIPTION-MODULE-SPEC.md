# Organizer Subscription Module — Complete Specification

> Consolidated from `rules.txt`, `subscription-backend-flow.txt`, and `subscription-calculation-rules.txt`.
> This is the single source of truth for the subscription module logic (UI is ready; this doc drives the logic implementation).

---

## 1. Overview

Organizers subscribe to **Premium Modules** (`ordering`, `loyalty`, `reservations`), an optional **Advanced Analytics** add-on (`analytics`), across **1–1000 organizations**, billed **monthly** or **yearly**. Pricing is fully config-driven from the backend. There are **no refunds** — downgrades always take effect on the next billing cycle; only upgrades are charged immediately (prorated).

---

## 2. Data Sources (APIs)

| Purpose | Endpoint | What we use |
|---|---|---|
| Pricing configuration | `GET /organizer/subscriptions` | `data[0]` → `modulePricing`, `bundleDiscounts`, `multiOrgPricing`, `yearlyDiscount`, `commissions` |
| User's own subscription | `GET /organizer/subscriptions/user` | `data[0].subscription` (active) and `data[0].inactiveSubscription` (queued next-cycle plan) |
| Create/Update subscription | `PUT /organizer/subscriptions` | See payload contract (§10) |

### 2.1 Pricing Config Shape (`GET /organizer/subscriptions` → `data[0]`)

```jsonc
{
  "modulePricing": [
    { "module": "ordering",     "price": 20 },
    { "module": "loyalty",      "price": 30 },
    { "module": "reservations", "price": 30 },
    { "module": "analytics",    "price": 20 }
  ],
  "bundleDiscounts": { "twoModules": 10, "threeModules": 15 },        // percent
  "multiOrgPricing": {                                                 // PAYABLE percent, not discount
    "oneOrg": 100, "twoOrgs": 95, "threeOrgs": 90,
    "fourOrgs": 85, "fiveOrgs": 80, "sixPlusOrgs": 75
  },
  "yearlyDiscount": { "discountPercent": 25 },                         // percent off annualized total
  "commissions": {
    "orderingCommission": 5,
    "ticketingCommission": 10,
    "reservationCommission": 10
  }
}
```

### 2.2 User Subscription Shape (`GET /organizer/subscriptions/user`)

Two objects come back: **`subscription`** (currently active) and **`inactiveSubscription`** (the plan queued for the next cycle).

```jsonc
"subscription": {
  "subscriptionTypes": ["ordering", "loyalty"],   // or ["free"]
  "pricingPlan": "yearly",                        // "monthly" | "yearly"
  "numberOfOrganizations": 3,
  "totalSubscriptionAmount": 1093.5,
  "monthlyPrice": 91.13,
  "startDate": "2026-03-09T10:08:04.674Z",
  "endDate": "2027-03-09T10:08:04.674Z",
  "orderingCommission": 0,
  "ticketingCommission": 0,
  "reservationCommission": 0
}
```

**Lifecycle of the two objects:**
- Free → paid (first purchase): **`subscription`** is updated directly.
- Existing paid user upgrades/downgrades: **`inactiveSubscription`** is updated. When the active subscription's period ends, `inactiveSubscription` becomes the active `subscription`.
- When there is no queued change, `inactiveSubscription` shows `"subscriptionTypes": ["free"]`.

---

## 3. Plan Identity Rules

- **User is on the free plan** ⇔ `subscription.subscriptionTypes` **includes** `"free"`.
- **Target selection is a free plan** ⇔ `selectedModules.length === 0 && includeAnalytics === false`.
- **Target selection is paid** ⇔ at least one module OR analytics is selected.
- If no subscription response exists at all, the UI treats the context as a non-free **new subscription** until the user selects something.

---

## 4. Organization Count Rules

- Standard selector buttons: **1, 2, 3, 4, 5, 6+**.
- Selecting **6+** enables a **custom org input**.
  - Minimum custom value: **6**
  - Maximum custom value: **1000**
- Effective org count used in every calculation:
  1. The custom value, if custom mode is on and value ≥ 6
  2. Else `6` when custom mode is selected (invalid/empty input)
  3. Else the selected standard button value

Payable-% tier lookup: `1→oneOrg, 2→twoOrgs, 3→threeOrgs, 4→fourOrgs, 5→fiveOrgs, ≥6→sixPlusOrgs`.

---

## 5. Price Calculation Pipeline (First-Time / Free-to-Paid)

The calculation is a strict ordered pipeline. **Order matters.**

```
Step 1  moduleBase        = sum(prices of selected NON-analytics modules)
Step 2  bundleDiscount    = 2 non-analytics modules  → bundleDiscounts.twoModules %
                            3+ non-analytics modules → bundleDiscounts.threeModules %
                            (applied ONLY to moduleBase; analytics NEVER gets it)
        discountedModules = moduleBase - bundleDiscountAmount
Step 3  subtotal          = discountedModules + analyticsPrice (if analytics selected)
Step 4  orgPayablePercent = multiOrgPricing tier for effective org count (§4)
        pricePerOrg       = subtotal * (orgPayablePercent / 100)
        totalMultiOrg     = pricePerOrg * organizationCount
Step 5  Billing cycle:
          monthly → finalAmount = totalMultiOrg
          yearly  → yearlyBase  = totalMultiOrg * 12
                    finalAmount = yearlyBase - (yearlyBase * yearlyDiscount.discountPercent / 100)
```

`finalAmount` is what goes into `totalSubscriptionAmount` for a first-time / free-to-paid purchase.

### 5.1 Worked Example (validated against the sample data)

Selection: `ordering (20)` + `loyalty (30)`, no analytics, **3 orgs**, **yearly**.

| Step | Math | Result |
|---|---|---|
| Module base | 20 + 30 | 50 |
| Bundle discount (2 modules → 10%) | 50 − 5 | 45 |
| Analytics | not selected | 45 |
| Multi-org (3 orgs → 90% payable) | 45 × 0.90 = 40.5/org; × 3 orgs | 121.5 /mo |
| Yearly base | 121.5 × 12 | 1458 |
| Yearly discount (25%) | 1458 − 364.5 | **1093.5** |

Matches the sample response: `totalSubscriptionAmount: 1093.5`, `monthlyPrice: 91.13` (= 1093.5 / 12).

---

## 6. Update Flow — Change Detection (Paid Users)

Change analysis (`analyzeSubscriptionChange()`) runs only for **paid** users. Change types:

| Change type | Trigger | Charged when |
|---|---|---|
| `upgrade` | **Pure additions only** (added module, added analytics, more orgs) | **Immediately**, prorated (§7) |
| `downgrade` | Any net removal, **or a billing-cycle-only change** | Next cycle (§8) |
| `no_change` | Target config identical to current | Next cycle value sent (§8) |
| `free_plan` | Target selection is empty (no modules + no analytics) | Nothing — normalized payload (§9) |

Key nuances:
- **Only pure additions count as an upgrade.** Mixed add+remove is not an upgrade.
- **Billing-cycle changes are never immediate** — they are treated as a next-recurring (future-cycle) change.
- **No refunds exist anywhere.** Removals simply take effect at the next recurrence.

---

## 7. Paid Upgrade — Immediate Prorated Charge

When `changeType === "upgrade"` and `proratedUpgrade` exists:

- **Charge now** = `proratedUpgrade.totalProratedAmount`
- **Proration ratio** = `daysRemaining / totalDaysInCurrentPeriod`
  - monthly: days remaining / days in current period
  - yearly: days remaining / days in year (365 or 366)
- Discount behavior during proration:
  - **Newly added modules do NOT receive bundle discount** in the prorated charge.
  - Analytics still never gets bundle discount.
  - **Multi-org payable %** IS applied in the prorated calculation.
  - **Yearly discount** IS included when the plan is yearly.

---

## 8. Paid Downgrade / No-Change — Next-Cycle Amount

When the change is **not** an upgrade and `nextRecurring` exists:

- **Amount sent** = `nextRecurring.displayAmount`
- `nextRecurring` is a **full-cycle price** (the complete pipeline of §5 with ALL discounts, including bundle discount, applied for the future cycle).
- Billing-cycle changes land here too — applied on next recurring, never as an immediate prorated charge.
- Note: the **Next Recurring UI card is currently hidden**, but its calculation is still used internally to produce the payload amount for this path.

---

## 9. Downgrade to Free

Triggered when the target selection becomes empty (no modules + no analytics). Applies **next cycle** (no refund). The payload is **force-normalized** to:

```json
{
  "subscriptionTypes": ["free"],
  "pricingPlan": "monthly",
  "numberOfOrganizations": 1,
  "totalSubscriptionAmount": 0
}
```

Org count and billing cycle are always forced to `1` / `"monthly"` regardless of what was previously selected.

---

## 10. API Update Payload Contract

`PUT /organizer/subscriptions`

```ts
{
  subscriptionTypes: string[];              // e.g. ["ordering","loyalty"] | ["free"]
  pricingPlan: "monthly" | "yearly";
  numberOfOrganizations: number;
  totalSubscriptionAmount: number;          // see amount source table below
}
```

**Where `totalSubscriptionAmount` comes from:**

| Scenario | Amount source |
|---|---|
| First-time / free-to-paid | §5 pipeline `finalAmount` |
| Paid upgrade | `proratedUpgrade.totalProratedAmount` |
| Paid downgrade / no-change / cycle change | `nextRecurring.displayAmount` |
| Downgrade to free | `0` (forced) |

---

## 11. Discount Applicability Matrix

| Discount | Applies to | Never applies to |
|---|---|---|
| **Bundle** (2 → `twoModules`%, 3+ → `threeModules`%) | Non-analytics module subtotal, full-cycle pricing (incl. `nextRecurring`) | Analytics; newly added modules within a prorated upgrade |
| **Multi-org** (payable-% tier) | Always — scales `subtotal × payable% × orgCount`; also applied in prorated upgrades | — (it's a payable percentage, not a subtractive discount) |
| **Yearly** (`discountPercent`) | Only when `billingCycle === "yearly"`, applied **after** annualization (×12); included in yearly prorated upgrades | Monthly billing |

---

## 12. UI Control Rules

- **Billing Cycle section**
  - Hidden for paid-active users with no pending changes.
  - Shown when a paid user has changes, OR the user is not paid-active (free/new).
- **Update button**
  - Paid-active user: enabled **only when there are changes**.
  - Free/new user: enabled **only when the selection is non-empty**.
- **Plan cards**: free users see the Free card; paid users see their current-subscription card in that slot.
- **Next Recurring card**: hidden in the UI, but its values still drive downgrade/no-change payload amounts (§8).

---

## 13. Edge Cases & Implementation Notes

1. **Free-plan transition normalization** — always force `numberOfOrganizations: 1` and `pricingPlan: "monthly"` (§9), regardless of prior state.
2. **Missing subscription response** — treat as a new (non-free) subscription context until the user makes a selection.
3. **Page offset / rounding** — `monthlyPrice` on yearly plans is `totalSubscriptionAmount / 12`, rounded to 2 dp (e.g. 1093.5 / 12 = 91.125 → 91.13).
4. **`inactiveSubscription` semantics** — it is the "what happens next cycle" slot: `["free"]` means nothing queued; any other value replaces the active plan at `endDate`.
5. **Commissions** — the pricing config carries platform commission percentages (`orderingCommission`, `ticketingCommission`, `reservationCommission`); an active paid subscription zeroes the corresponding commissions on the user object (see sample: all `0` for a paid user).
6. **No refunds, ever** — every removal-type change is deferred to the next cycle; only pure additions charge immediately.
