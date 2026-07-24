import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Gavel, Eye, Calendar, DollarSign, Tag, User, Hash, Clock } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { useAuthStore, useDataStore } from "@/store/zustand";
import { useShallow } from "zustand/shallow";
import { AuctionLot, formatBid } from "@/data/auctions";
import { AuctionImageSwiper } from "@/components/site/AuctionImageSwiper";
import { Countdown } from "@/components/site/Countdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/utils/gen";

export const Route = createFileRoute("/auctions/mine")({
  component: MyAuctionsPage,
  head: () => ({
    meta: [
      { title: "My Auctions — Aethelred" },
      { name: "description", content: "View and manage all auction lots you've consigned." },
    ],
  }),
});

function MyAuctionsPage() {
  const { user, loading, isAuthHydrated } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      loading: s.loading,
      isAuthHydrated: s.isAuthHydrated,
    })),
  );

  const { auctions } = useDataStore(
    useShallow((s) => ({
      auctions: s.auctions,
    })),
  );

  const [selected, setSelected] = useState<AuctionLot | null>(null);

  // Filter to current user's auctions (by userID or sellerSlug fallback)
  const myAuctions = auctions.filter((a) => {
    if (!user) return false;
    if (a.userID && user.userID) return a.userID === user.userID;
    // fallback match by sellerSlug derived from email username
    const emailUser = user.email?.split("@")[0]?.toLowerCase().replace(/\./g, "-");
    return a.sellerSlug === emailUser || a.sellerSlug === user.userName;
  });

  const open = (lot: AuctionLot) => setSelected(lot);
  const close = () => setSelected(null);

  if (loading || !isAuthHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-detail">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <Gavel className="mx-auto size-10 text-detail" />
        <h1 className="mt-4 font-display text-4xl italic">Sign in to view your auctions</h1>
        <p className="mt-2 text-detail">
          You need an account to see lots you've put up for auction.
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

  return (
    <>
      <PageHeader
        eyebrow="Auction"
        title="My Auctions"
        description="All lots you've consigned. Click any card to inspect full details."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-6">
        {myAuctions.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center">
            <Gavel className="size-10 text-detail" strokeWidth={1.2} />
            <p className="text-detail">You haven't put any lots up for auction yet.</p>
            <Link
              to="/sell"
              className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
            >
              Consign a work
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myAuctions.map((lot) => (
              <button
                key={lot.slug}
                type="button"
                onClick={() => open(lot)}
                className="group flex flex-col overflow-hidden border border-ink/10 bg-canvas text-left transition hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
              >
                {/* Image */}
                <div className="relative">
                  <AuctionImageSwiper
                    images={lot.images?.length ? lot.images : []}
                    alt={lot.title}
                    aspect="aspect-[16/10]"
                  />
                  <span
                    className={cn(
                      "absolute right-3 top-3 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] border",
                      lot.status === "active"
                        ? "border-clay/40 bg-clay/10 text-clay"
                        : lot.status === "pending"
                          ? "border-ink/20 bg-canvas text-detail"
                          : "border-ink/20 bg-canvas text-detail",
                    )}
                  >
                    {lot.status}
                  </span>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                      Lot {lot.lotNumber || "—"} · {lot.categoryLabel}
                    </p>
                    <h3 className="mt-1 font-display text-2xl italic leading-tight group-hover:text-clay">
                      {lot.title}
                    </h3>
                    <p className="mt-1 text-xs text-detail">
                      {lot.year} · {lot.medium}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-detail">
                        Current bid
                      </p>
                      <p className="font-display text-xl italic">{formatBid(lot.currentBid)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-detail">
                        Estimate
                      </p>
                      <p className="text-sm">
                        {formatBid(lot.estimateLow)} – {formatBid(lot.estimateHigh)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-detail">Bids</p>
                      <p>{lot.bidCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-detail">
                        Starts at
                      </p>
                      <p>{formatBid(lot.startBid)}</p>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-3 text-xs">
                    <div className="flex items-center gap-1.5 text-detail">
                      <Clock className="size-3.5" />
                      <span>Closes</span>
                    </div>
                    <Countdown endsAt={lot.endsAt} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-detail">
                    <span className={cn(lot.reserveMet ? "text-clay" : "")}>
                      {lot.reserveMet ? "Reserve met" : "No reserve yet"}
                    </span>
                    <span className="inline-flex items-center gap-1 opacity-60 group-hover:opacity-100">
                      View details <Eye className="size-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && close()}>
        <DialogContent
          className={cn(
            "bg-canvas p-0 flex flex-col overflow-hidden border border-ink/10 shadow-2xl",
            // Mobile: true fullscreen, scroll inside
            "fixed inset-0 w-full h-dvh max-w-none left-0 top-0 translate-x-0 translate-y-0 rounded-none",
            // Desktop: centered, elegant, NOT full screen
            "md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
            "md:w-[calc(100%-2rem)] md:max-w-5xl md:max-h-[88vh] md:h-[88dvh] md:rounded-xl",
          )}
        >
          {selected && (
            <div className="flex h-full min-h-0 flex-col">
              {/* Header (sticky) */}
              <div className="shrink-0 border-b border-ink/10 bg-canvas px-5 py-4 flex items-start justify-between sticky top-0 z-10">
                <div className="min-w-0 pr-8">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                    Lot {selected.lotNumber || "—"} · {selected.categoryLabel}
                  </p>
                  <h2 className="font-display text-[22px] md:text-3xl italic leading-tight mt-0.5 break-words">
                    {selected.title}
                  </h2>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Hero image */}
                <div className="border-b border-ink/10 bg-surface">
                  <AuctionImageSwiper
                    images={selected.images?.length ? selected.images : []}
                    alt={selected.title}
                    aspect="aspect-[16/10] md:aspect-[16/9]"
                    priority
                  />
                </div>

                <div className="p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left */}
                    <div className="space-y-4">
                      <DetailSection title="Overview">
                        <DetailRow label="Slug" value={selected.slug} />
                        <DetailRow label="ID" value={selected.id || "—"} />
                        <DetailRow label="Seller" value={selected.sellerSlug} />
                        <DetailRow label="User ID" value={selected.userID || "—"} />
                        <DetailRow label="Status" value={selected.status} />
                      </DetailSection>

                      <DetailSection title="Artwork">
                        <DetailRow label="Year" value={String(selected.year)} />
                        <DetailRow label="Medium" value={selected.medium} />
                        <DetailRow label="Dimensions" value={selected.dimensions} />
                        <DetailRow label="Description" value={selected.description} />
                      </DetailSection>

                      <DetailSection title="Provenance & Condition">
                        <DetailRow label="Provenance" value={selected.provenance} />
                        <DetailRow label="Condition" value={selected.condition} />
                      </DetailSection>
                    </div>

                    {/* Right */}
                    <div className="space-y-4">
                      <DetailSection title="Pricing">
                        <DetailRow label="Price" value={formatBid(selected.price)} />
                        <DetailRow
                          label="Estimate"
                          value={`${formatBid(selected.estimateLow)} – ${formatBid(selected.estimateHigh)}`}
                        />
                        <DetailRow label="Start Bid" value={formatBid(selected.startBid)} />
                        <DetailRow label="Current Bid" value={formatBid(selected.currentBid)} />
                      </DetailSection>

                      <DetailSection title="Bidding">
                        <DetailRow label="Bids" value={String(selected.bidCount)} />
                        <DetailRow
                          label="Reserve"
                          value={selected.reserveMet ? "Met" : "Not met yet"}
                        />
                      </DetailSection>

                      <DetailSection title="Closes">
                        <DetailRow
                          label="Ends at"
                          value={new Date(selected.endsAt).toLocaleString()}
                        />
                        <div className="flex items-center justify-between py-1 text-sm">
                          <span className="text-detail">Time left</span>
                          <Countdown endsAt={selected.endsAt} size="sm" />
                        </div>
                      </DetailSection>

                      <DetailSection title="Images">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-detail mb-2">
                          {selected.images?.length || 0} image
                          {(selected.images?.length || 0) === 1 ? "" : "s"}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {(selected.images || []).map((src, i) => (
                            <div
                              key={i}
                              className="aspect-[4/3] overflow-hidden border border-ink/10 bg-surface"
                            >
                              <img
                                src={src}
                                alt={`${selected.title} ${i + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </DetailSection>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-ink/10 bg-surface/70 px-5 py-3 flex items-center justify-between gap-3">
                <Link
                  to="/auctions/$slug"
                  params={{ slug: selected.slug }}
                  className="text-[11px] uppercase tracking-[0.22em] text-detail underline decoration-ink/30 hover:text-ink hover:decoration-ink"
                >
                  View public page →
                </Link>

                <DialogClose asChild>
                  <button className="border border-ink bg-ink px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay">
                    Close
                  </button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-ink/10 bg-surface/10 p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-ink/10 pb-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-detail">{title}</p>
      </div>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-0.5 text-sm">
      <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-detail/80 pt-0.5">
        {label}
      </span>
      <span className="text-right break-words font-normal text-ink/70">{value}</span>
    </div>
  );
}

// Aliases used inside the modal for clarity
const DetailSection = Section;
const DetailRow = KV;
