import { useState, useEffect, useCallback } from "react";
import { MET_ARTWORK_SEARCH_TERMS } from "./useMetArtWork";

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

interface Category {
  name: string;
}

export interface ChicagoArtist {
  id: number;
  title: string; // Artist name
  description?: string;
  birth_date?: string;
  death_date?: string;
  [key: string]: any;
  // ... other fields like nationality, etc.
}

interface State {
  artworks: ChicagoArtwork[];
  artist: ChicagoArtist | null;
}

const state = {
  artworks: [],
  artist: null,
};

const key = "aetherel_chicago_artworks";

function load(): State {
  if (typeof document == "undefined") return state;
  try {
    const getItem = localStorage.getItem(key);
    if (!getItem) return state;
    return { ...state, ...JSON.parse(getItem) };
  } catch (error) {
    return state;
  }
}

export const RELIABLE_ARTISTS = [
  "Vincent van Gogh",
  "Henri de Toulouse-Lautrec",
  "Rembrandt van Rijn",
  // "Jean-Michel Basquiat",
  // "Andy Warhol",
  "Élisabeth Vigée Le Brun",
  // "Puvis de Chavannes",
  "Jean Auguste Dominique Ingres",
  // "Mary Cassatt",
  // "Edward Hopper",
  // "Georgia O'Keeffe",
  // "Pierre-Auguste Renoir",
] as const;

export const useArtInstitute = () => {
  const [categories] = useState<Category[]>([
    { name: "Painting" },
    { name: "Prints" },
    { name: "Photography" },
    { name: "Sculpture" },
    { name: "Drawing" },
  ]);

  const [selectedArtist, setSelectedArtist] = useState<ChicagoArtist | null>(null);
  const [artworks, setArtworks] = useState<ChicagoArtwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const { artist, artworks } = load();
    setArtworks(artworks);
    setSelectedArtist(artist);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify({ artworks, artist: selectedArtist }));
    } catch (error) {
      console.log(error);
    }
  }, [hydrated, selectedArtist, artworks]);

  // Fetch artworks by category - FIXED VERSION
  const fetchArtworksByCategory = useCallback(async (category: string, limit = 20) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
          category,
        )}&limit=${limit}&fields=id,title,artist_display,date_display,medium_display,image_id,classification_titles,thumbnail`,
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      setArtworks(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load artworks. Please try again.");
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search by artist
  const searchByArtist = useCallback(async (artistName: string, limit = 20) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
          artistName,
        )}&limit=${limit}&fields=id,title,artist_display,date_display,medium_display,image_id,classification_titles,thumbnail`,
      );
      const data = await response.json();
      setArtworks(data.data || []);
    } catch (err) {
      console.log(err);
      setError("Artist search failed");
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch artist by name (more reliable)
  const fetchArtistByName = useCallback(async (artistName: string) => {
    setLoading(true);
    setError(null);

    try {
      // Clean the name (remove dates, extra text)
      const cleanName = artistName.split("↵")[0].trim().split(",")[0].trim();

      const res = await fetch(
        `https://api.artic.edu/api/v1/artists/search?q=${encodeURIComponent(
          cleanName,
        )}&limit=5&fields=id,title,alt_titles,description,birth_date,death_date,birth_place,death_place,nationality,date_display,thumbnail`,
      );

      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setSelectedArtist(data.data[0]); // Take the best match
      } else {
        setSelectedArtist(null);
      }
    } catch (err) {
      setError("Could not load artist details");
      console.log(err);
      setSelectedArtist(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getImageUrl = (imageId?: string) => {
    if (!imageId) return "";
    return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
  };

  const randomCategory = () => {
    const index = Math.floor(Math.random() * MET_ARTWORK_SEARCH_TERMS.length);
    return MET_ARTWORK_SEARCH_TERMS[index];
  };

  // Load some default artworks on mount
  useEffect(() => {
    const rando = randomCategory();
    fetchArtworksByCategory(rando, 20);
  }, [fetchArtworksByCategory]);

  return {
    categories,
    artworks,
    loading,
    error,
    selectedArtist,
    fetchArtistByName,
    fetchArtworksByCategory,
    searchByArtist,
    getImageUrl,
  };
};
