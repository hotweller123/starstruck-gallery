import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "./SmartImage";
import { cn } from "@/utils/gen";

interface Props {
  images: string[];
  alt: string;
  priority?: boolean;
  aspect?: string; // tailwind aspect class, e.g. "aspect-[4/5]"
}

/** Swipable image carousel for an auction lot card. */
export function AuctionImageSwiper({ images, alt, priority, aspect = "aspect-[4/5]" }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const sync = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    sync();
    embla.on("select", sync);
    embla.on("reInit", sync);
  }, [embla, sync]);

  const single = images.length <= 1;

  return (
    <div className={cn("relative overflow-hidden bg-surface", aspect)}>
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative h-full min-w-0 flex-[0_0_100%]">
              <SmartImage
                src={src}
                alt={`${alt} — view ${i + 1}`}
                priority={priority && i === 0}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {!single && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              embla?.scrollPrev();
            }}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 border border-canvas/40 bg-canvas/70 p-1.5 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-canvas group-hover:opacity-100"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              embla?.scrollNext();
            }}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 border border-canvas/40 bg-canvas/70 p-1.5 text-ink opacity-0 backdrop-blur transition-opacity hover:bg-canvas group-hover:opacity-100"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  embla?.scrollTo(i);
                }}
                className={cn(
                  "h-1 w-6 transition-all",
                  selected === i ? "bg-canvas" : "bg-canvas/40",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
