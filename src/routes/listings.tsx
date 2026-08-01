import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Eye, Calendar, Tag, Image as ImageIcon, X } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { formatBid } from "@/data/auctions";
import { SmartImage } from "@/components/site/SmartImage";
import { AuctionImageSwiper } from "@/components/site/AuctionImageSwiper";
import { cn } from "@/utils/gen";
import type { Listing } from "@/types";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

export const Route = createFileRoute("/listings")({
  component: MyListingsPage,
  head: () => ({
    meta: [
      { title: "My Listings — Aethelred" },
      {
        name: "description",
        content: "Auction works you have successfully won. Your acquired collection.",
      },
    ],
  }),
});

function MyListingsPage() {
  const { user, loading, isAuthHydrated } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      loading: s.loading,
      isAuthHydrated: s.isAuthHydrated,
    })),
  );

  const { listings } = useDataStore(
    useShallow((s) => ({
      listings: s.listings,
    })),
  );

  const [selected, setSelected] = useState<Listing | null>(null);

  // Filter to current user's won listings
  const myListings = (listings || []).filter((l) => {
    if (!user) return false;
    return l.userID === user.userID;
  });

  const open = (l: Listing) => setSelected(l);
  const close = () => setSelected(null);

  if (loading || !isAuthHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-detail">
          Loading your collection…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Trophy className="mx-auto size-10 text-detail" />
        <h1 className="mt-4 font-display text-4xl italic">Sign in to view your listings</h1>
        <p className="mt-2 text-detail">
          Your won auction works will appear here once you successfully acquire a lot.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/connect"
            className="border border-ink bg-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
          >
            Sign in
          </Link>
          <Link
            to="/auctions"
            className="border border-ink px-6 py-2 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
          >
            Browse auctions
          </Link>
        </div>
      </div>
    );
  }

  // Sort newest first
  const sortedListings = [...myListings].sort((a, b) => {
    const da = new Date(a.placedAt || a.createdAt || 0).getTime();
    const db = new Date(b.placedAt || b.createdAt || 0).getTime();
    return db - da;
  });

  return (
    <>
      <PageHeader
        eyebrow="Collection"
        title="My Listings"
        description="Auction lots you have successfully won. Each piece is a record of your eye and commitment."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {sortedListings.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center">
            <Trophy className="size-10 text-detail" strokeWidth={1.2} />
            <p className="text-detail">You haven’t won any auctions yet.</p>
            <p className="max-w-md text-sm text-detail/80">
              When you place the winning bid on a live auction, the lot will appear here as part of
              your collection.
            </p>
            <Link
              to="/auctions"
              className="mt-2 border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
            >
              Explore live auctions
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedListings.map((listing) => (
              <button
                key={listing.slug}
                type="button"
                onClick={() => open(listing)}
                className="group flex flex-col overflow-hidden border border-ink/10 bg-canvas text-left transition hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
              >
                <ListingCard listing={listing} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && close()}>
        <DialogContent
          className={cn(
            "bg-canvas p-0 flex flex-col overflow-hidden border border-ink/10 shadow-2xl [&>button:last-child]:hidden",
            "fixed inset-0 w-full h-dvh max-w-none left-0 top-0 translate-x-0 translate-y-0 rounded-none",
            "md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
            "md:w-[calc(100%-2rem)] md:max-w-4xl md:max-h-[90vh] md:h-[90dvh] md:rounded-xl",
          )}
        >
          {selected && <ListingDetailModal listing={selected} onClose={close} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   Detail Modal
────────────────────────────────────────────────────────────── */
function ListingDetailModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const wonDate = listing.placedAt
    ? new Date(listing.placedAt).toLocaleDateString(undefined, {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : listing.createdAt
      ? new Date(listing.createdAt).toLocaleDateString(undefined, {
          weekday: "short",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown date";

  const statusLabel = (listing.status || "won").toLowerCase();

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-ink/10 bg-canvas px-5 py-4 flex items-start justify-between sticky top-0 z-10">
        <div className="min-w-0 pr-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
            {listing.category || "Work"} · Won {wonDate}
          </p>
          <h2 className="font-display text-[22px] md:text-3xl italic leading-tight mt-0.5 break-words">
            {listing.title}
          </h2>
          {listing.userName && <p className="mt-1 text-sm text-detail">by {listing.userName}</p>}
        </div>

        <DialogClose asChild>
          <button
            onClick={onClose}
            className="text-detail hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </DialogClose>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {/* Hero image - use AuctionImageSwiper when multiple images */}
        <div className="border-b border-ink/10 bg-surface">
          {listing.images && listing.images.length > 0 ? (
            <AuctionImageSwiper
              images={listing.images}
              alt={listing.title}
              aspect="aspect-[16/10] md:aspect-[16/9]"
            />
          ) : (
            <div className="flex aspect-[16/10] md:aspect-[16/9] items-center justify-center bg-surface text-detail">
              <ImageIcon className="size-10" strokeWidth={1.2} />
            </div>
          )}
        </div>

        <div className="p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-detail mb-1">
                  Winning bid
                </p>
                <p className="font-display text-4xl italic text-ink">
                  {formatBid(listing.bidAmount)}
                </p>
              </div>

              <div className="border border-ink/10 bg-surface/50 p-4 text-sm">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-detail mb-2">
                  <span>Acquisition details</span>
                  <Trophy className="size-3.5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-detail">Status</span>
                    <span className="text-ink capitalize">{statusLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-detail">Total bids</span>
                    <span className="text-ink">{listing.totalBidCounts ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-detail">Won on</span>
                    <span className="text-ink">{wonDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-detail mb-2">
                  Description
                </p>
                <p className="text-sm leading-relaxed text-ink/80 whitespace-pre-line">
                  {listing.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Right column — specs */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-px bg-ink/10">
                <div className="bg-canvas p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-detail">Year</p>
                  <p className="mt-1 text-lg">{listing.year || "—"}</p>
                </div>
                <div className="bg-canvas p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-detail">Medium</p>
                  <p className="mt-1 text-lg">{listing.medium || "—"}</p>
                </div>
                <div className="bg-canvas p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-detail">Dimensions</p>
                  <p className="mt-1 text-lg">{listing.dimensions || "—"}</p>
                </div>
                <div className="bg-canvas p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-detail">Category</p>
                  <p className="mt-1 text-lg capitalize">{listing.category || "—"}</p>
                </div>
              </div>

              {(listing.provenance || listing.condition) && (
                <div className="border border-ink/10 p-4 text-sm">
                  {listing.provenance && (
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-detail mb-1">
                        Provenance
                      </p>
                      <p className="text-ink/80">{listing.provenance}</p>
                    </div>
                  )}
                  {listing.condition && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-detail mb-1">
                        Condition
                      </p>
                      <p className="text-ink/80">{listing.condition}</p>
                    </div>
                  )}
                </div>
              )}

              {listing.images && listing.images.length > 1 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-detail mb-2">
                    More views ({listing.images.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {listing.images.slice(1, 4).map((src, i) => (
                      <div
                        key={i}
                        className="aspect-[4/3] overflow-hidden border border-ink/10 bg-surface"
                      >
                        <img
                          src={src}
                          alt={`${listing.title} view ${i + 2}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-ink/10 bg-surface/70 px-5 py-3 flex items-center justify-between gap-3">
        <Link
          to="/auctions/$slug"
          params={{ slug: listing.slug }}
          className="text-[11px] uppercase tracking-[0.22em] text-detail underline decoration-ink/30 hover:text-ink hover:decoration-ink"
        >
          View original auction →
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/sell"
            search={{ fromListing: listing.slug }}
            className="border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-canvas"
            onClick={onClose}
          >
            Edit &amp; Re-auction
          </Link>

          <DialogClose asChild>
            <button
              onClick={onClose}
              className="border border-ink bg-ink px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
            >
              Close
            </button>
          </DialogClose>
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const wonDate = listing.placedAt
    ? new Date(listing.placedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : listing.createdAt
      ? new Date(listing.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const statusLabel = (listing.status || "won").toLowerCase();
  const isClaimed = ["won", "claimed", "paid", "delivered"].includes(statusLabel);

  return (
    <div className="group flex flex-col overflow-hidden border border-ink/10 bg-canvas transition hover:border-ink/30">
      {/* Image - use AuctionImageSwiper for multiple images */}
      <div className="relative bg-surface">
        {listing.images && listing.images.length > 0 ? (
          <AuctionImageSwiper images={listing.images} alt={listing.title} aspect="aspect-[16/11]" />
        ) : (
          <div className="flex aspect-[16/11] items-center justify-center bg-surface text-detail">
            <ImageIcon className="size-8" strokeWidth={1.2} />
          </div>
        )}

        {/* Status badge */}
        <div
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em]",
            isClaimed
              ? "border-clay/40 bg-clay/10 text-clay"
              : "border-ink/20 bg-canvas/90 text-detail",
          )}
        >
          <Trophy className="size-3" strokeWidth={2} />
          {statusLabel === "won" ? "Won" : listing.status || "Won"}
        </div>

        {/* Winning bid overlay */}
        <div className="absolute bottom-3 right-3 border border-ink/10 bg-canvas/95 px-3 py-1 text-right backdrop-blur">
          <p className="text-[9px] uppercase tracking-[0.2em] text-detail">Winning bid</p>
          <p className="font-display text-xl italic leading-none text-ink">
            {formatBid(listing.bidAmount)}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
            {listing.year ? `${listing.year} · ` : ""}
            {listing.category || "Work"}
          </p>
          <h3 className="mt-1 font-display text-2xl italic leading-tight group-hover:text-clay">
            {listing.title}
          </h3>
          {listing.userName && <p className="mt-1 text-sm text-detail">by {listing.userName}</p>}
        </div>

        {/* Meta */}
        <div className="mt-auto space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
            {listing.medium && (
              <div>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-detail">
                  Medium
                </span>
                <span>{listing.medium}</span>
              </div>
            )}
            {listing.dimensions && (
              <div>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-detail">
                  Dimensions
                </span>
                <span>{listing.dimensions}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-detail">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>{wonDate ? `Won ${wonDate}` : "Date unavailable"}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.18em]">
              <Tag className="size-3" />
              {listing.totalBidCounts ?? 0} bids
            </div>
          </div>
        </div>
      </div>

      {/* Subtle footer hint */}
      <div className="flex items-center justify-between border-t border-ink/10 bg-surface/40 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-detail">
        <span>View details</span>
        <span className="text-clay/70 group-hover:text-clay transition">In collection</span>
      </div>
    </div>
  );
}
