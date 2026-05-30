import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Eye, EyeOff, Star, Trash2, Palette, Users as UsersIcon, Gavel, Layers, TrendingUp, Edit3 } from "lucide-react";
import {
  BentoCard,
  DataTable,
  SectionHeader,
  StatusChip,
  TabBar,
} from "@/components/admin/primitives";
import { artworks } from "@/data/artworks";
import { artists } from "@/data/artists";
import { auctionLots } from "@/data/auctions";
import { categories } from "@/data/categories";
import { fmtMoney } from "@/data/admin-mock";

export const Route = createFileRoute("/admin/exhibition")({
  component: ExhibitionAdmin,
});

type Tab = "artworks" | "artists" | "auctions" | "categories";

function ExhibitionAdmin() {
  const [tab, setTab] = useState<Tab>("artworks");
  const [q, setQ] = useState("");

  const totalValue = artworks.reduce((s, a) => s + a.price, 0);
  const avgPrice = Math.round(totalValue / artworks.length);
  const liveLots = auctionLots.length;

  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader
        title="Exhibition"
        description="Manage artworks, artists, live auctions and category taxonomy across the gallery."
        action={
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md border border-[var(--a-border)] bg-[var(--a-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
              <Edit3 className="size-3.5" /> Bulk edit
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-[var(--a-accent)] px-3 py-1.5 text-xs font-bold text-[var(--a-accent-ink)] hover:bg-[var(--a-accent-hi)]">
              <Plus className="size-3.5" /> New {tab.slice(0, -1)}
            </button>
          </div>
        }
      />

      {/* KPI strip */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <ExhibitKpi icon={Palette}    label="Artworks"     value={artworks.length.toString()} />
        <ExhibitKpi icon={UsersIcon}  label="Artists"      value={artists.length.toString()} />
        <ExhibitKpi icon={Gavel}      label="Live lots"    value={liveLots.toString()} accent />
        <ExhibitKpi icon={Layers}     label="Categories"   value={categories.length.toString()} />
        <ExhibitKpi icon={TrendingUp} label="Avg. price"   value={fmtMoney(avgPrice)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabBar
          tabs={[
            { id: "artworks", label: "Artworks", count: artworks.length },
            { id: "artists", label: "Artists", count: artists.length },
            { id: "auctions", label: "Auctions", count: auctionLots.length },
            { id: "categories", label: "Categories", count: categories.length },
          ]}
          active={tab}
          onChange={(id) => setTab(id as Tab)}
        />
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--a-faint)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${tab}…`}
            className="h-9 w-64 rounded-md border border-[var(--a-border)] bg-[var(--a-input)] pl-9 pr-3 text-sm text-[var(--a-fg)] placeholder:text-[var(--a-faint)] outline-none focus:border-[var(--a-border-hi)]"
          />
        </div>
      </div>

      {tab === "artworks" && <ArtworksTable q={q} />}
      {tab === "artists" && <ArtistsTable q={q} />}
      {tab === "auctions" && <AuctionsTable q={q} />}
      {tab === "categories" && <CategoriesTable q={q} />}
    </div>
  );
}

function ArtworksTable({ q }: { q: string }) {
  const rows = useMemo(() => {
    const ql = q.toLowerCase();
    return artworks
      .filter((a) => !q || a.title.toLowerCase().includes(ql) || a.artist.toLowerCase().includes(ql))
      .slice(0, 40)
      .map((a) => ({ ...a, id: a.slug }));
  }, [q]);

  return (
    <DataTable
      rows={rows}
      columns={[
        {
          key: "art",
          header: "Artwork",
          render: (r) => (
            <div className="flex items-center gap-3">
              <img src={r.image} alt={r.title} className="size-10 rounded object-cover" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--a-fg)]">{r.title}</p>
                <p className="truncate text-[10px] text-[var(--a-muted)]">{r.artist}</p>
              </div>
            </div>
          ),
        },
        { key: "cat", header: "Category", render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{r.categoryLabel}</span> },
        { key: "year", header: "Year", render: (r) => <span className="a-mono text-xs text-[var(--a-muted)]">{r.year}</span> },
        { key: "price", header: "Price", render: (r) => <span className="a-mono text-xs font-bold text-[var(--a-fg)]">{fmtMoney(r.price)}</span> },
        { key: "status", header: "Status", render: () => <StatusChip value="active" /> },
        {
          key: "actions",
          header: "",
          className: "w-[120px] text-right",
          render: () => (
            <div className="flex justify-end gap-1">
              <IconBtn icon={Star} />
              <IconBtn icon={EyeOff} />
              <IconBtn icon={Trash2} danger />
            </div>
          ),
        },
      ]}
    />
  );
}

function ArtistsTable({ q }: { q: string }) {
  const rows = artists
    .filter((a) => !q || a.name.toLowerCase().includes(q.toLowerCase()))
    .map((a) => ({ ...a, id: a.slug }));
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: "name", header: "Artist", render: (r) => <span className="text-xs font-semibold text-[var(--a-fg)]">{r.name}</span> },
        { key: "loc", header: "Based in", render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{(r as any).location ?? "—"}</span> },
        { key: "works", header: "Works", render: (r) => <span className="a-mono text-xs text-[var(--a-muted)]">{artworks.filter((a) => a.artistSlug === r.slug).length}</span> },
        { key: "status", header: "Status", render: () => <StatusChip value="active" /> },
        {
          key: "actions",
          header: "",
          className: "w-[100px] text-right",
          render: () => (
            <div className="flex justify-end gap-1">
              <IconBtn icon={Eye} />
              <IconBtn icon={Trash2} danger />
            </div>
          ),
        },
      ]}
    />
  );
}

function AuctionsTable({ q }: { q: string }) {
  const rows = auctionLots
    .filter((l) => !q || l.title.toLowerCase().includes(q.toLowerCase()))
    .map((l) => ({ ...l, id: l.slug }));
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: "title", header: "Lot", render: (r) => <span className="text-xs font-semibold text-[var(--a-fg)]">{r.title}</span> },
        { key: "seller", header: "Seller", render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{(r as any).sellerName ?? (r as any).sellerSlug}</span> },
        { key: "bid", header: "Current bid", render: (r) => <span className="a-mono text-xs font-bold text-[var(--a-accent)]">{fmtMoney((r as any).currentBid ?? 0)}</span> },
        { key: "status", header: "Status", render: () => <StatusChip value="active" /> },
      ]}
    />
  );
}

function CategoriesTable({ q }: { q: string }) {
  const rows = categories
    .filter((c) => !q || c.label.toLowerCase().includes(q.toLowerCase()))
    .map((c) => ({ ...c, id: c.slug }));
  return (
    <DataTable
      rows={rows}
      columns={[
        { key: "label", header: "Category", render: (r) => <span className="text-xs font-semibold text-[var(--a-fg)]">{r.label}</span> },
        { key: "slug", header: "Slug", render: (r) => <span className="a-mono text-xs text-[var(--a-muted)]">{r.slug}</span> },
        { key: "count", header: "Works", render: (r) => <span className="a-mono text-xs text-[var(--a-fg-2)]">{artworks.filter((a) => a.category === (r.slug as any)).length}</span> },
      ]}
    />
  );
}

function IconBtn({ icon: Icon, danger }: { icon: typeof Star; danger?: boolean }) {
  return (
    <button
      className={`grid size-7 place-items-center rounded border border-[var(--a-border)] transition hover:border-[var(--a-border-hi)] ${
        danger ? "text-[var(--a-neg)] hover:bg-[var(--a-neg)]/10" : "text-[var(--a-muted)] hover:text-[var(--a-fg)] hover:bg-[var(--a-surface-2)]"
      }`}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

function ExhibitKpi({ icon: Icon, label, value, accent }: { icon: typeof Palette; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`a-card-elev p-3.5 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="a-eyebrow">{label}</p>
        <Icon className={`size-4 ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-muted)]"}`} />
      </div>
      <p className={`font-display mt-1.5 text-xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`}>{value}</p>
    </div>
  );
}
