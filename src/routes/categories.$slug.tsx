import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory } from "@/data/categories";
import { getArtworksByCategory, type CategorySlug } from "@/data/artworks";
import { MasonryGallery } from "@/components/site/MasonryGallery";
import { CategoryChips } from "@/components/site/CategoryChips";
import { PageHeader } from "@/components/site/PageHeader";
<<<<<<< HEAD
=======
import { useArtworkContext } from "@/lib/useMetArtworksStore";
import { useMemo } from "react";
>>>>>>> 49a1b1e (updated)

export const Route = createFileRoute("/categories/$slug")({
  component: CategoryPage,
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.label ?? "Category"} — Aethelred` },
      {
        name: "description",
        content:
          loaderData?.category.description ??
          "Browse this mode of design within the current exhibition.",
      },
    ],
  }),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
<<<<<<< HEAD
  const works = getArtworksByCategory(category.slug as CategorySlug);
=======
  const { artworks } = useArtworkContext();

  const works = useMemo(
    () => getArtworksByCategory(category.slug as CategorySlug, artworks),
    [artworks, category],
  );
>>>>>>> 49a1b1e (updated)

  return (
    <>
      <PageHeader
        eyebrow="Mode of design"
        title={category.label}
        description={category.description}
      />
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <CategoryChips active={category.slug as CategorySlug} />
      </div>
      <section className="mx-auto max-w-7xl px-6 pb-32 pt-10">
        <MasonryGallery artworks={works} />
      </section>
    </>
  );
}
