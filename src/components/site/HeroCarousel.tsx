import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { SmartImage } from "./SmartImage";
import art09 from "@/assets/art-09.jpg";
import art10 from "@/assets/art-10.jpg";
import art01 from "@/assets/art-01.jpg";
import art03 from "@/assets/art-03.jpg";
import { useArtworkContext } from "@/lib/useMetArtworksStore";

const slides = [
  {
    image: art09,
    kicker: "Exhibition No. 12 — Spring 2026",
    title: "The Quiet Edge of Form",
    sub: "A curated dialogue between permanence and the ephemeral — twelve works in clay, linen, light and code.",
  },
  {
    image: art10,
    kicker: "Now showing",
    title: "Rooms for Slow Looking",
    sub: "Sachi Tanaka's six-hour exposures and the small architectures of the everyday.",
  },
  {
    image: art01,
    kicker: "Permanent rotation",
    title: "Painting Without Hurry",
    sub: "Søren Kjeldsen's linen studies — a single canvas may take half a year to find its surface.",
  },
  {
    image: art03,
    kicker: "Photography",
    title: "Architecture of Light",
    sub: "Marcus Thorne's photographs treat afternoon shadow as a kind of language.",
  },
];

export function HeroCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 36 });
  const [index, setIndex] = useState(0);

  const { chicagoArtworks } = useArtworkContext();

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    const id = setInterval(() => embla.scrollNext(), 6500);
    return () => {
      clearInterval(id);
      embla.off("select", onSelect);
    };
  }, [embla]);

  const current = chicagoArtworks.filter((ca) => ca.image)[index + 6];

  if (chicagoArtworks)
    return (
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden bg-ink">
        <div ref={emblaRef} className="absolute inset-0 h-full overflow-hidden">
          <div className="flex h-full ">
            {chicagoArtworks
              .filter((ca) => ca.image)
              .map((a, i) => (
                <div key={i} className="relative h-full min-w-0 flex-[0_0_100%]">
                  <SmartImage
                    src={a?.image || ""}
                    key={a?.id}
                    alt={a?.name}
                    aria-hidden
                    priority={i === 0}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/30" />
                </div>
              ))}
          </div>
        </div>

        {/* Fixed text overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end ">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20 md:pb-28">
            <p className="text-[11px] uppercase tracking-[0.3em] text-canvas/75 transition-opacity duration-700">
              {current.medium}
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-5xl italic leading-[0.95] text-canvas md:text-7xl lg:text-8xl line-clamp-2">
              {current.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-canvas/85 md:text-lg">
              {current.name}
            </p>

            <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/gallery"
                className="border border-canvas bg-canvas px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-ink hover:bg-clay hover:border-clay hover:text-canvas"
              >
                Enter the exhibition
              </Link>
              <Link
                to="/about"
                className="border border-canvas/60 px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:border-canvas"
              >
                About the gallery
              </Link>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="pointer-events-auto absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => embla?.scrollTo(i)}
              className={`h-[2px] transition-all ${
                index === i ? "w-10 bg-canvas" : "w-5 bg-canvas/40"
              }`}
            />
          ))}
        </div>
      </section>
    );
}
