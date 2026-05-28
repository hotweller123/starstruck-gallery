import { Link } from "@tanstack/react-router";
import type { Artwork } from "@/data/artworks";
import { SmartImage } from "./SmartImage";
import { formatPrice } from "@/data/artworks";

interface Props {
  artwork: Artwork;
  priority?: boolean;
}

export function ArtworkCard({ artwork, priority }: Props) {
  return (
    <Link
      to="/artworks/$slug"
      params={{ slug: artwork.slug }}
      className="group mb-10 block break-inside-avoid"
    >
      <div className="overflow-hidden bg-surface outline outline-1 -outline-offset-1 outline-ink/5">
        <SmartImage
          src={artwork.image}
          alt={`${artwork.title} by ${artwork.artist}`}
          width={artwork.width}
          height={artwork.height}
          priority={priority}
          className="block h-auto w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
          {artwork.artist}
        </p>
        <h3 className="mt-1 font-display text-2xl italic leading-tight text-ink">
          {artwork.title}
        </h3>
        <p className="mt-1.5 text-xs text-detail">
          {artwork.medium}
        </p>
        <div className="mt-2 flex items-baseline justify-between border-t border-ink/10 pt-2.5">
          <span className="text-xs text-detail">{artwork.dimensions}</span>
          <span className="text-sm text-ink">{formatPrice(artwork.price)}</span>
        </div>
      </div>
    </Link>
  );
}
