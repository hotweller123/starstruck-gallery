import type { Artwork } from "@/data/artworks";
import { ArtworkCard } from "./ArtworkCard";

interface Props {
  artworks: Artwork[];
}

export function MasonryGallery({ artworks }: Props) {
  if (artworks.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-detail">
        No works in this category yet.
      </p>
    );
  }

  return (
    <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
      {artworks.map((a, i) => (
        <ArtworkCard key={a.slug} artwork={a} priority={i < 3} />
      ))}
    </div>
  );
}
