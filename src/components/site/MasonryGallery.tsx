import type { Artwork } from "@/data/artworks";
import { ArtworkCard } from "./ArtworkCard";
<<<<<<< HEAD
=======
import { useArtworkContext } from "@/lib/useMetArtworksStore";
import { Loader } from "./Loader";
>>>>>>> 49a1b1e (updated)

interface Props {
  artworks: Artwork[];
}

export function MasonryGallery({ artworks }: Props) {
<<<<<<< HEAD
  if (artworks.length === 0) {
    return (
      <p className="py-24 text-center text-sm text-detail">
        No works in this category yet.
      </p>
    );
  }

=======
  const { loadingAws } = useArtworkContext();
  if (loadingAws) {
    return (
      <div className="py-24 text-center text-sm text-detail">
        <Loader message="Loading Gallery..." size="sm" className="py-24" />
      </div>
    );
  }

  if (artworks.length === 0) {
    return <p className="py-24 text-center text-sm text-detail">No works in this category yet.</p>;
  }

>>>>>>> 49a1b1e (updated)
  return (
    <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
      {artworks.map((a, i) => (
        <ArtworkCard key={a.slug} artwork={a} priority={i < 3} />
      ))}
    </div>
  );
}
