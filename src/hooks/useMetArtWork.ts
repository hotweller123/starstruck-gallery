// hooks/useMetArtworks.ts
// Best-practice TanStack Query implementation for Met Museum API
// with localStorage persistence (restored original implementation)

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { metApi } from "../services/metApi";
import type { MetArtwork } from "../types/metTypes";

// Original localStorage key used by the user
const LOCAL_STORAGE_KEY = "aethered_met_arkworks";

interface PersistedMetData {
  artworks: MetArtwork[];
  total: number;
  timestamp?: number;
}

function loadFromLocalStorage(): PersistedMetData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.artworks)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveToLocalStorage(data: PersistedMetData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore write errors (quota, private mode, etc.)
  }
}

/**
 * High-quality search terms for the Met API.
 */
export const MET_ARTWORK_SEARCH_TERMS = [
  "portrait",
  "landscape",
  "still life",
  "nude",
  "flowers",
  "mythology",
  "animal",
  "horse",
  "bird",
  "architecture",
  "interior",
  "cityscape",
  "seascape",
  "self portrait",
  "woman",
  "man",
  "child",
  "battle",
  "dance",
  "music",
  "religion",
  "sculpture",
  "photograph",
  "drawing",
  "print",
  "ceramic",
  "furniture",
  "egyptian",
  "greek",
  "roman",
  "chinese",
  "japanese",
  "islamic",
  "african",
  "renaissance",
  "baroque",
  "impressionist",
  "modern",
] as const;

export type MetArtworkSearchTerm = (typeof MET_ARTWORK_SEARCH_TERMS)[number];

function getRandomCategory(): string {
  return MET_ARTWORK_SEARCH_TERMS[Math.floor(Math.random() * MET_ARTWORK_SEARCH_TERMS.length)];
}

interface UseMetArtworksReturn {
  artworks: MetArtwork[];
  isLoading: boolean;
  error: string | null;
  total: number;
  search: (query: string) => void;
  fetchRandomCategory: () => void;
  currentCategory: string;
}

/**
 * useMetArtworks — Recommended pattern using TanStack Query
 *
 * Single useQuery that performs the full two-step process:
 * 1. Search for IDs
 * 2. Hydrate full artwork objects
 *
 * This is the cleanest way to use TanStack Query with this API shape.
 */
export function useMetArtworks(initialQuery?: string): UseMetArtworksReturn {
  // Use a stable default for SSR hydration safety.
  // Randomization happens only on client via fetchRandomCategory or search.
  const [currentCategory, setCurrentCategory] = React.useState(
    initialQuery || MET_ARTWORK_SEARCH_TERMS[0],
  );

  const artworksQuery = useQuery({
    queryKey: ["met", "full-search", currentCategory],
    queryFn: async () => {
      const searchRes = await metApi.search(currentCategory, {
        hasImages: true,
        isPublicDomain: true,
      });

      if (!searchRes.objectIDs?.length) {
        return { artworks: [], total: 0 };
      }

      const artworks = await metApi.getArtworks(searchRes.objectIDs, 40);

      // Save fresh results to localStorage (client-side only, for faster subsequent loads)
      saveToLocalStorage({
        artworks,
        total: searchRes.total || artworks.length,
        timestamp: Date.now(),
      });

      return {
        artworks,
        total: searchRes.total || artworks.length,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // No initialData from localStorage — that causes SSR hydration mismatches
  });

  const search = (queryStr: string) => {
    setCurrentCategory(queryStr);
  };

  const fetchRandomCategory = () => {
    const next = getRandomCategory();
    setCurrentCategory(next);
  };

  return {
    artworks: artworksQuery.data?.artworks ?? [],
    isLoading: artworksQuery.isLoading,
    error: artworksQuery.error ? (artworksQuery.error as Error).message : null,
    total: artworksQuery.data?.total ?? 0,
    search,
    fetchRandomCategory,
    currentCategory,
  };
}
