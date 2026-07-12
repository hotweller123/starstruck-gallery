// src/queries/chicago.ts
// Pure fetch functions for Art Institute of Chicago API

export interface ChicagoArtwork {
  id: number;
  title: string;
  artist_display: string;
  date_display?: string;
  medium_display?: string;
  image_id?: string;
  classification_titles: string[];
  thumbnail?: { lqip: string; height: number; width: number };
}

export interface ChicagoArtist {
  id: number;
  title: string;
  description?: string;
  birth_date?: string;
  death_date?: string;
  nationality?: string;
  [key: string]: any;
}

const BASE = "https://api.artic.edu/api/v1";

export async function fetchChicagoArtworksByCategory(
  category: string,
  limit = 20,
): Promise<ChicagoArtwork[]> {
  const res = await fetch(
    `${BASE}/artworks/search?q=${encodeURIComponent(category)}&limit=${limit}&fields=id,title,artist_display,date_display,medium_display,image_id,classification_titles,thumbnail`,
  );
  if (!res.ok) throw new Error("Failed to fetch Chicago artworks");
  const data = await res.json();
  return data.data ?? [];
}

export async function searchChicagoArtworksByArtist(
  artistName: string,
  limit = 20,
): Promise<ChicagoArtwork[]> {
  const res = await fetch(
    `${BASE}/artworks/search?q=${encodeURIComponent(artistName)}&limit=${limit}&fields=id,title,artist_display,date_display,medium_display,image_id,classification_titles,thumbnail`,
  );
  if (!res.ok) throw new Error("Failed to search Chicago artworks");
  const data = await res.json();
  return data.data ?? [];
}

export async function fetchChicagoArtistByName(name: string): Promise<ChicagoArtist | null> {
  const cleanName = name.split("↵")[0].trim().split(",")[0].trim();

  const res = await fetch(
    `${BASE}/artists/search?q=${encodeURIComponent(cleanName)}&limit=5&fields=id,title,alt_titles,description,birth_date,death_date,birth_place,death_place,nationality,date_display,thumbnail`,
  );
  if (!res.ok) throw new Error("Failed to fetch Chicago artist");

  const data = await res.json();
  return data.data?.[0] ?? null;
}

export function getChicagoImageUrl(imageId?: string): string {
  if (!imageId) return "";
  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
}
