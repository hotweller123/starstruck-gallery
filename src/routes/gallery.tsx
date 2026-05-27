import { createFileRoute } from "@tanstack/react-router";
import { artworks } from "@/data/artworks";
import { MasonryGallery } from "@/components/site/MasonryGallery";
import { CategoryChips } from "@/components/site/CategoryChips";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — Aethelred" },
      {
        name: "description",
        content:
          "Browse the full exhibition: twelve contemporary works across painting, sculpture, photography, ceramics and digital media.",
      },
    ],
  }),
});

function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="The exhibition"
        title="All Works"
        description="The full hang of the current exhibition, presented as a quiet vertical scroll. Filter by mode of design to narrow the view."
      />
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <CategoryChips active="all" />
      </div>
      <section className="mx-auto max-w-7xl px-6 pb-32 pt-10">
        <MasonryGallery artworks={artworks} />
      </section>
    </>
  );
}
