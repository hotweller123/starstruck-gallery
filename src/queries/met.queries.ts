// src/queries/met.queries.ts
// TanStack Query options for The Metropolitan Museum of Art API

import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { searchMetArtworks, getMetArtworksByIds, searchMetByArtist } from "./met";
import type { MetArtwork } from "../types/metTypes";

const PAGE_SIZE = 12;

export const metQueries = {
  // Search artworks (returns IDs + total)
  search: (query: string, options?: { hasImages?: boolean; isPublicDomain?: boolean }) =>
    queryOptions({
      queryKey: ["met", "search", query, options],
      queryFn: () => searchMetArtworks(query, options),
      staleTime: 1000 * 60 * 5,
    }),

  // Full artworks by IDs
  artworksByIds: (ids: number[], limit = 20) =>
    queryOptions({
      queryKey: ["met", "artworks", ids.slice(0, limit)],
      queryFn: () => getMetArtworksByIds(ids, limit),
      staleTime: 1000 * 60 * 10,
      enabled: ids.length > 0,
    }),

  // Artist profile + artworks (first page)
  artist: (name: string) =>
    queryOptions({
      queryKey: ["met", "artist", name],
      queryFn: async () => {
        const { objectIDs, total } = await searchMetByArtist(name, { hasImages: true });
        if (!objectIDs?.length) return { artist: null, artworks: [], total: 0 };

        const artworks = await getMetArtworksByIds(objectIDs, PAGE_SIZE);
        return {
          artist: { name, totalWorks: total },
          artworks,
          total,
          allIds: objectIDs,
        };
      },
      staleTime: 1000 * 60 * 15,
    }),

  // Infinite query for paginated artist artworks
  artistArtworksInfinite: (artistName: string) =>
    infiniteQueryOptions({
      queryKey: ["met", "artist", artistName, "infinite"],
      queryFn: async ({ pageParam = 0 }) => {
        const { objectIDs } = await searchMetByArtist(artistName, { hasImages: true });
        if (!objectIDs?.length) return [];

        const start = pageParam * PAGE_SIZE;
        const pageIds = objectIDs.slice(start, start + PAGE_SIZE);
        return getMetArtworksByIds(pageIds, PAGE_SIZE);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        // We need the total from the search, but we can estimate
        // Better to store total separately or use a different pattern
        return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
      },
      staleTime: 1000 * 60 * 10,
    }),
};

// Reusable hooks
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export function useMetSearch(
  query: string,
  options?: { hasImages?: boolean; isPublicDomain?: boolean },
) {
  return useQuery(metQueries.search(query, options));
}

export function useMetArtworksByIds(ids: number[], limit = 20) {
  return useQuery(metQueries.artworksByIds(ids, limit));
}

export function useMetArtist(name: string) {
  return useQuery(metQueries.artist(name));
}

export function useMetArtistInfinite(artistName: string) {
  return useInfiniteQuery(metQueries.artistArtworksInfinite(artistName));
}
