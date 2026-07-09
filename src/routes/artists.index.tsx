import { createFileRoute, Link } from "@tanstack/react-router";
import { artists } from "@/data/artists";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/artists/")({
  component: ArtistsIndex,
  head: () => ({
    meta: [
      { title: "Artists — Aethelred" },
      {
        name: "description",
        content:
          "The five artists in the current exhibition — ceramicists, sculptors, photographers and digital practitioners.",
      },
    ],
  }),
});

function ArtistsIndex() {
  return (
    <>
      <PageHeader
        eyebrow="In this exhibition"
        title="Artists"
        description="A small circle of contemporary practitioners, working slowly and at the scale of a season."
      />
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              to="/artists/$slug"
              params={{ slug: artist.slug }}
              className="group block"
            >
              <div className="overflow-hidden bg-surface">
                <img
                  src={artist.portrait}
                  alt={`Portrait of ${artist.name}`}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="block aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
              </div>
<<<<<<< HEAD
              <h3 className="mt-5 font-display text-3xl italic">
                {artist.name}
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-detail">
                {artist.discipline} &mdash; {artist.location}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">
                {artist.short}
              </p>
=======
              <h3 className="mt-5 font-display text-3xl italic">{artist.name}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-detail">
                {artist.discipline} &mdash; {artist.location}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">{artist.short}</p>
>>>>>>> 49a1b1e (updated)
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
