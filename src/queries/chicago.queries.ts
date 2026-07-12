// src/queries/chicago.queries.ts
// TanStack Query options for Art Institute of Chicago

import { queryOptions } from "@tanstack/react-query";
import {
  fetchChicagoArtworksByCategory,
  searchChicagoArtworksByArtist,
  fetchChicagoArtistByName,
  type ChicagoArtwork,
  type ChicagoArtist,
} from "./chicago";

export const chicagoQueries = {
  // Artworks by category (e.g. "Painting", "Photography")
  artworksByCategory: (category: string, limit = 20) =>
    queryOptions({
      queryKey: ["chicago", "artworks", category, limit],
      queryFn: () => fetchChicagoArtworksByCategory(category, limit),
      staleTime: 1000 * 60 * 10, // 10 minutes
    }),

  // Search artworks by artist name
  artworksByArtist: (artistName: string, limit = 20) =>
    queryOptions({
      queryKey: ["chicago", "artworks", "search", artistName, limit],
      queryFn: () => searchChicagoArtworksByArtist(artistName, limit),
      staleTime: 1000 * 60 * 10,
    }),

  // Single artist profile
  artist: (name: string) =>
    queryOptions({
      queryKey: ["chicago", "artist", name],
      queryFn: () => fetchChicagoArtistByName(name),
      staleTime: 1000 * 60 * 15, // Artists change less often
    }),
};

// Convenience hooks (optional but nice)
import { useQuery } from "@tanstack/react-query";

export function useChicagoArtworksByCategory(category: string, limit = 20) {
  return useQuery(chicagoQueries.artworksByCategory(category, limit));
}

export function useChicagoArtworksByArtist(artistName: string, limit = 20) {
  return useQuery(chicagoQueries.artworksByArtist(artistName, limit));
}

export function useChicagoArtist(name: string) {
  return useQuery(chicagoQueries.artist(name));
}
