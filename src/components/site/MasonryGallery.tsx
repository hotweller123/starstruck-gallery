import type { Artwork } from "@/data/artworks";
import { ArtworkCard } from "./ArtworkCard";

interface Props {
  artworks: Artwork[];
}

export function MasonryGallery({ artworks }: Props) {
  // Hydration-safe: render based solely on the artworks prop.
  // Do NOT branch on client-only loading state (e.g. React Query isLoading)
  // which differs between server (no localStorage) and client.
  // Always render the same outer element structure.
  return (
    <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
      {artworks.length === 0 ? (
        <div className="py-24 text-center text-sm text-detail">No works in this category yet.</div>
      ) : (
        artworks.map((a, i) => <ArtworkCard key={a.slug} artwork={a} priority={i < 3} />)
      )}
    </div>
  );
}
