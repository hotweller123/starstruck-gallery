# Expansion Plan — Aethelred Exhibition Site

A substantial build that layers new content, navigation, filtering and storytelling onto the existing Editorial Swiss Minimalist foundation — without touching the locked design tokens (Warm Sand palette, Instrument Serif + Work Sans, hairline borders, no rounded corners on artworks).

## 1. Data layer expansion (`src/data/`)

Extend `Artwork` and seed more works (target ~24, up from 12):
- New fields: `price` (number, USD), `priceLabel`, `sizeCategory` ("small"|"medium"|"large"), `orientation` ("portrait"|"landscape"|"square"), `theme` (e.g. "Nature","Urban","Portrait","Still Life","Abstract Form"), `style` (e.g. "Impressionist","Minimal","Brutalist","Romantic"), `technique` (e.g. "Oil","Charcoal","Hand-thrown","Digital print"), `country`, `dominantColor` ("Warm","Cool","Neutral","Monochrome","Earth"), `highlight` (boolean — staff pick), plus existing medium/dimensions/year.
- New `src/data/sponsors.ts` — 6 sponsor entries (name, blurb, tier).
- New `src/data/partners-benefits.ts` — 4–5 "reasons to partner" entries.
- New `src/data/faqs.ts` — 6 accordion entries (about the gallery, shipping, commissions, partnerships).
- New `src/data/history.ts` — gallery origin story timeline (4 milestones).
- Reuse existing 12 generated images; cycle them across the 12 added entries (no new image gen needed to keep build fast).

## 2. New shared components (`src/components/site/`)

- `MegaNav.tsx` — replaces current `Nav`. Full-width top bar; on hover/focus of "Categories" / "Artists" / "About" it expands into a full-viewport panel containing: route columns on the left, a contextual image on the right (e.g. Artists panel shows renowned-artist names + a portrait), and a small footer strip below with contact + newsletter line. Mobile collapses to a sheet.
- `HeroCarousel.tsx` — swipeable background-image hero using existing `components/ui/carousel` (Embla). Autoplay + drag; overlay text (kicker, oversized italic headline, sub, CTAs) stays fixed above slides; subtle dark gradient for legibility.
- `ImageCarousel.tsx` — generic horizontal swipe rail (used for "Curator's picks", "New arrivals", "Sponsors").
- `FilterDrawer.tsx` — opens via "Filters" button. Uses shadcn `Sheet` (side drawer) on `md+`, `Dialog` (fullscreen) on small screens. Sections: Price range (Slider), Size, Medium, Orientation, Theme, Style, Country, Technique, Colour, Highlight (Switch). Apply / Clear actions.
- `ActiveFilterChips.tsx` — pill row above the gallery showing each selected filter with an "×" to remove.
- `Accordion` section component using existing `components/ui/accordion`.
- `Sponsors.tsx`, `PartnerReasons.tsx`, `HistoryTimeline.tsx`.
- `ArtworkCard.tsx` updated label: Title (italic), Artist, Medium · Dimensions, Price.

## 3. Filter state

Filters live as URL search params on `/gallery` using `zodValidator` + `fallback`. `ActiveFilterChips` reads from search; removing a chip navigates with that param cleared. Gallery filters `artworks` client-side. Preserves shareable URLs and back-button behaviour.

## 4. Routes

- `/` (index): new `HeroCarousel`, "Curator's picks" image carousel, existing masonry, new `PartnerReasons` band, `Sponsors` carousel, FAQ accordion, history teaser → about.
- `/gallery`: Filters button + drawer + active chips + masonry.
- `/about`: extend with `HistoryTimeline`, mission accordion, partner benefits.
- Existing routes (`/artworks/$slug`, `/artists`, `/categories`, `/contact`) updated only to show new fields (price, etc.) on artwork detail.

## 5. Out of scope

- No new image generation (cycle existing 12 + 4 portraits).
- No backend / persistence; newsletter & contact remain stubs.
- No real payment / inquiry checkout.
- No CMS.

## Technical notes

- Tailwind v4 via `@theme` in `src/styles.css` — no new tokens needed; reuse `--canvas`, `--ink`, `--detail`, `--surface`, `--clay`.
- Carousels: `embla-carousel-react` (already installed via shadcn carousel).
- Filter URL schema with `@tanstack/zod-adapter` `fallback()`; `loaderDeps` not needed since filtering is client-side.
- Mega-nav uses Radix `NavigationMenu` (already in `components/ui/navigation-menu.tsx`) for accessible hover/focus panels; mobile uses `Sheet`.
- All new copy written in the editorial voice already established.
