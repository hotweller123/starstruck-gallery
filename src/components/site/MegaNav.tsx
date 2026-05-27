import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { categories } from "@/data/categories";
import { artists } from "@/data/artists";
import { renownedArtists } from "@/data/renowned-artists";
import art09 from "@/assets/art-09.jpg";
import artist02 from "@/assets/artist-02.jpg";
import art10 from "@/assets/art-10.jpg";

type PanelKey = "categories" | "artists" | "about" | null;

const aboutLinks = [
  { to: "/about", label: "Our story", note: "Founded 2019. Four seasons a year." },
  { to: "/contact", label: "Contact", note: "Inquiries, partnerships, press." },
  { to: "/contact", label: "Partnerships", note: "Patrons, sponsors and houses." },
  { to: "/about", label: "Journal", note: "Long-reads, studio visits, broadsheets." },
] as const;

export function MegaNav() {
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setOpenPanel(null);

  return (
    <header
      className="sticky top-0 z-50 border-b border-ink/10 bg-canvas/95 backdrop-blur-md"
      onMouseLeave={close}
    >
      {/* Top utility row — mini-footer style */}
      <div className="hidden border-b border-ink/10 px-6 py-2 text-[10px] uppercase tracking-[0.22em] text-detail md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Exhibition No. 12 &middot; Spring 2026 &middot; Open online, daily</span>
          <div className="flex items-center gap-6">
            <a href="mailto:hello@aethelred.gallery" className="hover:text-ink">
              hello@aethelred.gallery
            </a>
            <span>Antwerp &middot; Kyoto &middot; Lisbon</span>
            <a href="#" className="hover:text-ink">Instagram</a>
            <a href="#" className="hover:text-ink">Journal</a>
          </div>
        </div>
      </div>

      {/* Main nav row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link
          to="/"
          className="font-display text-2xl italic tracking-tight text-ink"
          onClick={() => {
            setMobileOpen(false);
            close();
          }}
        >
          Aethelred
        </Link>

        <nav
          className="hidden items-center gap-9 md:flex"
          onMouseLeave={close}
        >
          <Link
            to="/gallery"
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/80 hover:text-clay"
            activeProps={{ className: "text-clay" }}
            onMouseEnter={close}
          >
            Gallery
          </Link>
          {(["categories", "artists", "about"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => setOpenPanel(key)}
              onFocus={() => setOpenPanel(key)}
              className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
                openPanel === key ? "text-clay" : "text-ink/80 hover:text-clay"
              }`}
            >
              {key}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden border border-ink px-5 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-canvas md:inline-block"
          >
            Contact
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="text-ink md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mega-panel */}
      {openPanel && (
        <div
          className="absolute left-0 right-0 top-full hidden border-t border-ink/10 bg-canvas shadow-[0_30px_50px_-30px_rgba(58,52,45,0.25)] md:block"
          onMouseEnter={() => setOpenPanel(openPanel)}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-[1.5fr_1fr] gap-12 px-6 py-12">
            <div>
              {openPanel === "categories" && (
                <>
                  <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-detail">
                    Browse by mode of design
                  </p>
                  <ul className="grid grid-cols-2 gap-x-10 gap-y-5">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to="/categories/$slug"
                          params={{ slug: c.slug }}
                          onClick={close}
                          className="group block"
                        >
                          <h4 className="font-display text-2xl italic text-ink group-hover:text-clay">
                            {c.label}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-detail">
                            {c.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {openPanel === "artists" && (
                <>
                  <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-detail">
                    In our rotation
                  </p>
                  <ul className="mb-10 grid grid-cols-2 gap-x-10 gap-y-4">
                    {artists.map((a) => (
                      <li key={a.slug}>
                        <Link
                          to="/artists/$slug"
                          params={{ slug: a.slug }}
                          onClick={close}
                          className="group block"
                        >
                          <h4 className="font-display text-xl italic text-ink group-hover:text-clay">
                            {a.name}
                          </h4>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-detail">
                            {a.discipline}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-detail">
                    Renowned, the world over
                  </p>
                  <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
                    {renownedArtists.map((r) => (
                      <li key={r.name}>
                        <p className="text-sm text-ink">{r.name}</p>
                        <p className="text-xs text-detail">{r.note}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {openPanel === "about" && (
                <>
                  <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-detail">
                    The gallery
                  </p>
                  <ul className="grid grid-cols-2 gap-x-10 gap-y-5">
                    {aboutLinks.map((l) => (
                      <li key={l.label}>
                        <Link
                          to={l.to}
                          onClick={close}
                          className="group block"
                        >
                          <h4 className="font-display text-2xl italic text-ink group-hover:text-clay">
                            {l.label}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-detail">
                            {l.note}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Side image */}
            <div className="relative">
              <img
                src={
                  openPanel === "categories"
                    ? art09
                    : openPanel === "artists"
                      ? artist02
                      : art10
                }
                alt=""
                className="aspect-[4/5] w-full object-cover"
              />
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-detail">
                {openPanel === "categories" && "Horizon Field — Søren Kjeldsen, 2024"}
                {openPanel === "artists" && "Marcus Thorne, in studio — Glasgow"}
                {openPanel === "about" && "From the spring catalogue — printed in editions of 200"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="border-t border-ink/10 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {[
              { to: "/gallery", label: "Gallery" },
              { to: "/categories", label: "Categories" },
              { to: "/artists", label: "Artists" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-[0.22em] text-ink"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-ink/10 pt-4 text-[10px] uppercase tracking-[0.22em] text-detail">
              hello@aethelred.gallery
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
