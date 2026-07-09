import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { HistoryTimeline } from "@/components/site/HistoryTimeline";
import { PartnerReasons } from "@/components/site/PartnerReasons";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const principles = [
  {
    q: "One exhibition at a time",
    a: "We never overlap shows. Each hang is given a full season to be seen. The catalogue, the printed broadsheet and the online edition all belong to the same body of work.",
  },
  {
    q: "Small editions, slow release",
    a: "Editioned work is released in runs of five to twelve. We don't print on demand. When an edition closes, it closes — provenance matters more than reach.",
  },
  {
    q: "Materials with a memory",
    a: "We favour artists who work with materials that carry their own history — wood-fired clay, linen woven in the same mill since 1894, indigo dyed three times, paper made by hand.",
  },
  {
    q: "A small audience, carefully kept",
    a: "We do not optimise for traffic. The seasonal letter goes to roughly two thousand collectors, curators, architects and editors. Joining it is by introduction.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About the gallery" title="A quiet room for slow work." />
      <section className="mx-auto grid max-w-7xl gap-16 px-6 pb-20 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div className="space-y-6 text-lg leading-relaxed text-ink/80">
          <p>
            Aethelred is a curated digital exhibition space, founded on the belief that the
            appreciation of contemporary art deserves more quietness than the internet usually
            allows.
          </p>
          <p>
            We hang one exhibition at a time, for one season at a time. Each show gathers a small
            circle of artists working at the slow end of their disciplines &mdash; ceramicists who
            fire one vessel at a time, photographers who wait for a single shaft of afternoon light,
            painters who measure their year in canvases.
          </p>
          <p>
            The site is intentionally restrained: a serif headline, a quiet grid, a single warm
            accent. The work asks for room, and we try to give it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px self-start bg-ink/10">
          {[
            { k: "Founded", v: "2019" },
            { k: "Exhibitions per year", v: "Four" },
            { k: "Artists in rotation", v: "Twelve" },
            { k: "Editions per year", v: "Always small" },
            { k: "Cities", v: "Antwerp · Kyoto · Lisbon" },
            { k: "Printed catalogue", v: "Letterpress, ed. 200" },
          ].map((r) => (
            <div key={r.k} className="flex items-baseline justify-between bg-canvas p-6">
              <span className="text-[11px] uppercase tracking-[0.22em] text-detail">{r.k}</span>
              <span className="font-display text-2xl italic">{r.v}</span>
            </div>
          ))}
        </div>
      </section>

      <HistoryTimeline />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-detail">
              Our principles
            </p>
            <h2 className="font-display text-4xl italic leading-tight md:text-5xl">
              Four rules we hold to, season after season.
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {principles.map((p, i) => (
              <AccordionItem key={i} value={`p-${i}`} className="border-b border-ink/10">
                <AccordionTrigger className="py-6 text-left font-display text-xl italic text-ink hover:no-underline">
                  {p.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-detail">
                  {p.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <PartnerReasons />

      <FaqAccordion />
    </>
  );
}
