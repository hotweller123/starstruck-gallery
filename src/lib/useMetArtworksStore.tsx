import { Artist } from "@/data/artists";
import {
  Artwork,
  CategorySlug,
  changeChicagoToMod,
  changeMetArtWorkProps,
  DominantColor,
  Orientation,
  orientationFrom,
  SizeCategory,
} from "@/data/artworks";
import { useMetArtist } from "@/hooks/useMetArtist";
import { useMetArtworks } from "@/hooks/useMetArtWork";
import React, { createContext, useContext } from "react";
import { EMPTY_TEXT } from "./emptyState";
import { useArtInstitute } from "@/hooks/useChicagoArt";
import { ModChicagoArtwork } from "@/routes";

interface MetApi {
  artworks: Artwork[];
  loadingAws: boolean;

  chicagoArtworks: ModChicagoArtwork[];
  loadingCA: boolean;
}

const ArtworkContext = createContext<MetApi | null>(null);

export default function ArtWorkProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, error, artworks, total, search, fetchRandomCategory } = useMetArtworks();
  const { fetchForArtist, artworks: artistArtworks } = useMetArtist();
  const { artworks: ChicagoArtworks, fetchArtistByName, getImageUrl, loading } = useArtInstitute();

  const modMetArtwork: Artwork[] = changeMetArtWorkProps(artworks);

  const modChicagoArtworks: ModChicagoArtwork[] = changeChicagoToMod(ChicagoArtworks);

  return (
    <ArtworkContext.Provider
      value={{
        artworks: modMetArtwork,
        chicagoArtworks: modChicagoArtworks,
        loadingAws: isLoading,
        loadingCA: loading,
      }}
    >
      {children}
    </ArtworkContext.Provider>
  );
}

export const useArtworkContext = () => {
  const context = useContext(ArtworkContext);
  if (!context) throw new Error("Context Not Initialized");
  return context;
};
