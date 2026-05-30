## Admin Dashboard — Build Plan

A standalone control center at `/admin`, visually distinct from both the exhibition site and the wallet. Classic, structured, data-dense but elegant.

### Visual identity (its own system)
- Palette: deep navy canvas `#1a2540`, surface `#2a3654`, hairline `#e8edf3/12`, accent yellow `#f5d76e`, plus semantic green/red for deltas. No gradients.
- Typography: condensed display (e.g. Archivo) for KPI numbers + headings, neutral sans (Inter) for body, JetBrains Mono for IDs, amounts, timestamps.
- Shape language: tight 14–16px radii (not the wallet's pillowy 2rem), 1px hairlines, generous whitespace inside cards, micro-uppercase labels with wide tracking.
- Tokens live in `src/styles.css` under a scoped `.admin-theme` class so they never bleed into the wallet or main site.

### Layout shell
- `src/routes/admin.tsx` — layout route with `<Outlet />`, mounts `.admin-theme`.
- `AdminShell` = fixed collapsible left sidebar (icon + label, active-state pill) + sticky topbar (global search, env badge "Mock data", date range, admin avatar) + main scroll area.
- Mobile: sidebar becomes a slide-over Sheet; topbar collapses to hamburger.

### Routes (mock data only, no auth)
```
/admin                  Overview (bento)
/admin/exhibition       Artworks · Artists · Auctions · Categories tabs
/admin/wallet           Accounts · Transactions · Deposits · Withdrawals tabs
/admin/users            Users table + role manager (admin / moderator / user)
/admin/content          Hero slides · FAQs · Sponsors · Footer copy
/admin/analytics        Charts: traffic, revenue, GMV, top artworks
/admin/settings         Platform toggles, fee config, maintenance mode
```

### Overview page (bento grid)
A 12-column responsive grid mixing tile sizes:
- Hero KPI row (4 large tiles): Platform Revenue, Wallet Volume 24h, Active Auctions, New Users — each with sparkline + delta chip.
- Wide chart tile (col-span-8): 30-day revenue area chart (recharts).
- Side stack (col-span-4): Live activity feed (latest deposits/bids/signups), auto-updating ticker.
- Mid row: Top Artworks leaderboard · Recent Withdrawals queue · Pending KYC.
- Footer row: System health pills (API, DB, Jobs, Webhooks) + storage usage bar.

### Modules
- **Exhibition**: sortable/filterable table of artworks (thumbnail, title, artist, category, price, status), row actions (feature, hide, delete-mock). Tabs swap to Artists/Auctions/Categories with the same table primitive. "New" button opens a Sheet with a styled form.
- **Wallet**: accounts table with balance, status, last activity; transactions table with type chips (deposit/withdraw/transfer/purchase), status, amount, search + status filters; "Approve/Reject" buttons on pending withdrawals (mock state).
- **Users & roles**: user list with avatar, email, role badge, joined date, last seen; inline role switcher (admin/moderator/user) writing to a mock store; bulk select.
- **Content**: card grid of editable site sections (hero slides, FAQs, sponsors) with drag handles (visual only) and edit Sheets.
- **Analytics**: recharts area/bar/donut combo on a tabbed view (Traffic / Revenue / Engagement) with date-range presets.

### Reusable primitives (new, admin-only)
`src/components/admin/`:
- `AdminShell.tsx` (sidebar + topbar + outlet)
- `AdminSidebar.tsx`
- `AdminTopbar.tsx`
- `KpiTile.tsx` (label, value, delta, sparkline)
- `BentoCard.tsx` (titled card with optional action slot)
- `DataTable.tsx` (sortable headers, row selection, empty/loading states)
- `StatusChip.tsx` (semantic colored pill)
- `ActivityFeed.tsx`
- `SectionHeader.tsx`

### Mock data
`src/data/admin-mock.ts` — exports deterministic arrays for users, transactions, KPIs, activity events, time-series. Reuses existing `data/artworks.ts`, `artists.ts`, `auctions.ts` for exhibition tables.

### Motion
Subtle: `framer-motion` fade/slide-up on route mount, staggered bento tile entrance, hover lift on cards. No flashy effects — keep it classic.

### Files to create
- `src/routes/admin.tsx`, `admin.index.tsx`, `admin.exhibition.tsx`, `admin.wallet.tsx`, `admin.users.tsx`, `admin.content.tsx`, `admin.analytics.tsx`, `admin.settings.tsx`
- `src/components/admin/*` (list above)
- `src/data/admin-mock.ts`
- Append `.admin-theme` token block to `src/styles.css`
- Add an "Admin" entry to the main nav (or a discreet footer link) so the route is reachable

### Out of scope (this build)
- Real auth / role enforcement (mock only — wired later when Lovable Cloud is enabled)
- Persisting edits (all writes are in-memory)
- Email/notification dispatch
