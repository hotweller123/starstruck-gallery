import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Star,
  Trash2,
  Palette,
  Users as UsersIcon,
  Gavel,
  Layers,
  TrendingUp,
  Pencil,
  Award,
  Archive,
  Copy,
  Flag,
  Hammer,
  Pause,
  PlayCircle,
  Tag,
} from "lucide-react";
import { DataTable, SectionHeader, StatusChip, TabBar } from "@/components/admin/primitives";
import {
  RecordSheet,
  type FieldDef,
  type OperationDef,
} from "@/components/admin/RecordSheet";
import { artworks as seedArtworks, type Artwork } from "@/data/artworks";
import { artists as seedArtists, type Artist } from "@/data/artists";
import { auctionLots as seedLots, type AuctionLot } from "@/data/auctions";
import { categories as seedCategories, type Category } from "@/data/categories";
import { fmtMoney } from "@/data/admin-mock";

export const Route = createFileRoute("/admin/exhibition")({
  component: ExhibitionAdmin,
});

type Tab = "artworks" | "artists" | "auctions" | "categories";

function ExhibitionAdmin() {
  const [tab, setTab] = useState<Tab>("artworks");
  const [q, setQ] = useState("");

  const [artworks, setArtworks] = useState<Artwork[]>(seedArtworks);
  const [artists, setArtists] = useState<Artist[]>(seedArtists);
  const [lots, setLots] = useState<AuctionLot[]>(seedLots);
  const [categories, setCategories] = useState<Category[]>(seedCategories);

  const totalValue = artworks.reduce((s, a) => s + a.price, 0);
  const avgPrice = artworks.length ? Math.round(totalValue / artworks.length) : 0;

  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader
        title="Exhibition"
        description="Curate the catalog: artworks, artists, live auctions and categories. Click any row to view, edit and run operations."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi icon={Palette} label="Artworks" value={artworks.length.toString()} />
        <Kpi icon={UsersIcon} label="Artists" value={artists.length.toString()} />
        <Kpi icon={Gavel} label="Live lots" value={lots.length.toString()} accent />
        <Kpi icon={Layers} label="Categories" value={categories.length.toString()} />
        <Kpi icon={TrendingUp} label="Avg. price" value={fmtMoney(avgPrice)} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabBar
          tabs={[
            { id: "artworks", label: "Artworks", count: artworks.length },
            { id: "artists", label: "Artists", count: artists.length },
            { id: "auctions", label: "Auctions", count: lots.length },
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

      {tab === "artworks" && (
        <ArtworksPanel q={q} rows={artworks} setRows={setArtworks} />
      )}
      {tab === "artists" && (
        <ArtistsPanel q={q} rows={artists} setRows={setArtists} artworks={artworks} />
      )}
      {tab === "auctions" && <AuctionsPanel q={q} rows={lots} setRows={setLots} />}
      {tab === "categories" && (
        <CategoriesPanel q={q} rows={categories} setRows={setCategories} artworks={artworks} />
      )}
    </div>
  );
}

/* ------------------------------ ARTWORKS ------------------------------ */

type ArtRow = Artwork & { id: string };

function ArtworksPanel({
  q,
  rows,
  setRows,
}: {
  q: string;
  rows: Artwork[];
  setRows: (next: Artwork[]) => void;
}) {
  const [selected, setSelected] = useState<ArtRow | null>(null);
  const ql = q.toLowerCase();
  const data: ArtRow[] = useMemo(
    () =>
      rows
        .filter(
          (a) =>
            !q ||
            a.title.toLowerCase().includes(ql) ||
            a.artist.toLowerCase().includes(ql) ||
            a.categoryLabel.toLowerCase().includes(ql),
        )
        .map((a) => ({ ...a, id: a.slug })),
    [rows, q, ql],
  );

  function patch(slug: string, p: Partial<Artwork>) {
    setRows(rows.map((a) => (a.slug === slug ? { ...a, ...p } : a)));
  }
  function remove(slug: string) {
    setRows(rows.filter((a) => a.slug !== slug));
  }
  function duplicate(slug: string) {
    const src = rows.find((a) => a.slug === slug);
    if (!src) return;
    setRows([{ ...src, slug: `${src.slug}-copy-${Date.now()}`, title: `${src.title} (copy)` }, ...rows]);
  }

  const fields: FieldDef<ArtRow>[] = [
    { key: "title", label: "Title", span: 2 },
    { key: "artist", label: "Artist" },
    { key: "categoryLabel", label: "Category" },
    { key: "medium", label: "Medium" },
    { key: "dimensions", label: "Dimensions" },
    { key: "year", label: "Year", kind: "number" },
    { key: "price", label: "Price", kind: "money" },
    {
      key: "highlight",
      label: "Highlighted",
      kind: "select",
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      render: (v) => (v ? "Yes" : "No"),
    },
    { key: "slug", label: "Slug", editable: false },
  ];

  return (
    <>
      <DataTable
        rows={data}
        onRowClick={(r) => setSelected(r)}
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
          {
            key: "cat",
            header: "Category",
            render: (r) => (
              <span className="inline-flex rounded bg-[var(--a-surface-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)]">
                {r.categoryLabel}
              </span>
            ),
          },
          { key: "year", header: "Year", render: (r) => <span className="a-mono text-xs text-[var(--a-muted)]">{r.year}</span> },
          {
            key: "price",
            header: "Price",
            render: (r) => <span className="a-mono text-xs font-bold text-[var(--a-fg)]">{fmtMoney(r.price)}</span>,
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <StatusChip value={r.highlight ? "active" : "review"} />,
          },
          {
            key: "actions",
            header: "",
            className: "w-[60px] text-right",
            rowLink: false,
            render: (r) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(r);
                }}
                className="grid size-7 place-items-center rounded border border-[var(--a-border)] text-[var(--a-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-fg)]"
              >
                <Pencil className="size-3.5" />
              </button>
            ),
          },
        ]}
      />
      <RecordSheet<ArtRow>
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        eyebrow="Artwork"
        title={selected?.title ?? ""}
        subtitle={selected ? `${selected.artist} · ${selected.categoryLabel}` : undefined}
        record={selected}
        fields={fields}
        onSave={(p) => {
          if (!selected) return;
          const next: Partial<Artwork> = { ...p };
          if (typeof p.highlight === "string") next.highlight = p.highlight === "true";
          patch(selected.slug, next);
          setSelected({ ...selected, ...next } as ArtRow);
        }}
        extra={
          selected && (
            <div>
              <img src={selected.image} alt={selected.title} className="aspect-square w-full rounded object-cover" />
              <p className="mt-3 text-xs text-[var(--a-muted)]">{selected.description ?? "No description."}</p>
            </div>
          )
        }
        operations={
          selected
            ? [
                {
                  id: "highlight",
                  label: selected.highlight ? "Remove highlight" : "Mark as highlight",
                  icon: Star,
                  tone: "primary",
                  onRun: () => {
                    patch(selected.slug, { highlight: !selected.highlight });
                    setSelected({ ...selected, highlight: !selected.highlight });
                  },
                },
                {
                  id: "hide",
                  label: "Hide from gallery",
                  icon: EyeOff,
                  onRun: () => alert("Hidden (mock)"),
                },
                {
                  id: "duplicate",
                  label: "Duplicate",
                  icon: Copy,
                  onRun: () => {
                    duplicate(selected.slug);
                    setSelected(null);
                  },
                },
                {
                  id: "list",
                  label: "List in auction",
                  icon: Hammer,
                  tone: "success",
                  onRun: () => alert(`Listed "${selected.title}" in next auction (mock).`),
                },
                {
                  id: "delete",
                  label: "Delete artwork",
                  icon: Trash2,
                  tone: "danger",
                  confirm: `Delete "${selected.title}"?`,
                  onRun: () => {
                    remove(selected.slug);
                    setSelected(null);
                  },
                },
              ] as OperationDef[]
            : undefined
        }
      />
    </>
  );
}

/* ------------------------------ ARTISTS ------------------------------ */

type ArtistRow = Artist & { id: string };

function ArtistsPanel({
  q,
  rows,
  setRows,
  artworks,
}: {
  q: string;
  rows: Artist[];
  setRows: (next: Artist[]) => void;
  artworks: Artwork[];
}) {
  const [selected, setSelected] = useState<ArtistRow | null>(null);
  const data: ArtistRow[] = rows
    .filter((a) => !q || a.name.toLowerCase().includes(q.toLowerCase()))
    .map((a) => ({ ...a, id: a.slug }));

  function patch(slug: string, p: Partial<Artist>) {
    setRows(rows.map((a) => (a.slug === slug ? { ...a, ...p } : a)));
  }

  const fields: FieldDef<ArtistRow>[] = [
    { key: "name", label: "Name", span: 2 },
    { key: "discipline", label: "Discipline" },
    { key: "location", label: "Location" },
    { key: "short", label: "Tagline", kind: "textarea", span: 2 },
    { key: "bio", label: "Bio", kind: "textarea", span: 2 },
    { key: "slug", label: "Slug", editable: false },
  ];

  return (
    <>
      <DataTable
        rows={data}
        onRowClick={(r) => setSelected(r)}
        columns={[
          {
            key: "name",
            header: "Artist",
            render: (r) => (
              <div className="flex items-center gap-3">
                <img src={r.portrait} alt={r.name} className="size-9 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-semibold text-[var(--a-fg)]">{r.name}</p>
                  <p className="text-[10px] text-[var(--a-muted)]">{r.discipline}</p>
                </div>
              </div>
            ),
          },
          { key: "loc", header: "Based in", render: (r) => <span className="text-xs text-[var(--a-fg-2)]">{r.location}</span> },
          {
            key: "works",
            header: "Works",
            render: (r) => (
              <span className="a-mono text-xs text-[var(--a-muted)]">
                {artworks.filter((a) => a.artistSlug === r.slug).length}
              </span>
            ),
          },
          { key: "status", header: "Status", render: () => <StatusChip value="active" /> },
        ]}
      />
      <RecordSheet<ArtistRow>
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        eyebrow="Artist"
        title={selected?.name ?? ""}
        subtitle={selected?.discipline}
        record={selected}
        fields={fields}
        onSave={(p) => {
          if (!selected) return;
          patch(selected.slug, p);
          setSelected({ ...selected, ...p } as ArtistRow);
        }}
        extra={
          selected && (
            <div className="text-center">
              <img src={selected.portrait} alt={selected.name} className="mx-auto aspect-square w-full rounded-full object-cover" />
              <p className="mt-3 text-xs text-[var(--a-muted)]">
                {artworks.filter((a) => a.artistSlug === selected.slug).length} works in catalog
              </p>
            </div>
          )
        }
        operations={
          selected
            ? [
                { id: "feature", label: "Feature artist", icon: Award, tone: "primary", onRun: () => alert(`Featured ${selected.name}.`) },
                { id: "spotlight", label: "Add to spotlight", icon: Star, onRun: () => alert("Added to spotlight (mock).") },
                { id: "archive", label: "Archive artist", icon: Archive, tone: "danger", confirm: `Archive ${selected.name}?`, onRun: () => { setRows(rows.filter((a) => a.slug !== selected.slug)); setSelected(null); } },
              ]
            : undefined
        }
      />
    </>
  );
}

/* ------------------------------ AUCTIONS ------------------------------ */

type LotRow = AuctionLot & { id: string; status?: string };

function AuctionsPanel({
  q,
  rows,
  setRows,
}: {
  q: string;
  rows: AuctionLot[];
  setRows: (next: AuctionLot[]) => void;
}) {
  const [selected, setSelected] = useState<LotRow | null>(null);
  const data: LotRow[] = rows
    .filter((l) => !q || l.title.toLowerCase().includes(q.toLowerCase()) || l.lotNumber.includes(q))
    .map((l) => ({ ...l, id: l.slug, status: (l as unknown as { status?: string }).status ?? "active" }));

  function patch(slug: string, p: Partial<AuctionLot>) {
    setRows(rows.map((l) => (l.slug === slug ? { ...l, ...p } : l)));
  }

  const fields: FieldDef<LotRow>[] = [
    { key: "title", label: "Lot title", span: 2 },
    { key: "lotNumber", label: "Lot #" },
    { key: "categoryLabel", label: "Category" },
    { key: "medium", label: "Medium" },
    { key: "dimensions", label: "Dimensions" },
    { key: "year", label: "Year", kind: "number" },
    { key: "estimateLow" as keyof LotRow, label: "Estimate low", kind: "money" },
    { key: "estimateHigh" as keyof LotRow, label: "Estimate high", kind: "money" },
    { key: "currentBid" as keyof LotRow, label: "Current bid", kind: "money" },
    { key: "reservePrice" as keyof LotRow, label: "Reserve", kind: "money" },
    { key: "condition", label: "Condition" },
    { key: "provenance", label: "Provenance", kind: "textarea", span: 2 },
    { key: "description", label: "Description", kind: "textarea", span: 2 },
  ];

  return (
    <>
      <DataTable
        rows={data}
        onRowClick={(r) => setSelected(r)}
        columns={[
          {
            key: "title",
            header: "Lot",
            render: (r) => (
              <div className="flex items-center gap-3">
                {r.images?.[0] && <img src={r.images[0]} alt={r.title} className="size-10 rounded object-cover" />}
                <div>
                  <p className="text-xs font-semibold text-[var(--a-fg)]">{r.title}</p>
                  <p className="a-mono text-[10px] text-[var(--a-muted)]">Lot {r.lotNumber}</p>
                </div>
              </div>
            ),
          },
          {
            key: "estimate",
            header: "Estimate",
            render: (r) => (
              <span className="a-mono text-xs text-[var(--a-fg-2)]">
                {fmtMoney(r.estimateLow)} – {fmtMoney(r.estimateHigh)}
              </span>
            ),
          },
          {
            key: "bid",
            header: "Current bid",
            render: (r) => <span className="a-mono text-xs font-bold text-[var(--a-accent)]">{fmtMoney(r.currentBid ?? 0)}</span>,
          },
          { key: "status", header: "Status", render: (r) => <StatusChip value={r.status ?? "active"} /> },
        ]}
      />
      <RecordSheet<LotRow>
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        eyebrow={`Lot ${selected?.lotNumber ?? ""}`}
        title={selected?.title ?? ""}
        subtitle={selected ? `${selected.categoryLabel} · ${fmtMoney(selected.currentBid ?? 0)}` : undefined}
        record={selected}
        fields={fields}
        onSave={(p) => {
          if (!selected) return;
          patch(selected.slug, p);
          setSelected({ ...selected, ...p } as LotRow);
        }}
        extra={
          selected?.images?.[0] && (
            <img src={selected.images[0]} alt={selected.title} className="aspect-square w-full rounded object-cover" />
          )
        }
        operations={
          selected
            ? [
                { id: "open", label: "Open bidding", icon: PlayCircle, tone: "success", onRun: () => { patch(selected.slug, { status: "active" } as Partial<AuctionLot>); setSelected({ ...selected, status: "active" }); } },
                { id: "pause", label: "Pause lot", icon: Pause, onRun: () => { patch(selected.slug, { status: "pending" } as Partial<AuctionLot>); setSelected({ ...selected, status: "pending" }); } },
                { id: "close", label: "Close & award winner", icon: Hammer, tone: "primary", confirm: "Close this lot and award current high bidder?", onRun: () => alert("Lot closed (mock).") },
                { id: "withdraw", label: "Withdraw lot", icon: Archive, tone: "danger", confirm: "Withdraw this lot from auction?", onRun: () => { setRows(rows.filter((l) => l.slug !== selected.slug)); setSelected(null); } },
                { id: "flag", label: "Flag for review", icon: Flag, onRun: () => alert("Flagged (mock).") },
              ]
            : undefined
        }
      />
    </>
  );
}

/* ------------------------------ CATEGORIES ------------------------------ */

type CatRow = Category & { id: string };

function CategoriesPanel({
  q,
  rows,
  setRows,
  artworks,
}: {
  q: string;
  rows: Category[];
  setRows: (next: Category[]) => void;
  artworks: Artwork[];
}) {
  const [selected, setSelected] = useState<CatRow | null>(null);
  const data: CatRow[] = rows
    .filter((c) => !q || c.label.toLowerCase().includes(q.toLowerCase()))
    .map((c) => ({ ...c, id: c.slug }));

  function patch(slug: string, p: Partial<Category>) {
    setRows(rows.map((c) => (c.slug === slug ? { ...c, ...p } : c)));
  }

  const fields: FieldDef<CatRow>[] = [
    { key: "label", label: "Label", span: 2 },
    { key: "slug", label: "Slug", editable: false },
  ];

  return (
    <>
      <DataTable
        rows={data}
        onRowClick={(r) => setSelected(r)}
        columns={[
          {
            key: "label",
            header: "Category",
            render: (r) => (
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--a-fg)]">
                <Tag className="size-3.5 text-[var(--a-accent)]" /> {r.label}
              </span>
            ),
          },
          { key: "slug", header: "Slug", render: (r) => <span className="a-mono text-xs text-[var(--a-muted)]">{r.slug}</span> },
          {
            key: "count",
            header: "Works",
            render: (r) => (
              <span className="a-mono text-xs text-[var(--a-fg-2)]">
                {artworks.filter((a) => a.category === (r.slug as Artwork["category"])).length}
              </span>
            ),
          },
        ]}
      />
      <RecordSheet<CatRow>
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        eyebrow="Category"
        title={selected?.label ?? ""}
        record={selected}
        fields={fields}
        onSave={(p) => {
          if (!selected) return;
          patch(selected.slug, p);
          setSelected({ ...selected, ...p } as CatRow);
        }}
        operations={
          selected
            ? [
                { id: "rename", label: "Bulk re-tag works", icon: Pencil, onRun: () => alert("Bulk retag started (mock).") },
                { id: "delete", label: "Delete category", icon: Trash2, tone: "danger", confirm: `Delete category "${selected.label}"? Works will be uncategorised.`, onRun: () => { setRows(rows.filter((c) => c.slug !== selected.slug)); setSelected(null); } },
              ]
            : undefined
        }
      />
    </>
  );
}

/* --------------------------------- KPI --------------------------------- */

function Kpi({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Palette;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`a-card-elev p-3.5 ${accent ? "ring-1 ring-[var(--a-accent)]/40" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="a-eyebrow">{label}</p>
        <Icon className={`size-4 ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-muted)]"}`} />
      </div>
      <p className={`font-display mt-1.5 text-xl font-extrabold tracking-tight ${accent ? "text-[var(--a-accent)]" : "text-[var(--a-fg)]"}`}>
        {value}
      </p>
    </div>
  );
}

// Suppress unused imports warning for icons referenced inline above
void Plus;
void Eye;
