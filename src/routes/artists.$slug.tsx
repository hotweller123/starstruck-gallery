import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArtist } from "@/data/artists";
import { getArtworksByArtist } from "@/data/artworks";
import { ArtworkCard } from "@/components/site/ArtworkCard";

export const Route = createFileRoute("/artists/$slug")({
  component: ArtistPage,
  loader: ({ params }) => {
    const artist = getArtist(params.slug);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.artist.name ?? "Artist"} — Aethelred` },
      { name: "description", content: loaderData?.artist.short ?? "" },
    ],
  }),
});

function ArtistPage() {
  const { artist } = Route.useLoaderData();
  const works = getArtworksByArtist(artist.slug);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <Link
          to="/artists"
          className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
        >
          &larr; All artists
        </Link>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-16 md:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div className="bg-surface">
          <img
            src={artist.portrait}
            alt={`Portrait of ${artist.name}`}
            width={800}
            height={1000}
            className="block aspect-[4/5] w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-8 lg:pt-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-detail">
            {artist.discipline} &middot; {artist.location}
          </p>
          <h1 className="font-display text-6xl italic leading-[0.95] md:text-7xl">
            {artist.name}
          </h1>
          <p className="font-display text-2xl italic text-ink/80">
            {artist.short}
          </p>
          <p className="text-lg leading-relaxed text-ink/75">{artist.bio}</p>
          <Link
            to="/contact"
            className="inline-block self-start border-b border-ink pb-1 text-[11px] uppercase tracking-[0.22em] hover:text-clay hover:border-clay"
          >
            Inquire about this artist
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <h2 className="mb-12 border-b border-ink/10 pb-6 font-display text-3xl italic">
          Works in the exhibition
        </h2>
        <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
          {works.map((a) => (
            <ArtworkCard key={a.slug} artwork={a} />
          ))}
        </div>
      </section>
    </>
  );
}
