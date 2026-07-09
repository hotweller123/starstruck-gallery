import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import {
  artworks,
  CategorySlug,
  changeMetArtWorkProps,
  DominantColor,
  formatPrice,
  getArtworkBySlug,
  getArtworksByArtist,
  orientationFrom,
  SizeCategory,
} from "@/data/artworks";
import { getArtist } from "@/data/artists";
import { ArtworkCard } from "@/components/site/ArtworkCard";
import { SmartImage } from "@/components/site/SmartImage";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useArtworkContext } from "@/lib/useMetArtworksStore";
import { EMPTY_TEXT } from "@/lib/emptyState";
import { useMetArtist } from "@/hooks/useMetArtist";
import { Loader } from "@/components/site/Loader";

export const Route = createFileRoute("/artworks/$slug")({
  component: ArtworkPage,
  // loader: ({ params }) => {

  //   if (!artwork) throw notFound();
  //   return { artwork };
  // },
  // head: ({ loaderData }) => ({
  //   meta: [
  //     {
  //       title: loaderData
  //         ? `${loaderData.artwork.title} — ${loaderData.artwork.artist} — Aethelred`
  //         : "Artwork — Aethelred",
  //     },
  //     {
  //       name: "description",
  //       content: loaderData?.artwork.description ?? "",
  //     },
  //   ],
  // }),
});

function ArtworkPage() {
  const { artworks, loadingAws } = useArtworkContext();
  const { slug } = useParams({ from: "/artworks/$slug" });

  const artwork = useMemo(() => {
    return getArtworkBySlug(slug, artworks);
  }, [slug, artworks]);

  const {
    artist,
    artworks: artistArtworks,
    isLoading,
    error,
    fetchMore,
    hasMore,
    total,
  } = useMetArtist(artwork?.artistSlug || "");

  // const artist = getArtist(artwork?.artistSlug || "");
  const { isFavorite, toggleFavorite, addToCart, cart } = useStore();
  const [qty, setQty] = useState(1);
  const fav = isFavorite(artwork?.slug || "");

  const related = useMemo(
    () =>
      artworks.length > 0
        ? artworks
            .filter(
              (a) =>
                a.slug !== artwork?.slug &&
                a.category === artwork?.category &&
                a.artist.toLowerCase() !== artwork.artist.toLowerCase(),
            )
            .concat(artworks.filter((a) => a.category === artwork?.category))
            .filter((a, i, arr) => arr.findIndex((b) => b.slug === a.slug) === i)
            .filter(
              (a) =>
                a.slug !== artwork?.slug &&
                a.category === artwork?.category &&
                a.artist.toLowerCase() !== artwork.artist.toLowerCase(),
            )
            .slice(0, 3)
        : [],
    [artwork?.category, artwork?.slug, artworks, artwork?.artist],
  );

  const otherImagesFromArtist = changeMetArtWorkProps(artist?.artworks)
    .filter(
      (a) => a.slug.toLowerCase() !== artwork?.slug.toLowerCase() && a.artist == artwork?.artist,
    )
    .slice(0, 4);

  const Nav = () => (
    <div className="mx-auto max-w-7xl px-6 pt-12">
      <Link
        to="/gallery"
        className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
      >
        &larr; Back to gallery
      </Link>
    </div>
  );

  if (loadingAws) {
    return (
      <>
        <Nav />
        <div className="mx-auto  grid max-w-7xl gap-16 px-6 py-16 md:py-24 ">
          <p className="text-center text-clay font-medium italic tracking-wide">
            <Loader variant="soft" size="xs" className="py-24" message="Loading Artwork..." />
          </p>
        </div>
      </>
    );
  }

  if (!artwork) {
    return (
      <>
        <Nav />
        <div className="mx-auto grid  max-w-7xl gap-16 px-6 py-16 md:py-24 ">
          <p className="text-center text-clay font-medium italic tracking-wide text-[11px]">
            Oops,
            <br />
            Seems We Can't Find This Artwork In Our Gallery Anymore...
          </p>
        </div>
      </>
    );
  }

  return (
    <article>
      <Nav />
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

          <p className="text-lg leading-relaxed text-ink/80">{artwork.description}</p>

          <dl className="grid grid-cols-2 gap-px border-y border-ink/10 bg-ink/10 sm:grid-cols-4">
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">Medium</dt>
              <dd className="mt-2 text-sm line-clamp-5">{artwork.medium}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">Dimensions</dt>
              <dd className="mt-2 text-sm line-clamp-5">{artwork.dimensions}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">Year</dt>
              <dd className="mt-2 text-sm">{artwork.year}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">Price</dt>
              <dd className="mt-2 font-display text-xl italic text-ink">
                {formatPrice(artwork.price)}
              </dd>
            </div>
          </dl>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-detail sm:grid-cols-3">
            <li>
              <span className="text-ink/60">Theme</span> — {artwork.theme}
            </li>
            <li>
              <span className="text-ink/60">Style</span> — {artwork.style}
            </li>
            <li>
              <span className="text-ink/60">Technique</span> — {artwork.technique}
            </li>
            <li>
              <span className="text-ink/60">Orientation</span> — {artwork.orientation}
            </li>
            <li>
              <span className="text-ink/60">Country</span> — {artwork.country}
            </li>
            <li>
              <span className="text-ink/60">Palette</span> — {artwork.dominantColor}
            </li>
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center justify-center border border-ink/20">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-3 text-detail hover:text-ink "
                aria-label="Decrease quantity"
              >
                <Minus className="size-3.5" strokeWidth={1.5} />
              </button>
              <span className="min-w-8 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-3 text-detail hover:text-ink "
                aria-label="Increase quantity"
              >
                <Plus className="size-3.5" strokeWidth={1.5} />
              </button>
            </div>
            <button
              onClick={() => addToCart(artwork.slug, qty)}
              className="inline-flex flex-1 items-center justify-center gap-2 border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
            >
              <ShoppingBag className="size-3.5" strokeWidth={1.5} />
              Add to cart · {formatPrice(artwork.price * qty)}
            </button>
            <button
              onClick={() => {
                toggleFavorite(artwork.slug);
                console.log(cart);
              }}
              aria-label={fav ? "Remove from favourites" : "Add to favourites"}
              className={cn(
                "inline-flex size-12 items-center justify-center border transition-colors",
                fav
                  ? "border-clay bg-clay/10 text-clay"
                  : "border-ink/20 text-ink hover:border-ink",
              )}
            >
              <Heart className="size-4" strokeWidth={1.5} fill={fav ? "currentColor" : "none"} />
            </button>
          </div>
          <Link
            to="/contact"
            className="text-[11px] uppercase tracking-[0.22em] text-detail underline underline-offset-4 hover:text-ink"
          >
            Or inquire about this work
          </Link>

          {artist && (
            <>
              <div>
                <div className="mt-4 flex items-center gap-4 border-t border-ink/10 pt-8">
                  <SmartImage
                    src={artist?.portrait}
                    alt={artist.name}
                    width={80}
                    height={80}
                    className="size-16 object-cover"
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                      About the artist
                    </p>
                    <p className="mt-1 font-display text-xl italic">{artist.name}</p>
                    <p className="text-xs text-detail">{artist.nationality}</p>
                  </div>
                </div>
                <p className="text-[10px] text-clay mt-3">{artist.bio}</p>
              </div>
            </>
          )}
        </aside>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
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

      {/* {isLoading && (
        <>
          <Loader message="Loading Artist Other Works" className="py-16 md:py024" />
        </>
      )} */}

      {/* Artist's other lots */}
      {/* {artist && artwork && otherImagesFromArtist.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20  ">
          <h2 className="mb-10 border-b border-ink/10 pb-6 font-display text-3xl italic">
            More from {artist.name}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {otherImagesFromArtist.map((a) => (
              <ArtworkCard key={a.slug} artwork={a} />
            ))}
          </div>
        </section>
      )} */}
    </article>
  );
}
