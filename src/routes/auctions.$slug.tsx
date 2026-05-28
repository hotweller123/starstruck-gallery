import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Gavel, Heart, ShieldCheck, Mail, MapPin } from "lucide-react";
import {
  auctionLots,
  formatBid,
  getAuctionBySlug,
  getLotsBySeller,
  getSeller,
} from "@/data/auctions";
import { SmartImage } from "@/components/site/SmartImage";
import { Countdown } from "@/components/site/Countdown";
import { AuctionCard } from "@/components/site/AuctionCard";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auctions/$slug")({
  loader: ({ params }) => {
    const lot = getAuctionBySlug(params.slug);
    if (!lot) throw notFound();
    return { lot };
  },
  component: AuctionLotPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Lot ${loaderData.lot.lotNumber} · ${loaderData.lot.title} — Aethelred Auction`
          : "Auction lot — Aethelred",
      },
      { name: "description", content: loaderData?.lot.description ?? "" },
    ],
  }),
});

function AuctionLotPage() {
  const { lot } = Route.useLoaderData();
  const seller = getSeller(lot.sellerSlug);
  const sellerOtherLots = getLotsBySeller(lot.sellerSlug).filter(
    (l) => l.slug !== lot.slug,
  );

  // Side rail: this lot's own images + first image of each other seller lot
  const railImages = [
    ...lot.images.map((src: string, i: number) => ({
      src,
      label: `${lot.title} · ${i + 1}`,
      lotSlug: lot.slug,
    })),
    ...sellerOtherLots.map((l) => ({
      src: l.images[0],
      label: `Lot ${l.lotNumber} · ${l.title}`,
      lotSlug: l.slug,
    })),
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const active = railImages[activeIdx] ?? railImages[0];

  // Related: same category, exclude this lot
  const related = auctionLots
    .filter((l) => l.category === lot.category && l.slug !== lot.slug)
    .slice(0, 3);

  const minBid = lot.currentBid + 100;
  const { placeBid, toggleFavorite, isFavorite } = useStore();
  const [bidAmount, setBidAmount] = useState(minBid);
  const fav = isFavorite(lot.slug);

  const submitBid = () => {
    if (bidAmount < minBid) {
      alert(`Minimum next bid is ${formatBid(minBid)}.`);
      return;
    }
    placeBid(lot.slug, bidAmount);
    alert(`Bid of ${formatBid(bidAmount)} placed on Lot ${lot.lotNumber}.`);
  };

  return (
    <article>
      <div className="mx-auto max-w-7xl px-6 pt-12">
        <Link
          to="/auctions"
          className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
        >
          &larr; Back to auction
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:py-16 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        {/* Left: thumbnails + big image */}
        <div className="flex gap-4 md:gap-6">
          {/* Vertical thumbnail rail */}
          <div className="flex w-16 shrink-0 flex-col gap-3 md:w-20">
            {railImages.map((img, i) => {
              const isActive = i === activeIdx;
              const isOtherLot = img.lotSlug !== lot.slug;
              return (
                <button
                  key={`${img.src}-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={cn(
                    "group relative aspect-square overflow-hidden bg-surface outline outline-1 -outline-offset-1 transition-all",
                    isActive
                      ? "outline-ink"
                      : "outline-ink/10 hover:outline-ink/40",
                  )}
                  aria-label={img.label}
                  title={img.label}
                >
                  <SmartImage
                    src={img.src}
                    alt={img.label}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity",
                      isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100",
                    )}
                  />
                  {isOtherLot && (
                    <span className="absolute bottom-1 left-1 bg-canvas/80 px-1 text-[8px] uppercase tracking-[0.18em] text-ink">
                      Other
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Big image */}
          <div className="relative flex-1 bg-surface">
            <SmartImage
              key={active?.src}
              src={active?.src ?? lot.images[0]}
              alt={active?.label ?? lot.title}
              priority
              className="block h-auto w-full animate-in fade-in duration-500"
            />
            {active?.lotSlug && active.lotSlug !== lot.slug && (
              <Link
                to="/auctions/$slug"
                params={{ slug: active.lotSlug }}
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 border border-canvas/40 bg-canvas/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-ink backdrop-blur hover:bg-canvas"
              >
                View this lot →
              </Link>
            )}
          </div>
        </div>

        {/* Right: details + bid + seller */}
        <aside className="flex flex-col gap-8 lg:sticky lg:top-32 lg:self-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-clay">
              Lot {lot.lotNumber} · {lot.categoryLabel}
            </p>
            <h1 className="mt-3 font-display text-5xl italic leading-tight md:text-6xl">
              {lot.title}
            </h1>
            {seller && (
              <Link
                to="/artists/$slug"
                params={{ slug: seller.slug }}
                className="mt-3 inline-block text-base text-detail underline decoration-detail/30 underline-offset-4 hover:text-ink hover:decoration-ink"
              >
                {seller.name}
              </Link>
            )}
          </div>

          <p className="text-base leading-relaxed text-ink/80">
            {lot.description}
          </p>

          {/* Live bid panel */}
          <div className="border border-ink/15 bg-surface/50 p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                  Current bid
                </p>
                <p className="mt-1 font-display text-4xl italic text-ink">
                  {formatBid(lot.currentBid)}
                </p>
                <p className="mt-1 text-xs text-detail">
                  {lot.bidCount} bids · estimate {formatBid(lot.estimateLow)}–
                  {formatBid(lot.estimateHigh)}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]",
                  lot.reserveMet
                    ? "border-clay/40 bg-clay/10 text-clay"
                    : "border-ink/20 text-detail",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    lot.reserveMet ? "bg-clay" : "bg-detail/50",
                  )}
                />
                {lot.reserveMet ? "Reserve met" : "No reserve yet"}
              </span>
            </div>

            <div className="mt-6 border-t border-ink/10 pt-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Closes in
              </p>
              <div className="mt-3">
                <Countdown endsAt={lot.endsAt} size="md" />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center border border-ink/20 bg-canvas">
                <span className="px-3 text-sm text-detail">$</span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  min={minBid}
                  step={100}
                  className="w-full bg-transparent py-3 pr-3 text-base text-ink focus:outline-none"
                  aria-label="Your bid"
                />
              </div>
              <button
                type="button"
                onClick={submitBid}
                className="inline-flex items-center justify-center gap-2 border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
              >
                <Gavel className="size-3.5" strokeWidth={1.5} />
                Place bid
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(lot.slug)}
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
            <p className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-detail">
              <ShieldCheck className="size-3.5" strokeWidth={1.5} />
              Min next bid {formatBid(minBid)} · Buyer's premium 12% · Auctioned lots cannot be added to cart
            </p>
          </div>

          {/* Specifications */}
          <dl className="grid grid-cols-2 gap-px border-y border-ink/10 bg-ink/10">
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Medium
              </dt>
              <dd className="mt-2 text-sm">{lot.medium}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Dimensions
              </dt>
              <dd className="mt-2 text-sm">{lot.dimensions}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Year
              </dt>
              <dd className="mt-2 text-sm">{lot.year}</dd>
            </div>
            <div className="bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Condition
              </dt>
              <dd className="mt-2 text-sm">{lot.condition}</dd>
            </div>
            <div className="col-span-2 bg-canvas p-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Provenance
              </dt>
              <dd className="mt-2 text-sm">{lot.provenance}</dd>
            </div>
          </dl>

          {/* Seller card */}
          {seller && (
            <div className="border border-ink/10 p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                Consigned by
              </p>
              <div className="mt-4 flex items-start gap-4">
                <SmartImage
                  src={seller.portrait}
                  alt={seller.name}
                  width={88}
                  height={88}
                  className="size-20 shrink-0 object-cover"
                />
                <div>
                  <p className="font-display text-2xl italic">{seller.name}</p>
                  <p className="text-xs text-detail">{seller.discipline}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-detail">
                    <MapPin className="size-3" strokeWidth={1.5} />
                    {seller.location}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">
                {seller.short}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  to="/artists/$slug"
                  params={{ slug: seller.slug }}
                  className="text-[11px] uppercase tracking-[0.22em] text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                >
                  Artist page
                </Link>
                <a
                  href="mailto:hello@aethelred.gallery"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
                >
                  <Mail className="size-3" strokeWidth={1.5} />
                  Contact seller
                </a>
              </div>
            </div>
          )}
        </aside>
      </section>

      {/* Seller's other lots */}
      {sellerOtherLots.length > 0 && seller && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <h2 className="mb-10 border-b border-ink/10 pb-6 font-display text-3xl italic">
            More from {seller.name}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sellerOtherLots.slice(0, 3).map((l) => (
              <AuctionCard key={l.slug} lot={l} />
            ))}
          </div>
        </section>
      )}

      {/* Related lots */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-32">
          <h2 className="mb-10 border-b border-ink/10 pb-6 font-display text-3xl italic">
            Related lots in {lot.categoryLabel}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <AuctionCard key={l.slug} lot={l} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
