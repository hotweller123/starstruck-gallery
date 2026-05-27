import { createFileRoute, Link } from "@tanstack/react-router";
import { artworks } from "@/data/artworks";
import { categories } from "@/data/categories";
import { getArtist } from "@/data/artists";
import { ArtworkCard } from "@/components/site/ArtworkCard";
import { ArtistSpotlight } from "@/components/site/ArtistSpotlight";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { ImageCarousel } from "@/components/site/ImageCarousel";
import { PartnerReasons } from "@/components/site/PartnerReasons";
import { Sponsors } from "@/components/site/Sponsors";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { HistoryTimeline } from "@/components/site/HistoryTimeline";

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
  const highlights = artworks.filter((a) => a.highlight).slice(0, 8);
  const newArrivals = artworks.filter((a) => a.year >= 2025).slice(0, 8);
  const featured = artworks.slice(0, 6);
  const spotlight = getArtist("elena-vos")!;

  return (
    <>
      <HeroCarousel />

      {/* Intro statement */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <p className="text-[11px] uppercase tracking-[0.3em] text-detail">
            A short word from the curator
          </p>
          <div className="space-y-6 text-xl leading-relaxed text-ink/85 md:text-2xl">
            <p>
              Aethelred is a quiet room on the internet — a curated dialogue
              between permanence and the ephemeral, between clay that takes a
              week to set and a photograph that takes six hours of held breath.
            </p>
            <p className="text-base text-detail md:text-lg">
              We hang one exhibition at a time, for one season at a time. Twelve
              artists in permanent rotation, four shows a year, no algorithm,
              no infinite scroll. Just the work, given room.
            </p>
          </div>
        </div>
      </section>

      <ImageCarousel
        artworks={highlights}
        eyebrow="The curator has chosen"
        title="Highlights of the season"
        link={{ to: "/gallery", label: "All works" }}
      />

      {/* Featured Masonry */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 flex items-end justify-between border-b border-ink/10 pb-6">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-detail">
              The exhibition, in part
            </p>
            <h2 className="font-display text-3xl italic md:text-4xl">
              Selected Works
            </h2>
          </div>
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

      <ImageCarousel
        artworks={newArrivals}
        eyebrow="Newly arrived"
        title="From the studios, this season"
      />

      {/* Categories preview */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between border-b border-ink/10 pb-6">
          <h2 className="font-display text-3xl italic md:text-4xl">
            By Mode of Design
          </h2>
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

      <ArtistSpotlight artist={spotlight} />

      <PartnerReasons />

      <Sponsors />

      <HistoryTimeline />

      <FaqAccordion />
    </>
  );
}
