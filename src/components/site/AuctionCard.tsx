import { Link } from "@tanstack/react-router";
import { Gavel } from "lucide-react";
import type { AuctionLot } from "@/data/auctions";
import { formatBid, getLotsBySeller, getSeller } from "@/data/auctions";
import { AuctionImageSwiper } from "./AuctionImageSwiper";
import { Countdown } from "./Countdown";

interface Props {
  lot: AuctionLot;
  priority?: boolean;
}

export function AuctionCard({ lot, priority }: Props) {
  const seller = getSeller(lot.sellerSlug);
  // Swipable images: lot's own images + other lots from the same seller
  const otherSellerImages = getLotsBySeller(lot.sellerSlug)
    .filter((l) => l.slug !== lot.slug)
    .map((l) => l.images[0]);
  const swipable = [...lot.images, ...otherSellerImages];

  return (
    <article className="group flex flex-col bg-canvas outline outline-1 -outline-offset-1 outline-ink/10 transition-colors hover:outline-ink/30">
      <div className="relative">
        <AuctionImageSwiper
          images={swipable}
          alt={lot.title}
          priority={priority}
          aspect="aspect-[4/5]"
        />
        {/* lot number badge */}
        {/* <div className="pointer-events-none absolute left-4 top-4 z-10 border border-canvas/50 bg-canvas/85 px-2.5 py-1 text-[9px] uppercase tracking-[0.24em] text-ink backdrop-blur">
          Lot {lot.lotNumber.slice(0, 3)}
        </div> */}
        {/* reserve status */}
        <div className="pointer-events-none absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 border border-canvas/50 bg-canvas/85 px-2.5 py-1 text-[9px] uppercase tracking-[0.24em] backdrop-blur">
          <span
            className={
              lot.reserveMet
                ? "size-1.5 rounded-full bg-clay"
                : "size-1.5 rounded-full bg-detail/50"
            }
          />
          {lot.reserveMet ? "Reserve met" : "No reserve yet"}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
          {lot.categoryLabel} · {lot.year}
        </p>
        <h3 className="mt-2 font-display text-3xl italic leading-tight text-ink">
          <Link to="/auctions/$slug" params={{ slug: lot.slug }} className="hover:text-clay">
            {lot.title}
          </Link>
        </h3>
        {seller && (
          <Link
            to="/artists/$slug"
            params={{ slug: seller.slug }}
            className="mt-1 text-xs text-detail underline decoration-detail/20 underline-offset-4 hover:text-ink hover:decoration-ink"
          >
            {seller.name} · {seller.location}
          </Link>
        )}

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink/70">{lot.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-px border-y border-ink/10 bg-ink/10">
          <div className="bg-canvas p-4">
            <p className="text-[9px] uppercase tracking-[0.22em] text-detail">Price</p>
            <p className="mt-1 font-display text-2xl italic text-ink">{formatBid(lot.price)}</p>
            <p className="mt-0.5 text-[10px] text-detail">
              {lot.bidCount} {lot.bidCount === 1 ? "bid" : "bids"}
            </p>
          </div>
          <div className="bg-canvas p-4">
            <p className="text-[9px] uppercase tracking-[0.22em] text-detail">Estimate</p>
            <p className="mt-1 font-display text-lg italic text-ink/80">
              {formatBid(lot.estimateLow)} – {formatBid(lot.estimateHigh)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <Countdown endsAt={lot.endsAt} size="sm" />
          <Link
            to="/auctions/$slug"
            params={{ slug: lot.slug }}
            className="inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas transition-colors hover:bg-clay hover:border-clay"
          >
            <Gavel className="size-3.5" strokeWidth={1.5} />
            Place a bid
          </Link>
        </div>
      </div>
    </article>
  );
}
