# V2 history-module pattern

Context for continuing work on the "v2" modules in this repo (Pleis Admin Panel, Next.js + shadcn/Tailwind + RTK Query). Two modules have been built so far as the reference implementation:

- `sections/transactions/transaction-history-v2/` → route `/super-admin/transactions-history-v2`
- `sections/transactions/ticketing-history-v2/` → route `/super-admin/ticketing-history-v2`

Still pending, same pattern, placeholder pages already exist (just a heading) at:
- `/super-admin/reservation-history` → build `reservation-history-v2`
- `/super-admin/ordering-history` → build `ordering-history-v2`
- `/super-admin/loyalty-history` → build `loyalty-history-v2`
- `/super-admin/payouts-batches` → build `payouts-batches-v2` (this one is a genuinely different screen — a batch list/detail, not a transaction-state list — treat it as its own design once screenshots are provided, but reuse the same building blocks: schema-driven filters, theme constants, Sheet panel, folder layout)

Read this file first, then read `sections/transactions/transaction-history-v2/` end to end as the canonical example before writing any code.

## Why this exists

The client supplied Figma-style dark-mode screenshots of a reconciliation/back-office UI (stat cards, a dense sortable table, quick filters, a full advanced-filter drawer, a detail modal). There is **no backend for any of this yet** — every module so far is built against realistic mock data so the UI can be reviewed and signed off before real API integration. The user explicitly chose "build the UI now, mock the data" over waiting for a backend. Do not invent backend endpoints or wire RTK Query for these modules unless told otherwise.

Each module lives at a new `-v2` route **alongside** the existing v1 page — v1 is never modified or removed. The sidebar shows both, labeled "X v1" / "X v2" (see `app/super-admin/(super-admin)/@left/data.tsx` and `paths.tsx`).

## Folder structure (mandatory, copy exactly)

```
sections/transactions/<module>-v2/
├── advanced-filters/
│   ├── active-count.ts          # counts "active" filters for the badge on the Filter button
│   ├── default-values.ts        # builds the default FilterValues object from the schema
│   ├── filter-field.tsx         # generic control renderer (pill/select/text/range/tristate/date-range)
│   ├── filter-section.tsx       # one accordion section (animated open/close)
│   ├── index.ts                 # barrel: re-exports panel + predicate + types + helpers
│   ├── predicate.ts             # matchesAdvancedFilters(record, values) — real matching against mock data
│   ├── sa-badge.tsx             # small "SA" (superadmin-only) pill, reused everywhere
│   ├── saved-views.ts           # 2 default saved views ("Daily close-out" starred, "Refund review")
│   ├── schema.ts                # THE spec: FILTER_SECTIONS — every section/field/option from screenshots
│   └── <domain>-filters-panel.tsx  # the Sheet drawer itself (e.g. transaction-filters-panel.tsx)
│
├── components/
│   ├── filters/
│   │   ├── filters.ts                    # PRESET_OPTIONS, DATE_BASIS_OPTIONS, PERIOD_OPTIONS, matchesSearch
│   │   └── <module>-history-filters.tsx  # the always-visible quick bar (Date Basis / Period / Search / Presets)
│   ├── modals/
│   │   └── <thing>-detail-modal.tsx      # the row detail modal (+ an exclude modal if the domain needs one)
│   ├── pagination/
│   │   └── <module>-history-pagination.tsx
│   ├── stats/                            # OMIT this folder entirely if the screenshot has no stat cards
│   │   └── <module>-stat-card.tsx
│   └── table/
│       ├── cell-parts.tsx                # small presentational cells (type/status/settlement badges)
│       ├── detail-parts.tsx              # SectionHeading / InfoLine / DocumentCard for the modal
│       ├── <module>-history-table-row.tsx
│       └── <module>-history-table.tsx    # Card + header row (title, toggles, Filter badge) + Table + pagination
│
├── config/
│   ├── config.ts    # category/status/settlement → {label, className} lookup maps
│   └── theme.ts      # FILTER_ACTIVE_SOLID / FILTER_ACTIVE_SOFT / FILTER_COUNT_BADGE — see Theme section below
│
├── data/
│   └── mock-data.ts  # hand-written rows matching the screenshots exactly + a clone-to-pad-total helper
│
├── forms/
│   └── format.ts     # formatEuro / formatPercent (copy verbatim, same content every module)
│
├── types/
│   └── types.ts      # the domain's row + detail TypeScript types
│
├── <module>-history-view.tsx   # the root component: header, table, modals — owns ALL state
└── index.ts                    # export { default as <Module>ViewV2 } from './<module>-history-view'
```

Every module is **fully self-contained** — no cross-imports between sibling `-v2` modules (e.g. ticketing-history-v2 does not import anything from transaction-history-v2). Small files like `theme.ts` and `format.ts` are deliberately duplicated per module rather than shared.

Route wiring for a new module (mirror exactly what exists for the two done modules):
1. Add `<module>HistoryV2: '/super-admin/<module>-history-v2'` to `app/super-admin/(super-admin)/@left/paths.tsx`.
2. Create `app/super-admin/(super-admin)/<module>-history-v2/page.tsx` — `Header` breadcrumb + `<ModuleHistoryViewV2 />`, no props needed unless the module needs a cross-link like `payoutsBatchesHref`.
3. In `app/super-admin/(super-admin)/@left/data.tsx`, relabel the existing sidebar entry to "`<Module> history v1`" and add a new "`<Module> history v2`" entry pointing at the new path, right next to it.

## Reading the screenshots — process

1. Transcribe every visible row/field value verbatim into the mock data — don't paraphrase. If stat-card totals are given directly (e.g. "€869.60"), hardcode them; don't try to derive them by summing rows (rounding/transcription drift will make them disagree, which looks like a bug).
2. For the advanced-filter drawer: each section header shows a literal field count ("Scope · 6 filters") — this must equal `section.fields.length`, not a computed "active filters" count. Use it to sanity-check you transcribed every field.
3. Map every visible filter option pill/select value verbatim (including exact snake_case tokens like `ticketing_purchase`, `NOT_FISCALIZED`, etc.) — these are meant to look like real backend enum values.
4. Note per-field and per-option "SA" badges separately — a badge can sit on a whole field (`superAdminOnly` on `FilterFieldDef`) or on a single pill option (`superAdminOnly` on `FilterOption`) — see `ticketing-history-v2/advanced-filters/schema.ts`'s `invoiceRole` field for the per-option case.
5. Where a filter section shows a conditional disabled state (e.g. "disabled — select the Subscriptions module first"), implement it with `FilterSectionDef.disabledWhen` / `disabledHelperText` (section-level) or `FilterFieldDef.disabledWhen` / `disabledHelperText` (field-level, e.g. "Uses remaining" disabled until "Repeatable" = Yes in ticketing-history-v2).
6. If a screenshot shows a custom tri-state label (e.g. "Any / Yes / Never scanned" instead of "Any / Yes / No"), use `FilterFieldDef.triStateLabels: [string, string, string]` — don't add a new field type for it.

## The advanced-filters engine (schema-driven, don't write bespoke JSX per field)

Field types: `'pill' | 'select' | 'text' | 'range' | 'tristate' | 'date-range'`. `filter-field.tsx` has exactly one renderer per type; adding a field is a data change in `schema.ts`, never a new component.

`FilterFieldDef` supports (see `types.ts`):
- `options` — static option list, OR `optionsFor(values)` — computed options that depend on another field's current value (used for cascading Scope selects, see below).
- `disabledWhen(values)` / `disabledHelperText` — field-level conditional disable.
- `resets: string[]` — when this field changes, reset these other field ids back to their type default (e.g. changing Company resets Organization and Venue).
- `superAdminOnly` — renders the amber "SA" badge next to the label.
- `triStateLabels` — override the default `['Any','Yes','No']` labels.

**Scope cascade** (Company → Organization → Venue) is the standard pattern for every module so far — copy it verbatim, just re-point the `COMPANY_ORGANIZATIONS` / `ORGANIZATION_VENUES` lookup maps at the same three fictional companies (Cabaret Grupa d.o.o. / PLEIS Cabaret / Tkalčićeva, Nokturno Ugostiteljstvo d.o.o. / Nokturno / Jarun, Alcatraz Events j.d.o.o. / Alcatraz Zagreb / Centar) used in both existing modules, for consistency across the whole mock dataset:

```ts
const isAny = (value: FilterValues[string]) => !value || value === 'any';

{ id: 'company', type: 'select', superAdminOnly: true, resets: ['organization', 'venue'], options: [ANY_OPTION, ...] },
{ id: 'organization', type: 'select', resets: ['venue'], disabledWhen: (v) => isAny(v.company), optionsFor: (v) => [ANY_OPTION, ...(COMPANY_ORGANIZATIONS[v.company as string] || [])] },
{ id: 'venue', type: 'select', disabledWhen: (v) => isAny(v.organization), optionsFor: (v) => [ANY_OPTION, ...(ORGANIZATION_VENUES[v.organization as string] || [])] },
```

`transaction-filters-panel.tsx` (the Sheet) owns a **draft copy** of the applied filter values — edits inside the panel don't touch the table until "Apply filters"; "Clear all" resets both the draft and the applied state. It applies `field.resets` on every field change (walk `getFieldById(id).resets` and set each to `defaultValueForType(field.type)`).

`predicate.ts` is the one place allowed to be "honest but partial": wire real matching logic only for fields that have corresponding mock data. Fields with no backing mock data (most Payment/Documents-heavy fields, since the domain has ~50-60 filter fields but the mock row only has ~15-20 real properties) should render fully interactive but are allowed to be inert (selecting them just doesn't narrow results). **Always say so explicitly in your final summary** — don't let it look silently wired.

## Theme rules (important — don't relearn this the hard way)

This project's dark-mode CSS has a bug: `app/globals.css` sets `.dark { --primary: blue; }` — the literal CSS color `blue` (`#0000FF`), not a muted tone. Any Tailwind class that resolves through `bg-primary` / `text-primary` / `border-primary` (including shadcn `Button`'s default variant, and `ToggleSwitch`'s checked state) renders a jarring pure-blue in dark mode. **Do not use `bg-primary`/`text-primary`/`border-primary` for anything you build in these modules.** Instead use the two fixed-hex constants in `config/theme.ts` (duplicate this file verbatim into every new module):

```ts
export const FILTER_ACTIVE_SOLID = 'border-blue-600 bg-blue-600 text-white';
export const FILTER_ACTIVE_SOFT = 'border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
export const FILTER_COUNT_BADGE = 'bg-blue-600 text-white';
```

`blue-600` is literally the same hex as the light-mode `--primary` (`#2563EB`), so it looks correct and identical in both themes. Use `FILTER_ACTIVE_SOLID` for selected pills/tri-state buttons, `FILTER_ACTIVE_SOFT` for the pastel "Preset: X" / selected-saved-view chip, `FILTER_COUNT_BADGE` for the small numeric badge on the Filter button. For any one-off primary-colored button inside these modules (e.g. "Apply filters"), override explicitly: `className="bg-blue-600 text-white hover:bg-blue-700"` instead of relying on `Button`'s default variant.

The pre-existing page-level chrome inherited from v1 (e.g. an "Export to CSV" button, a cross-link badge) still uses `bg-primary` in the reference modules — that inconsistency was flagged to the user but deliberately left alone since it mirrors v1 and wasn't part of what was asked. Use your judgment: new elements you add should use the fixed-hex constants; don't feel obligated to also fix untouched v1-inherited chrome unless asked.

## Table gotcha: `whitespace-nowrap`

shadcn's `TableCell` (`components/ui/table.tsx`) sets `whitespace-nowrap` by default, and `white-space` is inherited by all descendants. Any secondary/note line inside a cell (e.g. a settlement note, a two-line owner/email block) will **not wrap** and will visually spill into the next column instead of respecting `max-w-*` — unless you explicitly add `whitespace-normal` back. Always pair a `max-w-*` with `whitespace-normal` on any `TableCell` (or inner element) that can contain a longer secondary line. This bit us once already in transaction-history-v2 (Settlement/Fiscalization columns visually merged) — don't repeat it.

## List page anatomy (what every module's `-view.tsx` renders)

1. Header row: `<h1>` title + one-line muted subtitle (verbatim from the screenshot), and right-aligned action button(s) (typically "Export to CSV"; add a cross-link button like "Payouts & batches" only if the screenshot shows one).
2. Optional stat-card row (`components/stats/`) — **only if the screenshot has one**; ticketing-history-v2 has none, transaction-history-v2 has four. Stat values are hardcoded from the screenshot, not computed.
3. The table `Card` (`components/table/<module>-history-table.tsx`):
   - Title (e.g. "Transaction History List" / "Ticket List") + any domain-specific toggle (e.g. ticketing's "Latest state only" `ToggleSwitch`) + the "Filter" `Badge` button (opens the advanced-filters Sheet; shows the active-filter count badge from `countActiveFilters`).
   - The always-visible quick filter bar (`components/filters/<module>-history-filters.tsx`): Date Basis select, Period select (+ Start/End date pickers when Period = "Custom range..."), Search input, Preset pills row, and the "Preset: X ×  · Clear all" chip when one is active.
   - `<ModuleFiltersPanel>` (the Sheet), mounted here.
   - The `Table` itself: `TableHeadCustom` + `useTableSort` for sortable columns, `TableBodyWrapper` for loading/empty states, one row component per record.
   - Pagination footer — copy the exact footer wording from the screenshot; it is **not** always "Page X of Y | Showing N of Total" (ticketing-history-v2's footer is "Showing N ticket states · superseded rows hidden" with no page count, because that's what was shown).
4. Detail modal, opened by an eye icon per row. Build its section list to literally match a modal screenshot if one was given (ticketing-history-v2's modal was revised once after the first pass to match a follow-up screenshot exactly — section names, field order, and merged/dropped sections all mattered). If no modal screenshot exists yet, follow the same Section/InfoLine/DocumentCard shape as the sibling modules and say in your summary that it's inferred, not shown.
5. An exclude-style modal (`components/modals/exclude-*.tsx`) **only if the row actions in the screenshot show one** (transaction-history-v2 has "Exclude from payout"; ticketing-history-v2 does not — its rows only have a view icon).

State ownership: the root `-view.tsx` owns every piece of filter state (search, preset, dateBasis/period/custom dates, advancedFilters) and does the actual filtering/pagination math in a `useMemo`, then hands plain data + callbacks down to the table component. The table component and the Sheet panel are otherwise dumb/controlled.

## Code style expectations

- No comments in the code (the user has said this explicitly and repeatedly).
- `cursor-pointer` on every custom clickable element (pills, tri-state buttons, accordion headers, Select triggers/items) — shadcn `Button` already includes it, but plain `<button>`/`<span>`-as-button elements need it added explicitly. Leave shared, unrelated components alone unless the cursor issue is actually inside the module you're building.
- Run `npx tsc --noEmit -p tsconfig.json` and `npx eslint sections/transactions/<module>-v2 --no-error-on-unmatched-pattern` before considering a module done — both must be clean.
- Prefer small, focused files over one giant component; the folder structure above is the enforced way to keep that.

## What to ask the user before starting a new module

Only ask if genuinely ambiguous — most of this is now a settled convention:
- Whether the new module needs stat cards, an exclude-style action, or a detail-modal screenshot (if none was given, say you're inferring its shape from the sibling modules rather than silently guessing).
- Anything domain-specific that doesn't map cleanly onto the existing Scope/People/Money/Documents-&-settlement section shapes (e.g. Payouts & batches is likely a genuinely different screen, not a per-record filter list — don't force-fit it into this template without checking first).
