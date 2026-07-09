// hooks/useMetArtworks.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { metApi } from "../services/metApi";
import type { MetArtwork } from "../types/metTypes";

/**
 * High-quality, varied search terms that work well with the Met Museum API.
 * These return diverse types of artworks (different mediums, cultures, subjects).
 * Pass any of these to `search()` or let the hook pick randomly for variety.
 */
export const MET_ARTWORK_SEARCH_TERMS = [
  // By subject
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

  // By medium / technique
  "sculpture",
  "photograph",
  "drawing",
  "print",
  "ceramic",
  "furniture",
  "textile",
  "armor",
  "jewelry",
  "gold",
  "silver",
  "ivory",
  "wood",
  "stone",
  "glass",
  "manuscript",
  "costume",

  // By culture / period (very different visual styles)
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

interface UseMetArtworksReturn {
  artworks: MetArtwork[];
  isLoading: boolean;
  error: string | null;
  total: number;
  search: (query: string) => void;
  /** Fetch a completely different category of artworks */
  fetchRandomCategory: () => void;
  currentCategory: string;
}

const key = "aethered_met_arkworks";

const state: MetArtwork[] = [];

function load(): MetArtwork[] {
  if (typeof document == "undefined") return [];
  try {
    const getItem = localStorage.getItem(key);
    if (!getItem) return state;

    const value = JSON.parse(getItem);
    return [...state, ...value];
  } catch (error) {
    return [...state];
  }
}

export function useMetArtworks(initialQuery?: string): UseMetArtworksReturn {
  const [artworks, setArtworks] = useState<MetArtwork[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setArtworks(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(artworks));
    } catch (error) {
      console.log(load());
    }
  }, [hydrated, artworks]);

  const search = useCallback(async (query: string): Promise<void> => {
    console.log(query);
    setIsLoading(true);
    setError(null);

    try {
      // Step 1 — get matching object IDs
      const { objectIDs, total } = await metApi.search(query, {
        hasImages: true,
        isPublicDomain: true,
      });

      if (!objectIDs || objectIDs.length === 0) {
        setArtworks([]);
        setTotal(0);
        return;
      }

      setTotal(total);

      // Step 2 — fetch details for first 20 IDs
      const data = await metApi.getArtworks(objectIDs, 100);
      setArtworks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Track current category for display / debugging
  const [currentCategory, setCurrentCategory] = useState<string>(initialQuery || "");

  // Run initial search on mount.
  // If no initialQuery is passed, we automatically pick a random term
  // from the list below so you get very different types of artworks every time.
  const hasFetched = useRef(false);

  /** Pick a random good search term and fetch completely different artworks */
  const fetchRandomCategory = useCallback(() => {
    const randomTerm = getRandomCategory();
    console.log({ randomTerm });
    setCurrentCategory(randomTerm);
    search(randomTerm);
  }, [search]);

  useEffect(() => {
    setArtworks(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(artworks));
    } catch (error) {
      console.log(load());
    }
  }, [hydrated, artworks]);

  useEffect(() => {
    if (hasFetched.current) return;

    // const startingQuery = getRandomCategory();
    // setCurrentCategory(startingQuery);
    // search(startingQuery);
    fetchRandomCategory();

    hasFetched.current = true;
  }, [initialQuery, search, fetchRandomCategory]);

  return {
    artworks,
    isLoading,
    error,
    total,
    search,
    fetchRandomCategory,
    currentCategory,
  };
}

/** Returns a random high-quality search term that usually yields good results from the Met API */
function getRandomCategory(): string {
  const index = Math.floor(Math.random() * MET_ARTWORK_SEARCH_TERMS.length);
  return MET_ARTWORK_SEARCH_TERMS[index];
}
