import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import {
  auctionCategories,
  auctionLots,
  auctionPriceMax,
  auctionPriceMin,
  formatBid,
  type AuctionLot,
} from "@/data/auctions";
import type { CategorySlug } from "@/data/artworks";
import { artists } from "@/data/artists";
import { PageHeader } from "@/components/site/PageHeader";
import { AuctionCard } from "@/components/site/AuctionCard";
import { Countdown } from "@/components/site/Countdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShallow } from "zustand/shallow";
import { useDataStore } from "@/store/zustand";

export const Route = createFileRoute("/auctions/")({
  component: AuctionsPage,
  head: () => ({
    meta: [
      { title: "Live Auction — Aethelred" },
      {
        name: "description",
        content:
          "Bid on a curated selection of contemporary artworks across painting, sculpture, photography and ceramics. Live lots, timed closings.",
      },
    ],
  }),
});

type SortKey = "ending-soon" | "newest" | "low-high" | "high-low" | "most-bids";

interface AuctionFilters {
  category: (CategorySlug | "all")[];
  seller: string[]; // sellerSlugs
  reserveMet: boolean;
  endingSoon: boolean; // < 24h
  priceMin: number;
  priceMax: number;
}

const defaultFilters = (): AuctionFilters => ({
  category: [],
  seller: [],
  reserveMet: false,
  endingSoon: false,
  priceMin: auctionPriceMin,
  priceMax: auctionPriceMax,
});

function apply(lots: AuctionLot[], f: AuctionFilters, sort: SortKey) {
  let out = lots.filter((l) => {
    if (f.category.length && !f.category.includes(l.category)) return false;
    if (f.seller.length && !f.seller.includes(l.sellerSlug)) return false;
    if (f.reserveMet && !l.reserveMet) return false;
    if (f.endingSoon) {
      const ms = new Date(l.endsAt).getTime() - Date.now();
      if (ms <= 0 || ms > 24 * 3_600_000) return false;
    }
    if (l.currentBid < f.priceMin || l.currentBid > f.priceMax) return false;
    return true;
  });

  out = [...out];
  switch (sort) {
    case "ending-soon":
      out.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
      break;
    case "newest":
      out.sort((a, b) => b.year - a.year);
      break;
    case "low-high":
      out.sort((a, b) => a.currentBid - b.currentBid);
      break;
    case "high-low":
      out.sort((a, b) => b.currentBid - a.currentBid);
      break;
    case "most-bids":
      out.sort((a, b) => b.bidCount - a.bidCount);
      break;
  }
  return out;
}

function AuctionsPage() {
  const [filters, setFilters] = useState<AuctionFilters>(defaultFilters);
  const [sort, setSort] = useState<SortKey>("ending-soon");
  const [activeCat, setActiveCat] = useState<CategorySlug | "all">("all");
  const { auctions } = useDataStore(
    useShallow((s) => ({
      auctions: s.auctions,
    })),
  );
  console.log(auctions);

  // const filtered = useMemo(() => {
  //   const f: AuctionFilters = activeCat === "all" ? filters : { ...filters, category: [activeCat] };
  //   return apply(auctionLots.concat(auctions), f, sort);
  // }, [filters, sort, activeCat, auctions]);

  const filtered = auctions;

  const featured = useMemo(
    () =>
      [...auctions].sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())[0],
    [auctions],
  );

  return (
    <>
      <PageHeader
        eyebrow="Spring Auction · No. 12"
        title="Live Auction"
        description="A timed sale of twelve contemporary works, hand-picked from the gallery's spring programme. Lots close on a rolling schedule — bid carefully and well."
      />

      {/* Featured hero — soonest closing */}
      {featured && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="grid items-stretch gap-px border border-ink/10 bg-ink/10 md:grid-cols-[1.2fr_1fr]">
            <div className="bg-canvas">
              <div className="aspect-[5/4] w-full overflow-hidden bg-surface md:aspect-auto md:h-full">
                <img
                  src={featured.images[0]}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-8 bg-canvas p-8 md:p-12">
              <div>
                {/* <p className="text-[10px] uppercase tracking-[0.3em] text-clay">
                  Closing next · Lot {featured.lotNumber}
                </p> */}
                <h2 className="mt-4 font-display text-4xl italic leading-tight md:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-2 text-sm text-detail">
                  {featured.categoryLabel} · {featured.year} · {featured.medium}
                </p>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink/75">
                  {featured.description}
                </p>
              </div>

              <div className="space-y-6">
                <Countdown endsAt={featured.endsAt} size="lg" />
                <div className="flex items-end justify-between border-t border-ink/10 pt-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-detail">Price</p>
                    <p className="mt-1 font-display text-3xl italic">{formatBid(featured.price)}</p>
                    <p className="text-xs text-detail">
                      {featured.bidCount} bids · est. {formatBid(featured.estimateLow)}–
                      {formatBid(featured.estimateHigh)}
                    </p>
                  </div>
                  <Link
                    to="/auctions/$slug"
                    params={{ slug: featured.slug }}
                    className="inline-block border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
                  >
                    View lot
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category chips */}
      <div className="mx-auto max-w-7xl px-6 pb-4">
        <div className="no-scrollbar flex items-center gap-3 overflow-x-auto">
          {auctionCategories.map((c) => {
            const active = activeCat === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setActiveCat(c.slug)}
                className={`shrink-0 rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "border-ink bg-ink text-canvas"
                    : "border-ink/15 text-detail hover:border-ink hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-detail">
          {filtered.length} {filtered.length === 1 ? "lot" : "lots"} on offer
        </span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-detail">
            Sort
            <Select value={sort} onValueChange={(e) => setSort(e as SortKey)}>
              <SelectTrigger className="border border-ink/20 bg-canvas px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-ink focus:border-none focus:outline-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ending-soon">Ending soon</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="low-high">Bid: low → high</SelectItem>
                  <SelectItem value="high-low">Bid: high → low</SelectItem>
                  <SelectItem value="most-bids">Most bids</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
          <AuctionFilterSheet
            value={filters}
            onChange={setFilters}
            totalCount={auctionLots.length}
            matchCount={filtered.length}
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-sm text-detail">No lots match these filters.</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l, i) => (
              <AuctionCard key={l.slug} lot={l} priority={i < 3} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/* ----------------------------- Filter Sheet ----------------------------- */

function AuctionFilterSheet({
  value,
  onChange,
  totalCount,
  matchCount,
}: {
  value: AuctionFilters;
  onChange: (f: AuctionFilters) => void;
  totalCount: number;
  matchCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AuctionFilters>(value);

  const openSheet = (o: boolean) => {
    if (o) setDraft(value);
    setOpen(o);
  };

  const toggleArr = <T extends string>(key: "category" | "seller", v: T) => {
    setDraft((d) => {
      const arr = d[key] as unknown as T[];
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
      return { ...d, [key]: next } as AuctionFilters;
    });
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="border-t border-ink/10 py-6 first:border-t-0 first:pt-0">
      <h3 className="mb-4 text-[10px] uppercase tracking-[0.22em] text-detail">{title}</h3>
      {children}
    </section>
  );

  const Chip = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 text-xs transition-colors ${
        active
          ? "border-ink bg-ink text-canvas"
          : "border-ink/20 text-detail hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );

  return (
    <Sheet open={open} onOpenChange={openSheet}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-canvas"
        >
          <SlidersHorizontal className="size-3.5" />
          Filters
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-none flex-col gap-0 overflow-hidden bg-canvas p-0 sm:w-[440px] sm:max-w-[440px]"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-ink/10 px-6 py-5">
          <SheetTitle className="font-display text-2xl italic">Refine lots</SheetTitle>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="text-detail hover:text-ink"
          >
            {/* <X className="size-5" /> */}
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Section title={`Bid · ${formatBid(draft.priceMin)} — ${formatBid(draft.priceMax)}`}>
            <Slider
              value={[draft.priceMin, draft.priceMax]}
              className="mx-auto w-full max-w-xs"
              min={auctionPriceMin}
              max={auctionPriceMax}
              step={100}
              onValueChange={([min, max]) =>
                setDraft((d) => ({ ...d, priceMin: min, priceMax: max }))
              }
            />
          </Section>

          <Section title="Category">
            <div className="flex flex-wrap gap-2">
              {auctionCategories
                .filter((c) => c.slug !== "all")
                .map((c) => (
                  <Chip
                    key={c.slug}
                    active={draft.category.includes(c.slug)}
                    onClick={() => toggleArr("category", c.slug as CategorySlug)}
                  >
                    {c.label}
                  </Chip>
                ))}
            </div>
          </Section>

          <Section title="Seller">
            <div className="flex flex-wrap gap-2">
              {artists.map((a) => (
                <Chip
                  key={a.slug}
                  active={draft.seller.includes(a.slug)}
                  onClick={() => toggleArr("seller", a.slug)}
                >
                  {a.name}
                </Chip>
              ))}
            </div>
          </Section>

          <Section title="Status">
            <div className="flex flex-col gap-4">
              <label className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink">Reserve met only</span>
                <Switch
                  checked={draft.reserveMet}
                  onCheckedChange={(v) => setDraft((d) => ({ ...d, reserveMet: !!v }))}
                />
              </label>
              <label className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink">Ending in 24 hours</span>
                <Switch
                  checked={draft.endingSoon}
                  onCheckedChange={(v) => setDraft((d) => ({ ...d, endingSoon: !!v }))}
                />
              </label>
            </div>
          </Section>
        </div>

        <footer className="flex items-center gap-3 border-t border-ink/10 bg-surface/60 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              const d = defaultFilters();
              setDraft(d);
              onChange(d);
            }}
            className="text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(draft);
              setOpen(false);
            }}
            className="ml-auto border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
          >
            Show {matchCount} of {totalCount}
          </button>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
