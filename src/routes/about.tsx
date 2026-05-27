import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Aethelred" },
      {
        name: "description",
        content:
          "Aethelred is a quiet digital gallery dedicated to slow, considered work from a small circle of contemporary artists.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About the gallery"
        title="A quiet room for slow work."
      />
      <section className="mx-auto grid max-w-7xl gap-16 px-6 pb-32 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div className="space-y-6 text-lg leading-relaxed text-ink/80">
          <p>
            Aethelred is a curated digital exhibition space, founded on the
            belief that the appreciation of contemporary art deserves more
            quietness than the internet usually allows.
          </p>
          <p>
            We hang one exhibition at a time, for one season at a time. Each
            show gathers a small circle of artists working at the slow end of
            their disciplines &mdash; ceramicists who fire one vessel at a
            time, photographers who wait for a single shaft of afternoon light,
            painters who measure their year in canvases.
          </p>
          <p>
            The site is intentionally restrained: a serif headline, a quiet
            grid, a single warm accent. The work asks for room, and we try to
            give it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-ink/10 self-start">
          {[
            { k: "Founded", v: "2024" },
            { k: "Exhibitions per year", v: "Four" },
            { k: "Artists in rotation", v: "Twelve" },
            { k: "Editions", v: "Always small" },
          ].map((r) => (
            <div
              key={r.k}
              className="flex items-baseline justify-between bg-canvas p-6"
            >
              <span className="text-[11px] uppercase tracking-[0.22em] text-detail">
                {r.k}
              </span>
              <span className="font-display text-2xl italic">{r.v}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
