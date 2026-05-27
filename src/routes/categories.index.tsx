import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import { artworks } from "@/data/artworks";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/categories/")({
  component: CategoriesIndex,
  head: () => ({
    meta: [
      { title: "Categories — Aethelred" },
      {
        name: "description",
        content:
          "Eight modes of design: abstract, figurative, minimalism, sculpture, photography, digital, mixed media and ceramics.",
      },
    ],
  }),
});

function CategoriesIndex() {
  return (
    <>
      <PageHeader
        eyebrow="Browse by"
        title="Modes of Design"
        description="The works in this exhibition are arranged into eight modes — each a different relationship between material, gesture and intent."
      />
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="grid grid-cols-1 gap-px bg-ink/10 md:grid-cols-2">
          {categories.map((c) => {
            const count = artworks.filter((a) => a.category === c.slug).length;
            return (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col gap-4 bg-canvas p-10 transition-colors hover:bg-surface"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-detail">
                    {String(categories.indexOf(c) + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-detail">
                    {count} {count === 1 ? "work" : "works"}
                  </span>
                </div>
                <h2 className="font-display text-5xl italic">{c.label}</h2>
                <p className="max-w-md text-sm leading-relaxed text-detail">
                  {c.description}
                </p>
                <span className="mt-4 text-[11px] uppercase tracking-[0.22em] text-ink group-hover:text-clay">
                  View works &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
