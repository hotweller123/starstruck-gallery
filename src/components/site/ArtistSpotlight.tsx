import { Link } from "@tanstack/react-router";
import type { Artist } from "@/data/artists";
import { SmartImage } from "./SmartImage";

export function ArtistSpotlight({ artist }: { artist: Artist }) {
  return (
    <section className="bg-ink px-6 py-24 text-canvas md:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 md:flex-row md:gap-20">
        <div className="w-full md:w-1/2">
          <img
            src={artist.portrait}
            alt={`Portrait of ${artist.name}`}
            width={800}
            height={1000}
            loading="lazy"
            className="block aspect-[4/5] w-full object-cover outline outline-1 -outline-offset-1 outline-canvas/10"
          />
        </div>
        <div className="w-full md:w-1/2">
          <span className="mb-6 block text-[11px] uppercase tracking-[0.3em] text-clay">Featured Artist</span>
          <h2 className="font-display text-5xl italic leading-[1.05] md:text-6xl">{artist.short}</h2>
          <p className="mt-8 text-lg leading-relaxed text-canvas/70">{artist.bio}</p>
          <Link
            to="/artists/$slug"
            params={{ slug: artist.slug }}
            className="mt-10 inline-block border-b border-canvas/30 pb-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:border-clay hover:text-clay"
          >
            Read Full Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
