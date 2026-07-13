// src/queries/index.ts
// Barrel export for all query-related utilities

// Query keys
export * from "./keys";

// Raw fetch functions (useful for mutations or custom logic)
export * from "./chicago";
export * from "./met";
export * from "./firebaseApi";

// TanStack Query options + ready-to-use hooks
export {
  chicagoQueries,
  useChicagoArtworksByCategory,
  useChicagoArtworksByArtist,
  useChicagoArtist,
} from "./chicago.queries";

export {
  metQueries,
  useMetSearch,
  useMetArtworksByIds,
  useMetArtist,
  useMetArtistInfinite,
} from "./met.queries";
