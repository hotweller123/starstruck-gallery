# TanStack Query Integration Guide

This document explains **exactly** how TanStack Query (`@tanstack/react-query`) was integrated into the Aethelred Gallery project, why it was needed, how the architecture was restructured, and how to use it correctly going forward.

---

## 1. Why We Integrated TanStack Query

### The Old Way (Problems)

Before the integration, data fetching was done with classic React patterns:

```tsx
// ❌ OLD ANTI-PATTERN (what we had)
const [artworks, setArtworks] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://api.artic.edu/...');
      const data = await res.json();
      setArtworks(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  fetchData();
}, []);
```

**Problems this caused:**

- Manual `loading` and `error` state in **every** component/hook
- No caching → same data fetched repeatedly
- No background refetching
- Race conditions (especially with artist name changes)
- Duplicate fetch logic across `useMetArtWork.ts`, `useChicagoArt.ts`, `useMetArtist.ts`
- Data stored in `localStorage` as a poor man's cache
- No way to invalidate or refetch data cleanly
- Hard to add real-time updates or optimistic mutations later

### The Solution: TanStack Query

TanStack Query handles:

- Loading / Error / Success states automatically
- Caching and stale-while-revalidate
- Background refetching
- Deduplication of requests
- Pagination / Infinite queries
- Query invalidation
- Devtools for debugging

---

## 2. New Project Structure

```
src/
├── queries/                    ← NEW FOLDER (all API logic lives here)
│   ├── index.ts                ← Clean exports
│   ├── keys.ts                 ← Centralized query keys (best practice)
│   ├── chicago.ts              ← Raw fetch functions (Art Institute of Chicago)
│   ├── chicago.queries.ts      ← queryOptions + ready-to-use hooks
│   ├── met.ts                  ← Raw fetch functions (The Met)
│   ├── met.queries.ts          ← queryOptions + ready-to-use hooks
│   └── README.md
│
├── hooks/
│   ├── useMetArtWork.ts        ← Now thin wrapper around useQuery
│   ├── useMetArtist.ts         ← Now uses useQuery + useInfiniteQuery
│   └── useChicagoArt.ts        ← Still works, but internally uses queries
│
├── router.tsx                  ← QueryClient created here with good defaults
└── routes/
    ├── index.tsx               ← Now uses direct hooks
    ├── gallery.tsx
    ├── artists.$slug.tsx
    └── ...
```

---

## 3. QueryClient Configuration

The `QueryClient` is created once in `src/router.tsx`:

```ts
// src/router.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes - data is fresh
      gcTime: 1000 * 60 * 30,          // 30 minutes - keep in cache
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

This is provided via `QueryClientProvider` in `__root.tsx`.

---

## 4. The Two-Layer Architecture (Important!)

We follow a clean separation:

### Layer 1: Raw Fetch Functions (`*.ts`)

These are **pure** functions. No React, no hooks.

```ts
// src/queries/chicago.ts
export async function fetchChicagoArtworksByCategory(category: string, limit = 20) {
  const res = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${category}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed');
  const data = await res.json();
  return data.data ?? [];
}
```

Same for `met.ts`.

### Layer 2: Query Definitions (`*.queries.ts`)

This is where we define **how** TanStack Query should fetch and cache the data.

```ts
// src/queries/chicago.queries.ts
import { queryOptions } from '@tanstack/react-query';
import { fetchChicagoArtworksByCategory } from './chicago';

export const chicagoQueries = {
  artworksByCategory: (category: string, limit = 20) =>
    queryOptions({
      queryKey: ['chicago', 'artworks', category, limit],
      queryFn: () => fetchChicagoArtworksByCategory(category, limit),
      staleTime: 1000 * 60 * 10,
    }),
};
```

We also export convenient hooks here:

```ts
export function useChicagoArtworksByCategory(category: string, limit = 20) {
  return useQuery(chicagoQueries.artworksByCategory(category, limit));
}
```

---

## 5. How to Fetch Data (Current Best Practices)

### Pattern 1: Use Pre-built Hooks (Recommended for most cases)

```tsx
import { useChicagoArtworksByCategory, useMetArtworks } from '@/queries';

function Gallery() {
  const met = useMetArtworks();
  const chicago = useChicagoArtworksByCategory('Painting', 20);

  if (met.isLoading || chicago.isLoading) return <Loader />;
  if (met.error) return <p>Error: {met.error.message}</p>;

  return (
    <div>
      {met.artworks.map(art => <ArtworkCard key={art.id} artwork={art} />)}
    </div>
  );
}
```

### Pattern 2: Use `queryOptions` Directly (More Control)

```tsx
import { useQuery } from '@tanstack/react-query';
import { chicagoQueries, metQueries } from '@/queries';

function ArtistDetail({ name }: { name: string }) {
  const artist = useQuery(chicagoQueries.artist(name));
  const artworks = useQuery(metQueries.artist(name));

  return <div>...</div>;
}
```

### Pattern 3: Infinite / "Load More" Queries

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { metQueries } from '@/queries';

function ArtistWorks({ artistName }: { artistName: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(metQueries.artistArtworksInfinite(artistName));

  const allArtworks = data?.pages.flat() ?? [];

  return (
    <div>
      {allArtworks.map(art => ...)}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load More
        </button>
      )}
    </div>
  );
}
```

---

## 6. Real Examples from the Project

### Home Page (`src/routes/index.tsx`)

```tsx
const metData = useMetArtworks();
const chicagoData = useChicagoArtworksByCategory("Painting", 12);

const isLoading = metData.isLoading || chicagoData.isLoading;

return (
  <>
    <ImageCarousel artworks={chicagoData.data ?? []} />
    {metData.artworks.slice(0, 6).map(a => <ArtworkCard key={a.id} artwork={a} />)}
  </>
);
```

### Artist Page (`src/routes/artists.$slug.tsx`)

```tsx
const artistQuery = useChicagoArtist(slug);
const artworksQuery = useChicagoArtworksByArtist(slug, 12);

const artist = artistQuery.data;
const artworks = artworksQuery.data ?? [];
const loading = artistQuery.isLoading || artworksQuery.isLoading;
```

### Gallery Page (`src/routes/gallery.tsx`)

```tsx
const met = useMetArtworks();
const chicago = useChicagoArtworksByCategory("Painting", 30);

const rawArtworks = met.artworks.length > 0 
  ? met.artworks 
  : (chicago.data ?? []).map(transformChicagoToArtwork);
```

---

## 7. How the Hooks Were Refactored

### Before (useMetArtworks)

```tsx
// Old: manual everything
const [artworks, setArtworks] = useState([]);
const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  async function load() {
    setIsLoading(true);
    const ids = await metApi.search(...);
    const full = await metApi.getArtworks(ids);
    setArtworks(full);
  }
  load();
}, []);
```

### After (useMetArtworks)

```tsx
// New: clean single query
export function useMetArtworks(initialQuery?: string) {
  const [currentCategory, setCurrentCategory] = useState(...);

  const artworksQuery = useQuery({
    queryKey: ["met", "full-search", currentCategory],
    queryFn: async () => {
      const searchRes = await metApi.search(currentCategory, { hasImages: true });
      const artworks = await metApi.getArtworks(searchRes.objectIDs, 40);
      return { artworks, total: searchRes.total };
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    artworks: artworksQuery.data?.artworks ?? [],
    isLoading: artworksQuery.isLoading,
    error: artworksQuery.error ? ... : null,
    search: setCurrentCategory,
  };
}
```

---

## 8. Key Rules We Follow Now

1. **Never** put `fetch()` directly in components or `useEffect`.
2. Put **raw** fetch logic in `src/queries/*.ts`.
3. Define **query configuration** in `src/queries/*.queries.ts`.
4. Always use a descriptive `queryKey`.
5. Set reasonable `staleTime` (5–15 minutes for museum APIs).
6. Use `enabled: !!value` when you need conditional queries.
7. Prefer the hooks exported from `@/queries` when possible.
8. Use `useInfiniteQuery` for pagination instead of manual `page` state.

---

## 9. Devtools

We added `@tanstack/react-query-devtools`.

It is rendered in `__root.tsx`:

```tsx
<ReactQueryDevtools initialIsOpen={false} />
```

Open it in development by clicking the small TanStack logo in the bottom corner. Extremely useful for inspecting cache, query keys, and refetching.

---

## 10. Preparing for Appwrite / Real Backend

When we replace the mock APIs with Appwrite:

1. Create `src/queries/appwrite.ts` (raw SDK calls)
2. Create `src/queries/appwrite.queries.ts`
3. Export from `index.ts`
4. Use exactly the same pattern:

```ts
export const appwriteQueries = {
  user: (id: string) => queryOptions({
    queryKey: ['appwrite', 'user', id],
    queryFn: () => account.get(),
  }),
};
```

Then:

```tsx
const { data: user } = useQuery(appwriteQueries.user(userId));
```

---

## 11. Current Status (as of latest changes)

| Area                        | Uses TanStack Query? | Recommended Hook                              |
|----------------------------|----------------------|-----------------------------------------------|
| Met Museum Artworks        | Yes                  | `useMetArtworks()`                            |
| Met Artist Works           | Yes (with infinite)  | `useMetArtist()` / `useMetArtistInfinite()`   |
| Chicago Artworks           | Yes                  | `useChicagoArtworksByCategory()`              |
| Chicago Artist             | Yes                  | `useChicagoArtist()`                          |
| `useArtworkContext()`      | Partially            | Use direct hooks instead (transitional)       |
| `useArtInstitute()`        | Internally           | Legacy wrapper – avoid for new code           |

---

## Summary

We moved from **imperative, manual data fetching** to **declarative, cached, and automatic** data fetching using TanStack Query.

### Benefits we now have:

- Much less boilerplate
- Automatic loading/error states
- Smart caching
- Background updates
- Easier to add real backend later
- Better developer experience with Devtools

All new data fetching should follow the patterns shown in `src/queries/` and the examples above.

---

**Next milestone:** When we integrate Appwrite, we will follow the exact same structure (`appwrite.ts` + `appwrite.queries.ts`).

For questions or to add new endpoints, refer to this document and the files inside `src/queries/`.