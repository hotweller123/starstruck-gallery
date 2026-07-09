import { sponsors } from "@/data/sponsors";

export function Sponsors() {
  return (
    <section className="border-y border-ink/10 bg-surface/60">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex flex-col items-baseline justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-detail">
              In partnership with
            </p>
<<<<<<< HEAD
            <h2 className="font-display text-3xl italic md:text-4xl">
              Our patrons &amp; sponsors
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-detail">
            A short list of independent makers and houses whose materials,
            craft and values support every exhibition we mount.
=======
            <h2 className="font-display text-3xl italic md:text-4xl">Our patrons &amp; sponsors</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-detail">
            A short list of independent makers and houses whose materials, craft and values support
            every exhibition we mount.
>>>>>>> 49a1b1e (updated)
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((s) => (
            <li key={s.name} className="flex flex-col gap-3 bg-canvas p-7">
<<<<<<< HEAD
              <span className="text-[10px] uppercase tracking-[0.22em] text-clay">
                {s.tier}
              </span>
=======
              <span className="text-[10px] uppercase tracking-[0.22em] text-clay">{s.tier}</span>
>>>>>>> 49a1b1e (updated)
              <h3 className="font-display text-2xl italic">{s.name}</h3>
              <p className="text-sm leading-relaxed text-detail">{s.blurb}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
