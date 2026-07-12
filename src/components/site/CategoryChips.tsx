import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/data/artworks";
import { scrollToCenter } from "@/lib/utils";

interface Props {
  active?: CategorySlug | "all";
}

/**
 * Horizontal chip list that automatically scrolls the clicked chip to the center.
 * Works on both desktop (click) and mobile (tap).
 */
export function CategoryChips({ active = "all" }: Props) {
  return (
    <div className="no-scrollbar flex items-center gap-3 overflow-x-auto">
      <Link
        to="/gallery"
        className={`shrink-0 rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
          active === "all"
            ? "border-ink bg-ink text-canvas"
            : "border-ink/15 text-detail hover:border-ink hover:text-ink"
        }`}
      >
        All Works
      </Link>

      {categories.map((c) => (
        <Link
          key={c.slug}
          // onClick={scrollToCenter} // Centers the chip on click (desktop + mobile)
          // onTouchStart={scrollToCenter} // Extra responsive on touch devices
          to="/categories/$slug"
          params={{ slug: c.slug }}
          className={`shrink-0 rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
            active === c.slug
              ? "border-ink bg-ink text-canvas"
              : "border-ink/15 text-detail hover:border-ink hover:text-ink"
          }`}
        >
          {c.label}
        </Link>
      ))}
    </div>
  );
}
