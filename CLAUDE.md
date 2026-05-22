# Pleis Admin Panel — Claude Context

## Project Overview

**Stack:** Next.js 15, React 19, TypeScript, Redux Toolkit (RTK Query), Tailwind CSS, shadcn/ui  
**Two user roles:** `super-admin` (routes under `/admin`) and `organizer` (routes under `/organizer`)  
**Role routing:** All API calls go through `store/utils/customFetchBaseQueryWithRoleRouting.tsx`, which automatically picks the correct base URL based on the logged-in user's role. Most RTK Query endpoints use `roleBasedRouting` instead of a hardcoded `url`.

---

## Project Structure

```
app/                  → Next.js routes (super-admin/, organizer/, etc.)
sections/             → Feature-level view components (one folder per module)
components/           → Shared/reusable UI components
  table/              → TableHeadCustom, PaginationControls, table-bar-loading
  table-filters/      → TableFilters (search + date + select filter bar)
  ui/                 → shadcn primitives + TableBodyWrapper
hooks/                → useBoolean, useTableSort (frontend sort — see note below)
store/
  Reducer/            → RTK Query API slices (one file per domain)
  utils/              → customFetchBaseQueryWithRoleRouting, tokenUtils, etc.
  apiRoutes.ts        → All API route constants
utils/                → format-time, toast, api error helpers
```

---

## How Tables Work (Standard Pattern)

Every table module follows the same 4-layer pattern:

```
<FeatureView>                  ← owns ALL state (page, limit, search, status, date, sortBy, sortOrder)
  useGetXxxQuery(params)       ← RTK Query fires on every state change
  <FeatureTable>               ← receives data + all handlers as props, renders shell + filters
    TableHeadCustom            ← renders column headers, sort icons, fires onSort(key)
    TableBodyWrapper           ← handles loading skeleton + empty state
    <FeatureTableRow>          ← renders one row, row-level dialogs/modals live here
    PaginationControls         ← prev/next/page numbers, fires onPageChange(n)
```

**Rule:** State always lives in the View component. The Table and Row components are dumb — they receive props and call callbacks.

---

## Sorting Architecture

### Backend Sorting (current — implemented)

Sorting is done server-side. The View component owns `sortBy` and `sortOrder` state and passes them to the API query.

**Sort state reset:** Whenever `sortBy`/`sortOrder` changes, `page` resets to `1`.  
**Sort also resets** when `onResetFilters` is called (alongside search/status/date).

**Cycle on column header click:** `(no sort) → asc → desc → (no sort)`  
Clicking a **different** column always starts fresh at `asc`.

#### Organization Module — Backend Sort Params

| Column Header | `sortBy` value sent to API |
|---|---|
| Name | `organizationName` |
| Organizer | `organizerName` |
| Created Date | `createdAt` |

`sortOrder` values: `"asc"` \| `"desc"` \| `""` (empty string = no sort, not sent)

The API receives these as query params: `?sortBy=organizationName&sortOrder=asc`

#### Files changed to implement backend sorting

| File | What changed |
|---|---|
| `store/Reducer/organization.tsx` | Added `sortBy` + `sortOrder` to `getOrganization` query params (conditionally included) |
| `sections/organization-view/organization-view.tsx` | Added `sortBy`/`sortOrder` state + `handleSortChange` + passes to query and table |
| `sections/organization-view/organization-type-table.tsx` | Removed `useTableSort`, remapped `sortKey` values, derived `sortConfig` from props, added `handleSort` logic |

### Frontend Sorting (legacy — do NOT use for new modules)

`hooks/useTableSort.ts` still exists and is used by older table modules. It sorts the current page's data client-side using JavaScript. **Do not use it for new modules** — it only sorts the 10 records on the current page, not the full dataset.

---

## Organization Module — Full Data Flow

### Files

```
sections/organization-view/
  organization-view.tsx          ← state owner, query caller, delete handler
  organization-type-table.tsx    ← table shell, filter sheet, sort logic
  organization-type-table-row.tsx← one row, subscription/commission dialogs
store/Reducer/organization.tsx   ← RTK Query API slice
```

### State owned by `OrganizationView`

| State | Purpose | Resets page? |
|---|---|---|
| `page` | Current page (1-based in UI, 0-based sent to API via `page - 1`) | — |
| `limit` | Records per page | yes |
| `search` | Keyword search | yes |
| `status` | `"active"` \| `"inactive"` \| `"all"` (all → sends `undefined`) | yes |
| `date` | Formatted with `formatDate()` before sending | yes |
| `sortBy` | Backend field name for sort column | yes |
| `sortOrder` | `"asc"` \| `"desc"` \| `""` | yes |

### API note — page offset

The UI uses 1-based pages. The View sends `page: page - 1` to the query. The RTK Query slice then sends `page: page + 1` to the actual API. Net effect: API always receives the correct 1-based page number.

### Role-based API endpoints

| Role | Endpoint |
|---|---|
| super-admin | `GET /admin/organizations` |
| organizer | `GET /organizer/organizations` |

---

## RTK Query Conventions

- Every API slice uses `customFetchBaseQueryWithRoleRouting()` as `baseQuery`
- Use `roleBasedRouting: { adminRoute, organizerRoute }` instead of a hardcoded `url: ''`
- `adminOnlyParams: ['paramName']` strips params before sending to organizer route
- `transformResponse` always shapes response as `{ data, meta }` for list endpoints
- Tags: invalidate on mutation, provide on query

---

## Key Shared Components

### `TableHeadCustom` (`components/table/table-head-custom.tsx`)
- Accepts `headLabel` array, `sortConfig: { key, direction }`, `onSort(key)`
- Column marked `sortable: true` gets chevron icons; uses `sortKey` field (falls back to `id`) to match against `sortConfig.key`
- Sort icon states: `ChevronsUpDown` (inactive), `ChevronUp` (asc), `ChevronDown` (desc)

### `PaginationControls` (`components/table/pagination-controls.tsx`)
- Stateless. Shows "Page X of Y | Total: Z" + numbered page buttons
- Shows max 5 page numbers with ellipsis

### `TableFilters` (`components/table-filters/`)
- Unified filter bar: search input, date picker, select dropdowns, reset button

### `TableBodyWrapper` (`components/ui/table-body-wrapper.tsx`)
- Handles loading skeleton rows and "no data" empty state automatically

---

## Completed Backend Sorting Migrations

All modules below have been fully migrated from `useTableSort` (frontend) to backend sorting. The pattern is identical across all of them.

| Module | View File | Table File | Store File | sortBy values |
|---|---|---|---|---|
| Organization | `sections/organization-view/organization-view.tsx` | `sections/organization-view/organization-type-table.tsx` | `store/Reducer/organization.tsx` | `organizationName`, `organizerName`, `createdAt` |
| Venue | `sections/venue/venue-view.tsx` | `sections/venue/venueTypeTable.tsx` | `store/Reducer/venue.tsx` | `title`, `createdAt`, `organizationName` |
| Event | `sections/event/event-list.tsx` | `sections/event/eventTable.tsx` | `store/Reducer/events.tsx` | `eventName`, `organizationName`, `venueName` |
| Highlight | `sections/highlight-view/highlight-view.tsx` | `sections/highlight-view/highlight-type-table.tsx` | `store/Reducer/highlights.tsx` | `title`, `organizationName`, `eventName`, `createdAt` |
| Reviews | `sections/reviews/reviews-view.tsx` | `sections/reviews/reviews-table.tsx` | `store/Reducer/reviews-api.tsx` | `userName` |
| Menu | `sections/menu-management-modules/menulist/menulist-view.tsx` | `sections/menu-management-modules/menulist/menulist-table.tsx` | `store/Reducer/menu-list-api.tsx` | `menuName`, `createdAt`, `organizationName`, `description` |
| Menu Items | `sections/menu-management-modules/menuItems/menuItems-view.tsx` | `sections/menu-management-modules/menuItems/menuItems-table.tsx` | `store/Reducer/menu-items-api.tsx` | `menuItemName`, `description`, `menuName`, `price` |

**Note:** Reviews and some modules have a separate `types.ts` file in their folder — `sortBy`, `sortOrder`, `onSortChange` must be added to `SamplePageProps` there too.

---

## When Starting a New Chat

To give the next Claude session full context, paste this at the start:

```
Read CLAUDE.md first, then read the files I'm about to share with you.
```

Then `@`-reference the specific files you're working on. Example:

```
@sections/organization-view/organization-view.tsx
@sections/organization-view/organization-type-table.tsx
@store/Reducer/organization.tsx
```

Claude will have the architecture, conventions, and decisions from this file automatically — you only need to share the specific files relevant to the current task.
