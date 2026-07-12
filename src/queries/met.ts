// src/queries/met.ts
// Pure data fetchers for The Met API

import type { MetArtwork, MetSearchResponse } from "../types/metTypes";

const BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

export async function searchMetArtworks(
  query: string,
  options: { hasImages?: boolean; isPublicDomain?: boolean } = {},
): Promise<MetSearchResponse> {
  const params = new URLSearchParams({ q: query });
  if (options.hasImages) params.set("hasImages", "true");
  if (options.isPublicDomain) params.set("isPublicDomain", "true");

  const res = await fetch(`${BASE}/search?${params}`);
  if (!res.ok) throw new Error(`Met search failed: ${res.status}`);
  return res.json();
}

export async function getMetArtwork(id: number): Promise<MetArtwork> {
  const res = await fetch(`${BASE}/objects/${id}`);
  if (!res.ok) throw new Error(`Artwork ${id} not found`);
  return res.json();
}

export async function getMetArtworksByIds(ids: number[], limit = 20): Promise<MetArtwork[]> {
  const sliced = ids.slice(0, limit);
  const results = await Promise.allSettled(sliced.map((id) => getMetArtwork(id)));

  return results
    .filter(
      (r): r is PromiseFulfilledResult<MetArtwork> =>
        r.status === "fulfilled" &&
        !!r.value.primaryImageSmall &&
        !!r.value.primaryImage &&
        !!r.value.artistDisplayName &&
        !!r.value.title,
    )
    .map((r) => r.value);
}

export async function searchMetByArtist(
  artistName: string,
  options: { hasImages?: boolean; isPublicDomain?: boolean } = {},
): Promise<MetSearchResponse> {
  const params = new URLSearchParams({
    q: artistName,
    artistOrCulture: "true",
  });
  if (options.hasImages) params.set("hasImages", "true");
  if (options.isPublicDomain) params.set("isPublicDomain", "true");

  const res = await fetch(`${BASE}/search?${params}`);
  if (!res.ok) throw new Error(`Met artist search failed: ${res.status}`);
  return res.json();
}
