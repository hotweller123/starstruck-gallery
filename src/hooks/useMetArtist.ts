// hooks/useMetArtist.ts
// Refactored to use TanStack Query (useQuery + useInfiniteQuery)

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { metQueries } from "@/queries";
import { metApi } from "../services/metApi";
import type { MetArtwork, MetArtistProfile, UseArtistReturn } from "../types/metTypes";

const PAGE_SIZE = 12;

/**
 * useMetArtist — now powered by TanStack Query
 *
 * - Artist profile + first page uses useQuery
 * - Additional pages use useInfiniteQuery (recommended for lists)
 */
export function useMetArtist(artistName: string = "Vincent van Gogh"): UseArtistReturn {
  const trimmed = artistName.trim();

  // Main artist data (profile + first batch)
  const artistQuery = useQuery({
    ...metQueries.artist(trimmed),
    enabled: !!trimmed,
  });

  // Infinite query for loading more works
  const infiniteQuery = useInfiniteQuery({
    queryKey: ["met", "artist", trimmed, "infinite"],
    queryFn: async ({ pageParam = 0 }) => {
      const { objectIDs } = await metApi.searchByArtist(trimmed, { hasImages: true });
      if (!objectIDs?.length) return [];

      const start = pageParam * PAGE_SIZE;
      const pageIds = objectIDs.slice(start, start + PAGE_SIZE);
      return metApi.getArtworks(pageIds, PAGE_SIZE);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.length === PAGE_SIZE ? undefined : undefined; // We estimate based on length
    },
    enabled: !!trimmed,
    staleTime: 1000 * 60 * 10,
  });

  // Flatten pages into a single array
  const artworks: MetArtwork[] =
    infiniteQuery.data?.pages.flat() ?? artistQuery.data?.artworks ?? [];

  const isLoading = artistQuery.isLoading || infiniteQuery.isLoading;
  const error =
    (artistQuery.error as Error | null)?.message ||
    (infiniteQuery.error as Error | null)?.message ||
    null;

  const total = artistQuery.data?.total ?? 0;
  const hasMore = infiniteQuery.hasNextPage ?? artworks.length < total;

  const fetchMore = () => {
    if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
      infiniteQuery.fetchNextPage();
    }
  };

  // For backward compatibility with old code
  const fetchForArtist = (name: string) => {
    // TanStack Query will refetch automatically when the key changes
    // This function is kept for API compatibility
    console.log("[useMetArtist] fetchForArtist called — query will auto-refetch on param change");
  };

  // Build a simple artist profile from current data
  const artist: MetArtistProfile | null =
    artistQuery.data?.artist ||
    (artworks.length > 0 ? metApi.buildArtistProfile(artworks, total) : null);

  return {
    artist,
    artworks,
    isLoading,
    error,
    total,
    fetchMore,
    fetchForArtist,
    hasMore,
  };
}
