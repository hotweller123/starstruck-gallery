import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  artworks,
  formatPrice,
  getArtworkBySlug,
  getArtworksByArtist,
} from "@/data/artworks";
import { getArtist } from "@/data/artists";
import { ArtworkCard } from "@/components/site/ArtworkCard";
import { SmartImage } from "@/components/site/SmartImage";

export const Route = createFileRoute("/artworks/$slug")({
  component: ArtworkPage,
  loader: ({ params }) => {
    const artwork = getArtworkBySlug(params.slug);
    if (!artwork) throw notFound();
    return { artwork };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.artwork.title} — ${loaderData.artwork.artist} — Aethelred`
          : "Artwork — Aethelred",
      },
      {
        name: "description",
        content: loaderData?.artwork.description ?? "",
      },
    ],
  }),
});

function ArtworkPage() {
  const { artwork } = Route.useLoaderData();
  const artist = getArtist(artwork.artistSlug);
  const related = getArtworksByArtist(artwork.artistSlug)
    .filter((a) => a.slug !== artwork.slug)
    .concat(artworks.filter((a) => a.category === artwork.category))
    .filter((a, i, arr) => arr.findIndex((b) => b.slug === a.slug) === i)
    .filter((a) => a.slug !== artwork.slug)
    .slice(0, 3);

  return (
    <article>
      <div className="mx-auto max-w-7xl px-6 pt-12">
        <Link
          to="/gallery"
          className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
        >
          &larr; Back to gallery
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-16 md:py-24 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
        <div className="bg-surface">
          <SmartImage
            src={artwork.image}
            alt={`${artwork.title} by ${artwork.artist}`}
            width={artwork.width}
            height={artwork.height}
            priority
            className="block h-auto w-full"
          />
        </div>

        <aside className="flex flex-col gap-8 lg:sticky lg:top-32 lg:self-start">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-detail">
              {artwork.categoryLabel} &middot; {artwork.year}
            </p>
            <h1 className="font-display text-5xl italic leading-tight md:text-6xl">
              {artwork.title}
            </h1>
            <Link
              to="/artists/$slug"
              params={{ slug: artwork.artistSlug }}
              className="mt-4 inline-block text-base text-detail underline decoration-detail/30 underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              {artwork.artist}
            </Link>
          </div>

          <p className="text-lg leading-relaxed text-ink/80">
            {artwork.description}
          </p>

          <dl className="grid grid-cols-2 gap-px border-y border-ink/10 bg-ink/10 sm:grid-cols-4">
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Medium
              </dt>
              <dd className="mt-2 text-sm">{artwork.medium}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Dimensions
              </dt>
              <dd className="mt-2 text-sm">{artwork.dimensions}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Year
              </dt>
              <dd className="mt-2 text-sm">{artwork.year}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Price
              </dt>
              <dd className="mt-2 font-display text-xl italic text-ink">
                {formatPrice(artwork.price)}
              </dd>
            </div>
          </dl>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-detail sm:grid-cols-3">
            <li><span className="text-ink/60">Theme</span> — {artwork.theme}</li>
            <li><span className="text-ink/60">Style</span> — {artwork.style}</li>
            <li><span className="text-ink/60">Technique</span> — {artwork.technique}</li>
            <li><span className="text-ink/60">Orientation</span> — {artwork.orientation}</li>
            <li><span className="text-ink/60">Country</span> — {artwork.country}</li>
            <li><span className="text-ink/60">Palette</span> — {artwork.dominantColor}</li>
          </ul>

          <Link
            to="/contact"
            className="inline-block self-start border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
          >
            Inquire about this work
          </Link>

          {artist && (
            <div className="mt-4 flex items-center gap-4 border-t border-ink/10 pt-8">
              <img
                src={artist.portrait}
                alt={artist.name}
                width={80}
                height={80}
                loading="lazy"
                className="size-16 object-cover"
              />
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                  About the artist
                </p>
                <p className="mt-1 font-display text-xl italic">{artist.name}</p>
                <p className="text-xs text-detail">{artist.discipline}</p>
              </div>
            </div>
          )}
        </aside>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-32">
          <h2 className="mb-12 border-b border-ink/10 pb-6 font-display text-3xl italic">
            Related works
          </h2>
          <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
            {related.map((a) => (
              <ArtworkCard key={a.slug} artwork={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
