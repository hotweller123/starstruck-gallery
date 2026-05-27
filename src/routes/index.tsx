import { createFileRoute, Link } from "@tanstack/react-router";
import { artworks } from "@/data/artworks";
import { categories } from "@/data/categories";
import { getArtist } from "@/data/artists";
import { ArtworkCard } from "@/components/site/ArtworkCard";
import { ArtistSpotlight } from "@/components/site/ArtistSpotlight";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Aethelred — A Curated Exhibition of Contemporary Artworks" },
      {
        name: "description",
        content:
          "Quiet, considered works from a small circle of contemporary artists. Browse the current exhibition by category, artist or medium.",
      },
    ],
  }),
});

function HomePage() {
  const featured = artworks.slice(0, 6);
  const spotlight = getArtist("elena-vos")!;
  const chips = categories.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-detail">
          Exhibition No. 12 &mdash; Spring 2026
        </p>
        <h1 className="max-w-5xl font-display text-6xl italic leading-[0.92] tracking-tight md:text-8xl lg:text-9xl">
          The Quiet Edge<br />of Form
        </h1>
        <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-lg leading-relaxed text-detail md:text-xl">
            A curated dialogue between permanence and the ephemeral &mdash;
            twelve works from a small circle of artists working in clay, linen,
            light and code.
          </p>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="rounded-full border border-ink/15 px-4 py-1.5 text-xs text-detail hover:border-ink hover:text-ink"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Masonry */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 flex items-end justify-between border-b border-ink/10 pb-6">
          <h2 className="font-display text-3xl italic">Selected Works</h2>
          <Link
            to="/gallery"
            className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
          {featured.map((a, i) => (
            <ArtworkCard key={a.slug} artwork={a} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* Artist Spotlight */}
      <ArtistSpotlight artist={spotlight} />

      {/* Categories preview */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mb-12 flex items-end justify-between border-b border-ink/10 pb-6">
          <h2 className="font-display text-3xl italic">By Mode of Design</h2>
          <Link
            to="/categories"
            className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
          >
            All categories &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              to="/categories/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col gap-3 bg-canvas p-8 transition-colors hover:bg-surface"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Category
              </span>
              <h3 className="font-display text-3xl italic">{c.label}</h3>
              <p className="text-sm leading-relaxed text-detail">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
