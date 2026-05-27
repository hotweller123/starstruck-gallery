import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Artwork } from "@/data/artworks";
import { formatPrice } from "@/data/artworks";

interface Props {
  artworks: Artwork[];
  eyebrow?: string;
  title: string;
  link?: { to: "/gallery"; label: string };
}

export function ImageCarousel({ artworks, eyebrow, title, link }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const sync = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("select", sync);
    embla.on("reInit", sync);
  }, [embla, sync]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between gap-6 border-b border-ink/10 pb-6">
        <div>
          {eyebrow && (
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-detail">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl italic md:text-4xl">{title}</h2>
        </div>
        <div className="flex items-center gap-4">
          {link && (
            <Link
              to={link.to}
              className="hidden text-[11px] uppercase tracking-[0.22em] text-detail hover:text-ink md:inline-block"
            >
              {link.label} &rarr;
            </Link>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => embla?.scrollPrev()}
              className="border border-ink/30 p-2 text-ink transition-opacity disabled:opacity-30 hover:bg-ink hover:text-canvas"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => embla?.scrollNext()}
              className="border border-ink/30 p-2 text-ink transition-opacity disabled:opacity-30 hover:bg-ink hover:text-canvas"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {artworks.map((a) => (
            <Link
              key={a.slug}
              to="/artworks/$slug"
              params={{ slug: a.slug }}
              className="group block min-w-0 flex-[0_0_75%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <img
                  src={a.image}
                  alt={`${a.title} by ${a.artist}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl italic leading-tight">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-detail">
                    {a.artist}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-ink/80">
                  {formatPrice(a.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
