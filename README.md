# Aethelred Gallery

A modern, exhibition-grade digital art platform built with React 19, TanStack Router, and TanStack Query. Aethelred enables collectors to browse curated artworks, participate in live auctions, manage a digital wallet, and connect with artists in a refined, immersive experience.

## Introduction

Aethelred is a fictional contemporary art gallery platform designed for the "Exhibition No. 12 – Spring 2026" experience. It combines elegant design with functional commerce features:

- High-quality artwork browsing and detail views
- Artist profiles powered by the Art Institute of Chicago API
- Live auctions with countdown timers and bidding
- A simulated "EmberPay" wallet for deposits, transfers, withdrawals, and purchases
- Favorites, cart, and profile systems
- Admin tooling for exhibition management and wallet operations

The project currently runs as a full-featured frontend with a TanStack Start backend adapter, deployed on Render.

## Current State of the Project

### Technology Stack

- **Frontend**: React 19, TypeScript, Vite, TanStack Router, TanStack Query
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Animations**: `motion` (motion/react) for smooth transitions
- **Data**: Fetched via **TanStack Query** from Art Institute of Chicago + The Met (see [TANSTACK_QUERY_INTEGRATION.md](./TANSTACK_QUERY_INTEGRATION.md))
- **Wallet**: Fully client-side demo using `localStorage` (`src/lib/wallet.tsx`)
- **UI Components**: Custom toast system, wallet forms, admin primitives, and reusable gallery components

### What Works Today

- Smooth navigation across gallery, artists, auctions, wallet, and admin sections
- Wallet operations (deposit, withdraw, transfer) with transaction history
- Bidding and purchase flows (simulated)
- Responsive design with mobile navigation
- Positionable toast notifications
- Admin console with mock data tables and operations

### Current Limitations

- All user data, wallets, and transactions live only in the browser (`localStorage`)
- No real authentication or user accounts
- No persistent storage for artworks, bids, or user profiles
- Images are static imports or external URLs (no CDN or upload system)
- Admin tools are purely mock
- No email, notifications, or real-time features
- Deployment requires a custom Node adapter (`render-server.js`) because TanStack Start outputs a fetch handler

The platform is visually polished and functionally rich for a demo, but it is not yet production-ready.

## Data Fetching with TanStack Query

All data from external APIs (Art Institute of Chicago + The Met) is fetched using **TanStack Query**.

**Recommended hooks (best practice):**

```tsx
import { useMetArtworks, useChicagoArtworksByCategory, useChicagoArtist } from "@/queries";

// Met Museum
const met = useMetArtworks();

// Chicago Art Institute
const artworks = useChicagoArtworksByCategory("Painting", 20);
const artist = useChicagoArtist("Vincent van Gogh");
```

Full architecture, examples, and migration details: **[TANSTACK_QUERY_INTEGRATION.md](./TANSTACK_QUERY_INTEGRATION.md)**

## The Need for Integrating Appwrite

The biggest gap in the current architecture is the lack of a backend. Everything critical — user identity, wallet balances, bids, purchases, and artwork metadata — is ephemeral.

**Appwrite** (self-hosted or Appwrite Cloud) solves this cleanly:

- **Authentication**: Email/password, magic URLs, OAuth (Google, GitHub). Replaces the fake login in the wallet system.
- **Database**: Store users, artworks, bids, transactions, and collections with proper schemas and permissions.
- **Storage**: Upload and serve high-resolution artwork images, artist portraits, and documents with built-in CDN and image transformations.
- **Functions**: Serverless logic for bid validation, escrow releases, or purchase confirmations.
- **Realtime**: Subscribe to live bid updates and auction status changes.

Integrating Appwrite would allow the EmberPay wallet to become a real, persistent user balance, enable secure bidding across sessions, and turn the admin panel into a genuine content management system.

## Suggested Email Provider

**Resend** is the recommended choice.

- Modern developer experience with excellent TypeScript support
- Generous free tier (3,000 emails/month)
- Built-in templates and React Email support
- Reliable deliverability and analytics

Use Resend for:

- Welcome emails after registration
- Bid won / outbid notifications
- Purchase receipts and shipping updates
- Wallet top-up confirmations

Alternative: SendGrid or Mailgun if you need more advanced deliverability features.

## Suggested Live Chat Service

**Crisp** is ideal for this type of refined gallery experience.

- Clean, minimal interface that matches the aesthetic
- Supports proactive messages ("Need help with this lot?")
- Team inbox and canned responses
- Easy embedding via script or React component

Other strong options:

- **Tidio** – lightweight and quick to set up
- **Chatwoot** – open-source and self-hostable
- **Intercom** – if you want a full customer success platform later

## Suggested Mail Service (Newsletters & Marketing)

For collecting collector emails and sending exhibition announcements, use **Mailchimp** or **Buttondown**.

- **Buttondown** is excellent if you want a simple, developer-friendly newsletter without bloat
- **Mailchimp** offers stronger segmentation and automation if you plan to grow

Keep transactional emails (Resend) separate from marketing emails (Mailchimp/Buttondown) for better deliverability.

## Suggested Package for Managing Sessions

Since we are moving to Appwrite, the recommended approach is:

1. Use the official **Appwrite Web SDK** (`appwrite`)
2. Wrap session state with **TanStack Query** for caching and optimistic updates
3. Store the Appwrite session token in an `httpOnly` cookie (via a small API route) or use Appwrite's built-in session cookie handling

### Optional Complementary Packages

- `better-auth` – if you later want to move away from Appwrite for auth
- `lucia-auth` (legacy) or modern alternatives for custom session management
- `js-cookie` + `zod` for lightweight client-side validation of session data

For protected routes in TanStack Router, you will primarily rely on Appwrite's `account.get()` call + route `beforeLoad` guards.

## Creating a Middleware File for Route Navigation

TanStack Router supports powerful route-level guards through the `beforeLoad` option and custom middleware.

### Recommended Structure

Create a file: `src/lib/routeGuards.ts`

```ts
import { redirect } from "@tanstack/react-router";
import { account } from "@/lib/appwrite"; // your Appwrite client

export const requireAuth = async () => {
  try {
    const user = await account.get();
    return { user };
  } catch {
    throw redirect({ to: "/connect" });
  }
};

export const requireAdmin = async () => {
  const { user } = await requireAuth();
  if (user.labels?.includes("admin")) return { user };
  throw redirect({ to: "/wallet" });
};
```

### Usage in Routes

```ts
// src/routes/wallet.tsx
export const Route = createFileRoute("/wallet")({
  beforeLoad: requireAuth,
  component: WalletDashboard,
});
```

This pattern keeps authentication logic centralized and works beautifully with Appwrite sessions.

## Achieving Smooth Page Transitions

The project already uses `motion` (motion/react). To achieve polished transitions:

1. **Wrap route content** with `motion.div` and animate `opacity` + `y`.
2. Use TanStack Router's `useRouterState` to detect route changes.
3. Leverage `AnimatePresence` for exit animations (especially between gallery ↔ detail views).

Example pattern:

```tsx
import { motion, AnimatePresence } from "motion/react";
import { useRouterState } from "@tanstack/react-router";

function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

For shared element transitions (e.g., artwork image from grid to detail), use `motion` `layoutId` on matching elements.

## Suggested Additional Improvements

### Backend & Data

- Migrate all wallet logic, bids, and user data to Appwrite Database + Storage
- Implement Appwrite Realtime for live bidding
- Add proper image optimization pipeline (Appwrite + Thumbor or Cloudinary)

### Features

- Real payment integration (Stripe) for wallet deposits
- Email verification and password reset flows
- Role-based access control (collector vs admin vs artist)
- Advanced search + filters with server-side pagination
- Wishlist sharing and exhibition "rooms"

### Quality & Operations

- Add Vitest + React Testing Library
- Set up proper error boundaries and a global error page
- Implement rate limiting and bid validation on the server
- Add analytics (Plausible or PostHog)
- Improve accessibility (ARIA labels, keyboard navigation, focus management)
- Add a proper design system storybook

### DevEx & Deployment

- Dockerize the app for more reliable Render deploys
- Add preview deployments on pull requests
- Set up environment variable validation (using `zod`)
- Create a seed script for Appwrite collections

### Business / Exhibition Polish

- Exhibition catalogue PDF generation
- Artist application form with file uploads
- Collector CRM notes in the admin panel
- "In-person viewing" appointment booking

## Conclusion

Aethelred is already a visually sophisticated and feature-rich demonstration of a modern digital gallery. However, its current reliance on client-side storage and mock data limits it to a portfolio or prototype level.

The most impactful next step is integrating **Appwrite** to provide real authentication, persistent data, and file storage. Pairing this with **Resend** for emails, **Crisp** for support, and a thoughtful middleware + animation strategy will transform the project into a production-capable platform.

With these foundations in place, the gallery can evolve from a beautiful demo into a genuine online exhibition experience that collectors can trust and return to.

---

**Next milestone**: Replace the localStorage wallet with Appwrite-backed accounts and balances.

Ready to begin the integration? Start by creating an Appwrite project and setting up the authentication routes.
