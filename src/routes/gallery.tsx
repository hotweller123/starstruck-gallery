import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { artworks as mockArtworks, filterOptions, Artwork } from "@/data/artworks";
import { MasonryGallery } from "@/components/site/MasonryGallery";
import { CategoryChips } from "@/components/site/CategoryChips";
import { PageHeader } from "@/components/site/PageHeader";
import { FilterDrawer } from "@/components/site/FilterDrawer";
import { ActiveFilterChips } from "@/components/site/ActiveFilterChips";
import { makeDefaultFilters, type Filters } from "@/components/site/filters-types";
import { useArtworkContext } from "@/lib/useMetArtworksStore";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — Aethelred" },
      {
        name: "description",
        content:
          "Browse the full exhibition with refined filters across price, size, medium, theme, technique, country and colour.",
      },
    ],
  }),
});

function applyFilters(f: Filters, artworks: Artwork[]) {
  return artworks.filter((a) => {
    if (a.price < f.priceMin || a.price > f.priceMax) return false;
    if (f.category.length && !f.category.some((fc) => fc == a.category)) return false;
    if (f.size.length && !f.size.includes(a.sizeCategory)) return false;
    if (f.orientation.length && !f.orientation.includes(a.orientation)) return false;
    if (f.medium.length && !f.medium.includes(a.medium)) return false;
    if (f.theme.length && !f.theme.includes(a.theme)) return false;
    if (f.style.length && !f.style.includes(a.style)) return false;
    if (f.technique.length && !f.technique.includes(a.technique)) return false;
    if (f.country.length && !f.country.includes(a.country)) return false;
    if (f.color.length && !f.color.includes(a.dominantColor)) return false;
    if (f.highlight && !a.highlight) return false;
    return true;
  });
}

function GalleryPage() {
  const [filters, setFilters] = useState<Filters>(() =>
    makeDefaultFilters(filterOptions.priceMin, filterOptions.priceMax),
  );

  const { artworks } = useArtworkContext();
  const filtered = useMemo(() => applyFilters(filters, artworks), [filters, artworks]);

  return (
    <>
      <PageHeader
        eyebrow="The exhibition"
        title="All Works"
        description="The full hang of the current exhibition. Filter by mode of design, price, medium, theme, or any combination."
      />

      <div className="mx-auto max-w-7xl px-6 pb-6">
        <CategoryChips active="all" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <ActiveFilterChips value={filters} onChange={setFilters} />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] uppercase tracking-[0.22em] text-detail">
            {filtered.length} {filtered.length === 1 ? "work" : "works"}
          </span>
          <FilterDrawer
            value={filters}
            onChange={setFilters}
            totalCount={artworks.length}
            matchCount={filtered.length}
          />
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-32 pt-6">
        <MasonryGallery artworks={filtered} />
      </section>
    </>
  );
}
