# TanStack Query Usage Guide (Best Practices)

This project uses **TanStack Query** (`@tanstack/react-query`) as the single source of truth for all external API data fetching.

## Core Principles

1. **Never use `useEffect` + `fetch` directly** for API data.
2. **Always define query options** in `src/queries/`.
3. **Use `useQuery` / `useInfiniteQuery`** for reading data.
4. **Use `useMutation`** for writes (when we add Appwrite or real backend).
5. Keep fetch logic pure (in `chicago.ts`, `met.ts`) and query configuration in `*.queries.ts`.

---

## Project Structure

```
src/queries/
├── index.ts                 # Barrel exports + ready-to-use hooks
├── keys.ts                  # Centralized query keys (recommended)
├── chicago.ts               # Raw fetch functions for Art Institute of Chicago
├── chicago.queries.ts       # queryOptions + use* hooks
├── met.ts                   # Raw fetch functions for The Met
├── met.queries.ts           # queryOptions + use* hooks
└── README.md
```

---

## Recommended Patterns

### 1. Using pre-built hooks (preferred for existing code)

```tsx
import { useChicagoArtworksByCategory, useChicagoArtist } from '@/queries';

function MyComponent() {
  const { data: artworks, isLoading } = useChicagoArtworksByCategory('Painting', 20);
  const { data: artist } = useChicagoArtist('Vincent van Gogh');

  if (isLoading) return <Loader />;
  return <div>...</div>;
}
```

### 2. Using query options directly (more flexible)

```tsx
import { useQuery } from '@tanstack/react-query';
import { chicagoQueries, metQueries } from '@/queries';

function Gallery() {
  const artworks = useQuery(chicagoQueries.artworksByCategory('Photography'));
  const artist = useQuery(metQueries.artist('Rembrandt'));

  // ...
}
```

### 3. Infinite / Paginated lists

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import { metQueries } from '@/queries';

const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  metQueries.artistArtworksInfinite(artistName)
);
```

---

## Current Data Sources

| Source     | Hook / Query                          | Status          |
|------------|---------------------------------------|-----------------|
| Chicago    | `useChicagoArtworksByCategory`        | ✅ Recommended  |
| Chicago    | `useChicagoArtist`                    | ✅ Recommended  |
| Chicago    | `useArtInstitute()` (legacy wrapper)  | ⚠️ Transitional |
| Met        | `useMetArtworks()`                    | ✅ Recommended  |
| Met        | `useMetArtist()`                      | ✅ Recommended  |
| Met        | `useMetArtistInfinite()`              | ✅ Recommended  |

---

## Best Practice Rules

- **Query keys** must be unique and descriptive.
- Set reasonable `staleTime` (5–15 min for museum data).
- Use `enabled` to control when queries run.
- For two-step APIs (search → hydrate), do both steps **inside one `queryFn`**.
- Keep raw `fetch` functions separate from React code.

---

## Adding New APIs (e.g. Appwrite later)

1. Create `src/queries/appwrite.ts` (raw SDK calls)
2. Create `src/queries/appwrite.queries.ts` (queryOptions + hooks)
3. Export from `src/queries/index.ts`
4. Use `useQuery` / `useMutation` everywhere.

Example:

```ts
// appwrite.queries.ts
export const appwriteQueries = {
  artworks: () => queryOptions({
    queryKey: ['appwrite', 'artworks'],
    queryFn: () => databases.listDocuments(...),
  }),
};
```

---

## Current Defaults (in router.tsx)

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})
```

---

Follow these patterns and the project will stay maintainable when we add real backend (Appwrite), realtime, or mutations.
