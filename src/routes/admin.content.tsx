import { createFileRoute } from "@tanstack/react-router";
import { Edit3, GripVertical, Plus } from "lucide-react";
import { BentoCard, SectionHeader } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/content")({
  component: ContentAdmin,
});

const heroSlides = [
  { id: "h1", title: "Quiet Tide — Spring 2026", caption: "Featured collection · 14 works", img: "/og-image.jpg" },
  { id: "h2", title: "Live now: Marble Hour", caption: "Auction ends in 4h", img: "/og-image.jpg" },
  { id: "h3", title: "New: 12 emerging artists", caption: "Curated by the editors", img: "/og-image.jpg" },
];

const faqs = [
  { id: "f1", q: "How does the wallet work?", a: "Top up via card or bank, then bid or buy instantly." },
  { id: "f2", q: "Are commissions refundable?", a: "Yes within 14 days of purchase under our terms." },
  { id: "f3", q: "Can I list my own work?", a: "Apply via the Sell page; review takes 2–3 days." },
];

const sponsors = ["House of Eilean", "Mariposa Studio", "Northbrand", "Atelier Vex"];

function ContentAdmin() {
  return (
    <div className="mx-auto max-w-[1440px]">
      <SectionHeader
        title="Site content"
        description="Edit homepage hero, FAQs, sponsor list and footer copy."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <BentoCard
          className="lg:col-span-7"
          eyebrow="Homepage"
          title="Hero slides"
          action={<AddBtn />}
          delay={0}
        >
          <ul className="space-y-2">
            {heroSlides.map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] p-3">
                <GripVertical className="size-4 shrink-0 text-[var(--a-faint)]" />
                <div className="size-12 shrink-0 rounded bg-[var(--a-surface-2)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[var(--a-fg)]">{s.title}</p>
                  <p className="truncate text-[10px] text-[var(--a-muted)]">{s.caption}</p>
                </div>
                <button className="grid size-7 place-items-center rounded border border-[var(--a-border)] text-[var(--a-muted)] hover:text-[var(--a-fg)]">
                  <Edit3 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </BentoCard>

        <BentoCard
          className="lg:col-span-5"
          eyebrow="Trust"
          title="Sponsors"
          action={<AddBtn />}
          delay={0.05}
        >
          <ul className="grid grid-cols-2 gap-2">
            {sponsors.map((s) => (
              <li key={s} className="flex items-center justify-between rounded-md border border-[var(--a-border)] bg-[var(--a-bg-2)] px-3 py-2.5 text-xs">
                <span className="font-semibold text-[var(--a-fg)]">{s}</span>
                <button className="text-[10px] uppercase tracking-wider text-[var(--a-muted)] hover:text-[var(--a-fg)]">Edit</button>
              </li>
            ))}
          </ul>
        </BentoCard>

        <BentoCard
          className="lg:col-span-12"
          eyebrow="Help center"
          title="Frequently asked"
          action={<AddBtn />}
          delay={0.1}
        >
          <ul className="divide-y divide-[var(--a-border)]">
            {faqs.map((f) => (
              <li key={f.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--a-fg)]">{f.q}</p>
                  <p className="mt-0.5 text-xs text-[var(--a-muted)]">{f.a}</p>
                </div>
                <button className="shrink-0 rounded border border-[var(--a-border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </BentoCard>
      </div>
    </div>
  );
}

function AddBtn() {
  return (
    <button className="inline-flex items-center gap-1 rounded border border-[var(--a-border-hi)] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--a-fg-2)] hover:bg-[var(--a-surface-2)]">
      <Plus className="size-3" /> Add
    </button>
  );
}
