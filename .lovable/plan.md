# Wallet + Exhibition Site Integration

A self-contained wallet experience that lives inside the same app, with its own auth, balance, and transaction ledger. The exhibition site reads a connected wallet token to gate bidding, checkout, selling, profile, and favourites.

All data is local (localStorage). No real money moves.

## 1. Wallet data model (`src/lib/wallet.tsx`)

New `WalletProvider` context, persisted under `aethelred.wallet.v1`:

- `accounts`: `{ id, email, name, passwordHash, token, balance, createdAt }[]`
  - `passwordHash` = simple SHA-256 of password (demo only; clearly labelled)
  - `token` = generated wallet key shown to the user (format `AET-XXXX-XXXX-XXXX`)
- `currentAccountId`: id of signed-in wallet account, or null
- `transactions`: `{ id, accountId, type, amount, balanceAfter, note, counterparty?, createdAt }[]`
  - `type`: `deposit | withdraw | transfer_out | transfer_in | purchase | bid_hold | bid_release | sale`

API: `register`, `signIn`, `signOut`, `deposit`, `withdraw`, `transfer(toToken, amount, note)`, `debit(amount, note)` (used by the site), `credit`, `getTxs()`, `revealToken()`, `regenerateToken()`.

## 2. Wallet UI (new routes)

Distinct visual identity from the gallery (gallery = cream/ink/clay editorial). Wallet uses a dark, deep-emerald + brass palette with a card/banking feel — added as a scoped `.wallet-theme` class with its own tokens in `src/styles.css` (does not change site tokens).

Routes:

- `/wallet` — landing
  - If signed out → split-screen hero with Register / Sign in tabs
  - If signed in → dashboard:
    - Big balance card (gradient, subtle grain, animated counter)
    - Quick actions: Deposit, Withdraw, Transfer, Reveal token
    - Recent activity (last 8 txs with icons + signed amounts)
    - Stat tiles: total deposited, total withdrawn, total spent on site
- `/wallet/activity` — full paginated transaction log with filters (type, date)
- `/wallet/send` — transfer form (recipient token + amount + note)
- `/wallet/deposit` — mock card form, instant credit
- `/wallet/withdraw` — amount + mock bank field, instant debit
- `/wallet/security` — view/regenerate token, sign out, "danger zone" wipe account

Layout: pathless `_wallet.tsx` layout route wraps all `/wallet/*` pages, applies dark theme, sidebar nav, and a top bar with balance + user chip.

## 3. Site ↔ wallet connection

- New page `/connect` on the main site:
  - Input for wallet token (`AET-XXXX-XXXX-XXXX`)
  - On submit: look up `accounts` by token in localStorage → set `connectedWalletId` in store
  - Helper link "I don't have a wallet → /wallet"
- New piece of state in `src/lib/store.tsx`: `connectedWalletId`, `connectWallet(token)`, `disconnectWallet()`, `requireWallet()` helper.
- `MegaNav` adds a Wallet icon:
  - Disconnected → links to `/connect`, shows red dot
  - Connected → shows balance pill (e.g. `€1,240`) + dropdown with Disconnect / Open wallet

## 4. Gating site actions

A small `<WalletGate>` wrapper component used on:

- `auctions.$slug.tsx` bid button — must be connected; "Place bid" debits via `bid_hold` tx (simulated escrow; refunded on outbid via `bid_release`)
- `cart.tsx` checkout — debits wallet for total; fails with toast if insufficient funds; on success writes `purchase` tx and clears cart
- `sell.tsx` — entire page wrapped; shows "Connect your wallet to list a work" CTA
- `profile.tsx`, `favourites.tsx`, `bids.tsx` — wrapped; favourites/profile show a soft prompt rather than 404

When gated, the gate renders a centered card: "Connect your Aethelred Wallet" → button to `/connect`.

## 5. Nav & route registration

- Add wallet + connect entries to `MegaNav` (desktop dropdown under "Account", mobile drawer).
- Add new route files; route tree auto-regenerates.
- No changes to existing gallery design tokens.

## 6. Security note shown in UI

A persistent banner on `/wallet/security` clarifies this is a **simulated wallet for demo purposes**, all data lives in the browser, and password hashing is not production-grade.

## Technical details

**Files to create**
- `src/lib/wallet.tsx` — context, persistence, all wallet ops
- `src/lib/crypto-lite.ts` — SHA-256 (Web Crypto) + token generator
- `src/components/wallet/WalletShell.tsx` — sidebar + topbar layout
- `src/components/wallet/BalanceCard.tsx`
- `src/components/wallet/TxRow.tsx`
- `src/components/wallet/AuthForms.tsx` (register + sign in tabs)
- `src/components/site/WalletGate.tsx`
- `src/routes/_wallet.tsx` (pathless layout, applies dark theme)
- `src/routes/_wallet/wallet.tsx` (dashboard) plus `wallet.activity.tsx`, `wallet.send.tsx`, `wallet.deposit.tsx`, `wallet.withdraw.tsx`, `wallet.security.tsx`
- `src/routes/connect.tsx`

**Files to edit**
- `src/styles.css` — add scoped `.wallet-theme` tokens (deep emerald `oklch`, brass accent, near-black surface)
- `src/routes/__root.tsx` — wrap with `WalletProvider` (inside `StoreProvider`)
- `src/lib/store.tsx` — add `connectedWalletId` + connect/disconnect/requireWallet
- `src/components/site/MegaNav.tsx` — add Wallet icon with balance pill
- `src/routes/auctions.$slug.tsx` — wire bid → `bid_hold`
- `src/routes/cart.tsx` — wire checkout → `purchase` debit
- `src/routes/sell.tsx`, `profile.tsx`, `favourites.tsx`, `bids.tsx` — wrap in `WalletGate`

**Design tokens for wallet (scoped, oklch)**
- `--w-bg`: very dark blue-green
- `--w-surface`: slightly lifted
- `--w-primary`: emerald
- `--w-accent`: brass/gold for balances & CTAs
- `--w-danger`: muted red for withdraw/danger zone
- `--w-grad-balance`: emerald → teal radial for the hero balance card

No backend changes, no new dependencies.
