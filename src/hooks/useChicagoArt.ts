import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { chicagoQueries, getChicagoImageUrl } from "@/queries";
import { MET_ARTWORK_SEARCH_TERMS } from "./useMetArtWork";

import type { ChicagoArtwork, ChicagoArtist } from "@/queries/chicago";

export { type ChicagoArtwork, type ChicagoArtist } from "@/queries/chicago";

// Original localStorage key the user was using
const CHICAGO_LOCAL_STORAGE_KEY = "aetherel_chicago_artworks";

interface ChicagoPersistedState {
  artworks: ChicagoArtwork[];
  artist: ChicagoArtist | null;
}

function loadChicagoFromLocalStorage(): ChicagoPersistedState {
  if (typeof window === "undefined") return { artworks: [], artist: null };
  try {
    const raw = localStorage.getItem(CHICAGO_LOCAL_STORAGE_KEY);
    if (!raw) return { artworks: [], artist: null };
    const parsed = JSON.parse(raw);
    return {
      artworks: Array.isArray(parsed?.artworks) ? parsed.artworks : [],
      artist: parsed?.artist ?? null,
    };
  } catch {
    return { artworks: [], artist: null };
  }
}

function saveChicagoToLocalStorage(data: ChicagoPersistedState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHICAGO_LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore write errors
  }
}

export const RELIABLE_ARTISTS = [
  "Vincent van Gogh",
  "Henri de Toulouse-Lautrec",
  "Rembrandt van Rijn",
  "Élisabeth Vigée Le Brun",
  "Jean Auguste Dominique Ingres",
] as const;

interface Category {
  name: string;
}

/**
 * useArtInstitute (Legacy Compatibility Wrapper)
 *
 * ⚠️  For new code, prefer these direct hooks:
 *   import {
 *     useChicagoArtworksByCategory,
 *     useChicagoArtworksByArtist,
 *     useChicagoArtist,
 *   } from '@/queries';
 *
 * This hook is kept only for backward compatibility during migration.
 */
export const useArtInstitute = (options?: { initialCategory?: string }) => {
  const categories: Category[] = [
    { name: "Painting" },
    { name: "Prints" },
    { name: "Photography" },
    { name: "Sculpture" },
    { name: "Drawing" },
  ];

  const defaultCategory =
    options?.initialCategory ||
    MET_ARTWORK_SEARCH_TERMS[0]; // stable default for SSR hydration


  // Main artworks query (category-based)
  const artworksQuery = useQuery({
    ...chicagoQueries.artworksByCategory(defaultCategory, 20),
  });

  // Lazy artist query
  const [artistName, setArtistName] = React.useState<string | null>(null);
  const artistQuery = useQuery({
    ...chicagoQueries.artist(artistName || ""),
    enabled: !!artistName,
  });

  // Lazy search by artist
  const [searchArtist, setSearchArtist] = React.useState<string | null>(null);
  const searchQuery = useQuery({
    ...chicagoQueries.artworksByArtist(searchArtist || "", 20),
    enabled: !!searchArtist,
  });

  // Persist to localStorage when data changes (client-side only)
  React.useEffect(() => {
    const currentArtworks = searchArtist ? (searchQuery.data ?? []) : (artworksQuery.data ?? []);
    const currentArtist = artistQuery.data ?? null;

    if (currentArtworks.length > 0 || currentArtist) {
      saveChicagoToLocalStorage({
        artworks: currentArtworks,
        artist: currentArtist,
      });
    }
  }, [artworksQuery.data, artistQuery.data, searchQuery.data, searchArtist]);

  const fetchArtistByName = (name: string) => setArtistName(name);
  const searchByArtist = (name: string) => setSearchArtist(name);

  const fetchArtworksByCategory = (category: string) => {
    // For now this is a no-op in the hook. Prefer direct use of the query hooks.
    console.log(
      "[useArtInstitute] fetchArtworksByCategory — use useChicagoArtworksByCategory directly for best results",
    );
  };

  return {
    categories,
    artworks: searchArtist ? (searchQuery.data ?? []) : (artworksQuery.data ?? []),
    loading: artworksQuery.isLoading || searchQuery.isLoading || artistQuery.isLoading,
    error:
      (artworksQuery.error as Error)?.message ||
      (searchQuery.error as Error)?.message ||
      (artistQuery.error as Error)?.message ||
      null,
    selectedArtist: artistQuery.data ?? null,
    fetchArtistByName,
    fetchArtworksByCategory,
    searchByArtist,
    getImageUrl: getChicagoImageUrl,
  };
};
