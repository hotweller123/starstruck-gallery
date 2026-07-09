import { Link } from "@tanstack/react-router";
import { partnerBenefits } from "@/data/partners-benefits";

export function PartnerReasons() {
  return (
    <section className="bg-ink text-canvas">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:py-32 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-canvas/55">
            Why partner with Aethelred
          </p>
          <h2 className="font-display text-4xl italic leading-[1.02] md:text-6xl">
            A small audience,
            <br />
            carefully kept.
          </h2>
          <p className="mt-8 max-w-md text-canvas/75 leading-relaxed">
            We work with a deliberately small circle of partners — makers, houses, journals and
            institutions whose craft is continuous with the work we hang.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-block border border-canvas/40 px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:border-canvas hover:bg-canvas hover:text-ink"
          >
            Begin a conversation
          </Link>
        </div>

        <ol className="grid grid-cols-1 gap-px bg-canvas/15 sm:grid-cols-2">
          {partnerBenefits.map((p) => (
            <li key={p.no} className="flex flex-col gap-4 bg-ink p-8">
              <span className="font-display text-3xl italic text-clay">{p.no}</span>
              <h3 className="font-display text-2xl italic">{p.title}</h3>
              <p className="text-sm leading-relaxed text-canvas/70">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
