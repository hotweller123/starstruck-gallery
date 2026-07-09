import { history } from "@/data/history";

export function HistoryTimeline() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 border-b border-ink/10 pb-6">
<<<<<<< HEAD
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-detail">
          Origin
        </p>
        <h2 className="font-display text-3xl italic md:text-4xl">
          A short history of the gallery
        </h2>
=======
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-detail">Origin</p>
        <h2 className="font-display text-3xl italic md:text-4xl">A short history of the gallery</h2>
>>>>>>> 49a1b1e (updated)
      </div>
      <ol className="grid grid-cols-1 gap-px bg-ink/10 md:grid-cols-2 lg:grid-cols-4">
        {history.map((m) => (
          <li key={m.year} className="flex flex-col gap-3 bg-canvas p-8">
<<<<<<< HEAD
            <span className="font-display text-5xl italic text-clay">
              {m.year}
            </span>
=======
            <span className="font-display text-5xl italic text-clay">{m.year}</span>
>>>>>>> 49a1b1e (updated)
            <h3 className="font-display text-2xl italic">{m.title}</h3>
            <p className="text-sm leading-relaxed text-detail">{m.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
