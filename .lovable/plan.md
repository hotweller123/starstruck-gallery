## Exhibition Website — Build Plan

A serene, editorial-style gallery site combining the Editorial Swiss Minimalist composition (clean nav, oversized italic display hero, masonry grid, dark featured-artist band, minimal newsletter footer) with the locked Warm Sand palette and Instrument Serif + Work Sans typography you chose earlier. Built on React (Vite + React Router), as confirmed.

### Design tokens (locked, in `index.css`)

- canvas `#faf8f5`, surface `#f0ebe3`, accent `#c9b99a`, detail `#8b7355`, ink `#3a342d`
- Heading: Instrument Serif (italic display); Body: Work Sans
- Hairline borders, generous whitespace, no rounded corners on artworks
- A single warm-clay accent (`#a8553a`) used sparingly for "Featured Artist" eyebrow and hover states

### Routes

```
/                  Home — hero, featured masonry preview, artist spotlight band, newsletter
/gallery           Full masonry of all artworks with category filter chips
/categories        Index of categories as editorial cards
/categories/:slug  Filtered masonry for one category
/artworks/:slug    Artwork detail — large image, metadata, artist link, related works
/artists           Grid of artist portraits
/artists/:slug     Artist profile — bio, portrait, works grid
/about             Editorial about page
/contact           Contact form + gallery info
*                  404
```

### Categories (curated for design coherence)

Abstract, Figurative, Minimalism, Sculpture, Photography, Digital, Mixed Media, Ceramics.

### Sections (matching the chosen direction's composition)

1. **Sticky nav** — wordmark left; Gallery / Categories / Artists / About; Contact button right
2. **Hero** — oversized italic serif headline, supporting paragraph + category chips row
3. **Masonry gallery** — 3-column varied aspect ratios, gentle hover scale, caption below
4. **Artist spotlight band** — dark ink background, portrait + bio + CTA
5. **Footer** — newsletter signup + two link columns + fine print

### Data

Static seed files `src/data/artworks.ts` (~16 works: title, slug, artist, category, aspect, image, year, medium) and `src/data/artists.ts` (~6 artists). All imagery via `data-lov-image-placeholder` → generated into `src/assets/` during build.

### Components

`Nav`, `Footer`, `Hero`, `MasonryGallery`, `ArtworkCard`, `CategoryChips`, `ArtistSpotlight`, `PageHeader`.

### Tech notes

- React + Vite + React Router
- Tailwind tokens via `@theme` in `index.css`; semantic class names only
- SEO: per-route `<title>`/meta, single H1, semantic landmarks, alt text on every artwork
- No backend in v1 (contact form is a styled stub — can be wired to Lovable Cloud later)

### Out of scope (for now)

Auth, CMS, real form submission, purchase/inquiry flow.