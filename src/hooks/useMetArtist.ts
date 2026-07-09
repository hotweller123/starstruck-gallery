// hooks/useMetArtist.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { metApi } from "../services/metApi";
import type { MetArtwork, MetArtistProfile, UseArtistReturn } from "../types/metTypes";
import { changeMetArtWorkProps } from "@/data/artworks";

const PAGE_SIZE = 12;

export function useMetArtist(artistName: string = "Vincent van Gogh"): UseArtistReturn {
  const [artist, setArtist] = useState<MetArtistProfile | null>(null);
  const [artworks, setArtworks] = useState<MetArtwork[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  // Stable refs (never cause re-renders)
  const allIdsRef = useRef<number[]>([]);
  const pageRef = useRef<number>(0);
  const currentArtistRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasMore = artworks.length < total;

  // IMPORTANT: Use refs to read latest loading/hasMore inside callbacks
  // without putting state in the dependency array of useCallback.
  // This prevents fetchMore from getting a new identity on every render,
  // which was causing the "Maximum update depth exceeded" error.
  const isLoadingRef = useRef(isLoading);
  const hasMoreRef = useRef(hasMore);
  isLoadingRef.current = isLoading;
  hasMoreRef.current = hasMore;

  /**
   * Fetch a batch of artworks for the *current* artist.
   * This function does not close over state; it receives ids directly.
   */
  const fetchArtworksBatch = useCallback(async (ids: number[]): Promise<MetArtwork[]> => {
    if (!ids.length) return [];
    return metApi.getArtworks(ids, PAGE_SIZE);
  }, []);

  /**
   * Core function that fetches data **only** for the given artistName.
   * - Uses artistOrCulture=true in the API
   * - Stores IDs in a ref for safe pagination
   * - Guards against race conditions when artistName changes rapidly
   */
  const fetchForArtist = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      // Cancel any previous request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Reset for this specific artist
      currentArtistRef.current = trimmed;
      setIsLoading(true);
      setError(null);
      setArtworks([]);
      setArtist(null);
      setTotal(0);
      pageRef.current = 0;
      allIdsRef.current = [];

      try {
        // 1. Search is strictly filtered to this artist
        const { objectIDs, total: foundTotal } = await metApi.searchByArtist(trimmed, {
          hasImages: true,
        });

        if (controller.signal.aborted || currentArtistRef.current !== trimmed) {
          return;
        }

        if (!objectIDs?.length) {
          setTotal(0);
          setError(`No artworks found for "${trimmed}"`);
          return;
        }

        setTotal(foundTotal);
        allIdsRef.current = objectIDs;

        // 2. Load first page (only this artist's works)
        const firstIds = objectIDs.slice(0, PAGE_SIZE);
        pageRef.current = 1;

        const firstBatch = await fetchArtworksBatch(firstIds);

        if (controller.signal.aborted || currentArtistRef.current !== trimmed) {
          return;
        }

        setArtworks(firstBatch);

        if (firstBatch.length > 0) {
          const profile = metApi.buildArtistProfile(firstBatch, foundTotal);
          setArtist(profile);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to fetch artist");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [fetchArtworksBatch],
  );

  /** Load next page — always for the current artist in the ref */
  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    const artistAtCallTime = currentArtistRef.current;
    if (!artistAtCallTime) return;

    setIsLoading(true);

    try {
      const start = pageRef.current * PAGE_SIZE;
      const nextIds = allIdsRef.current.slice(start, start + PAGE_SIZE);

      if (!nextIds.length) return;

      pageRef.current += 1;
      const nextBatch = await fetchArtworksBatch(nextIds);

      // Ensure we are still on the same artist
      if (currentArtistRef.current !== artistAtCallTime) return;

      setArtworks((prev) => [...prev, ...nextBatch]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, fetchArtworksBatch]);

  // Fetch when artistName changes. This is the only place artist data is loaded.
  useEffect(() => {
    fetchForArtist(artistName);

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [artistName, fetchForArtist]);

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
