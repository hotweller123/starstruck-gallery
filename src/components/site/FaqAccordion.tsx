import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

export function FaqAccordion() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.6fr] lg:gap-24">
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-detail">
            Frequently asked
          </p>
          <h2 className="font-display text-4xl italic leading-tight md:text-5xl">
            Questions we hear often, answered plainly.
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-b border-ink/10"
            >
              <AccordionTrigger className="py-6 text-left font-display text-xl italic text-ink hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-relaxed text-detail">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
