import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMetArtworks } from "@/hooks/useMetArtWork";
import { useArtInstitute } from "@/hooks/useChicagoArt";
import { changeMetArtWorkProps, changeChicagoToMod } from "@/data/artworks";
import type { Artwork } from "@/data/artworks";
import type { ModChicagoArtwork } from "@/routes";

interface ArtworkContextValue {
  // Met Museum artworks (transformed)
  artworks: Artwork[];
  loadingAws: boolean;
  errorAws: string | null;

  // Chicago Art Institute artworks (transformed)
  chicagoArtworks: ModChicagoArtwork[];
  loadingCA: boolean;
  errorCA: string | null;

  // Convenience methods
  refetchMet: () => void;
  refetchChicago: () => void;
}

const ArtworkContext = createContext<ArtworkContextValue | null>(null);

/**
 * ArtWorkProvider
 *
 * Provides a convenience layer over TanStack Query data.
 *
 * ⚠️  For best results in new code, use the direct hooks from `@/queries` or the specific hooks:
 *   - useMetArtworks()
 *   - useChicagoArtworksByCategory()
 *   - useMetArtist()
 */
export default function ArtWorkProvider({ children }: { children: React.ReactNode }) {
  const met = useMetArtworks();
  const chicago = useArtInstitute();

  const modMetArtwork: Artwork[] = changeMetArtWorkProps(met.artworks);
  const modChicagoArtworks: ModChicagoArtwork[] = changeChicagoToMod(chicago.artworks);

  const value: ArtworkContextValue = {
    artworks: modMetArtwork,
    loadingAws: met.isLoading,
    errorAws: met.error,

    chicagoArtworks: modChicagoArtworks,
    loadingCA: chicago.loading,
    errorCA: chicago.error,

    refetchMet: () => {
      // The underlying useQuery will handle refetching
      window.location.reload(); // fallback; better to use queryClient.invalidateQueries in future
    },
    refetchChicago: () => {
      window.location.reload();
    },
  };

  return <ArtworkContext.Provider value={value}>{children}</ArtworkContext.Provider>;
}

export const useArtworkContext = () => {
  const context = useContext(ArtworkContext);
  if (!context) throw new Error("useArtworkContext must be used inside ArtWorkProvider");
  return context;
};
