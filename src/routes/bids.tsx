import { createFileRoute, Link } from "@tanstack/react-router";
import { Gavel, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatBid, getAuctionBySlug } from "@/data/auctions";
import { PageHeader } from "@/components/site/PageHeader";
import { SmartImage } from "@/components/site/SmartImage";
import { Countdown } from "@/components/site/Countdown";

export const Route = createFileRoute("/bids")({
  component: BidsPage,
  head: () => ({ meta: [{ title: "My Bids — Aethelred" }] }),
});

function BidsPage() {
  const { bids, removeFromBid } = useStore();

  const rows = bids
    .map((b) => ({ bid: b, lot: getAuctionBySlug(b.lotSlug) }))
    .filter((r): r is { bid: typeof r.bid; lot: NonNullable<typeof r.lot> } => !!r.lot);

  return (
    <>
      <PageHeader
        eyebrow="Auction"
        title="My Bids"
        description="A live view of every lot you've placed a bid on."
      />
      <section className="mx-auto max-w-7xl px-6 pb-32 pt-6">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center">
            <Gavel className="size-10 text-detail" strokeWidth={1.2} />
            <p className="text-detail">You haven't placed any bids yet.</p>
            <Link
              to="/auctions"
              className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
            >
              View live auction
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
            {rows.map(({ bid, lot }) => {
              const leading = bid.amount >= lot.currentBid;
              return (
                <li key={`${bid.lotSlug}-${bid.placedAt}`}>
                  <div className="flex gap-6 py-6">
                    <Link
                      to="/auctions/$slug"
                      params={{ slug: lot.slug }}
                      className="block size-32 shrink-0 overflow-hidden bg-surface"
                    >
                      <SmartImage
                        src={lot.images[0]}
                        alt={lot.title}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col gap-2">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                        Lot {lot.lotNumber} · {lot.categoryLabel}
                      </p>
                      <Link
                        to="/auctions/$slug"
                        params={{ slug: lot.slug }}
                        className="font-display text-2xl italic text-ink hover:text-clay"
                      >
                        {lot.title}
                      </Link>
                      <div className="mt-1 flex  flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
                        <span className="text-detail">
                          Your bid:{" "}
                          <span className="font-display text-lg italic text-ink not-italic">
                            {formatBid(bid.amount)}
                          </span>
                        </span>
                        <span className="text-detail">Current: {formatBid(lot.currentBid)}</span>
                        <span
                          className={
                            leading
                              ? "border border-clay/40 bg-clay/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-clay"
                              : "border border-ink/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-detail"
                          }
                        >
                          {leading ? "Leading" : "Outbid"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between text-right">
                      <button
                        className="text-detail/80 hover:text-ink/80 transition-colors text-right float-right"
                        onClick={() => removeFromBid(bid.lotSlug)}
                      >
                        <Trash2 strokeWidth={1.2} size={18} />
                      </button>
                      <div className="shrink-0 min-w-0  hidden sm:block">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-detail ">
                          Closes in
                        </p>
                        <div className="mt-2">
                          <Countdown endsAt={lot.endsAt} size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 min-w-0  flex justify-between items-end mb-4 block sm:hidden">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-detail ">
                      Closes in
                    </p>
                    <div className="mt-2">
                      <Countdown endsAt={lot.endsAt} size="sm" />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
