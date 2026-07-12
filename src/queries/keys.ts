// src/queries/keys.ts
// Centralized query keys for TanStack Query

export const queryKeys = {
  // Chicago Art Institute
  chicago: {
    all: ["chicago"] as const,
    artworks: (category?: string) => [...queryKeys.chicago.all, "artworks", category] as const,
    artist: (name: string) => [...queryKeys.chicago.all, "artist", name] as const,
  },

  // Metropolitan Museum
  met: {
    all: ["met"] as const,
    search: (query: string) => [...queryKeys.met.all, "search", query] as const,
    artist: (name: string) => [...queryKeys.met.all, "artist", name] as const,
    artistArtworks: (name: string, page?: number) =>
      [...queryKeys.met.artist(name), "artworks", page] as const,
  },
} as const;
