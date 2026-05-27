import { Link } from "@tanstack/react-router";
import type { Artwork } from "@/data/artworks";

interface Props {
  artwork: Artwork;
  priority?: boolean;
}

export function ArtworkCard({ artwork, priority }: Props) {
  return (
    <Link
      to="/artworks/$slug"
      params={{ slug: artwork.slug }}
      className="group mb-8 block break-inside-avoid"
    >
      <div className="overflow-hidden bg-surface outline outline-1 -outline-offset-1 outline-ink/5">
        <img
          src={artwork.image}
          alt={`${artwork.title} by ${artwork.artist}`}
          width={artwork.width}
          height={artwork.height}
          loading={priority ? "eager" : "lazy"}
          className="block h-auto w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4">
        <h3 className="font-display text-2xl italic leading-tight text-ink">
          {artwork.title}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-detail">
          {artwork.artist} &nbsp;/&nbsp; {artwork.categoryLabel}
        </p>
      </div>
    </Link>
  );
}
