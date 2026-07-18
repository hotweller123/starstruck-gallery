import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  X,
  Mail,
  MapPin,
  Instagram,
  BookOpen,
  ChevronDown,
  Heart,
  ShoppingBag,
  User,
  Wallet,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { categories } from "@/data/categories";
import { artists } from "@/data/artists";
import { renownedArtists } from "@/data/renowned-artists";
import art09 from "@/assets/art-09.jpg";
import artist02 from "@/assets/artist-02.jpg";
import art10 from "@/assets/art-10.jpg";
import { useAuthStore } from "@/store/zustand";

type PanelKey = "categories" | "artists" | "about" | null;

const ICON_STROKE = 1.25;

const aboutLinks = [
  { to: "/about", label: "Our story", note: "Founded 2019. Four seasons a year." },
  { to: "/contact", label: "Contact", note: "Inquiries, partnerships, press." },
  { to: "/contact", label: "Partnerships", note: "Patrons, sponsors and houses." },
  { to: "/about", label: "Journal", note: "Long-reads, studio visits, broadsheets." },
] as const;

export function MegaNav() {
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const { favorites, cart } = useStore();
  const favCount = favorites.length;
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenPanel(null), 180);
  };

  const openNow = (key: Exclude<PanelKey, null>) => {
    cancelClose();
    setOpenPanel(key);
  };

  const closeNow = () => {
    cancelClose();
    setOpenPanel(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-canvas/95 backdrop-blur-md">
      {/* Top utility row */}
      <div className="hidden border-b border-ink/10 px-6 py-2 text-[10px] uppercase tracking-[0.22em] text-detail md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Exhibition No. 12 &middot; Spring 2026 &middot; Open online, daily</span>
          <div className="flex items-center gap-6">
            <a href="mailto:hello@aethelred.gallery" className="hover:text-ink">
              hello@aethelred.gallery
            </a>
            <span>Antwerp &middot; Kyoto &middot; Lisbon</span>
            <a href="#" className="hover:text-ink">
              Instagram
            </a>
            <a href="#" className="hover:text-ink">
              Journal
            </a>
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
            closeNow();
          }}
        >
          Aethelred
        </Link>

        <nav className="hidden items-center gap-9 md:flex ">
          <Link
            to="/gallery"
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/80 hover:text-clay"
            activeProps={{ className: "text-clay" }}
            onMouseEnter={closeNow}
          >
            Gallery
          </Link>
          <Link
            to="/auctions"
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/80 hover:text-clay"
            activeProps={{ className: "text-clay" }}
            onMouseEnter={closeNow}
          >
            Auction
          </Link>
          {(["categories", "artists", "about"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onMouseEnter={() => openNow(key)}
              onMouseLeave={scheduleClose}
              onFocus={() => openNow(key)}
              onClick={() => openNow(key)}
              className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
                openPanel === key ? "text-clay" : "text-ink/80 hover:text-clay"
              }`}
            >
              {key}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <WalletNavIcon />
          <IconLink to="/favourites" label="Favourites" count={favCount} Icon={Heart} />
          <IconLink to="/cart" label="Cart" count={cartCount} Icon={ShoppingBag} />
          <IconLink to="/profile" label="Profile" Icon={User} />
          <Link
            to="/contact"
            className="ml-2 hidden border border-ink px-5 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-canvas md:inline-block"
          >
            Contact
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="text-ink md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="size-6" strokeWidth={ICON_STROKE} />
            ) : (
              <Menu className="size-6" strokeWidth={ICON_STROKE} />
            )}
          </button>
        </div>
      </div>

      {/* Mega-panel — desktop */}
      {openPanel && (
        <div
          className="absolute left-0 right-0 top-full hidden border-t border-ink/10 bg-canvas shadow-[0_30px_50px_-30px_rgba(58,52,45,0.25)] md:block"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
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
                          onClick={closeNow}
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
                    Renowned, the world over
                  </p>
                  <ul className="mb-10 grid grid-cols-2 gap-x-10 gap-y-4">
                    {artists.map((a) => (
                      <li key={a.slug}>
                        <Link
                          to="/artists/$slug"
                          params={{ slug: a.slug }}
                          onClick={closeNow}
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
                  {/* <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-detail">
                    Renowned, the world over
                  </p>
                  <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
                    {renownedArtists.map((r) => (
                      <li key={r.name}>
                        <p className="text-sm text-ink">{r.name}</p>
                        <p className="text-xs text-detail">{r.note}</p>
                      </li>
                    ))}
                  </ul> */}
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
                        <Link to={l.to} onClick={closeNow} className="group block">
                          <h4 className="font-display text-2xl italic text-ink group-hover:text-clay">
                            {l.label}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-detail">{l.note}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="relative">
              <img
                src={
                  openPanel === "categories"
                    ? art09
                    : openPanel === "artists"
                      ? "https://afar.brightspotcdn.com/dims4/default/9416106/2147483647/strip/true/crop/2000x1333+1+0/resize/1800x1200!/format/webp/quality/90/?url=https%3A%2F%2Fk3-prod-afar-media.s3.us-west-2.amazonaws.com%2Fbrightspot%2F3a%2F99%2Fd822ba7d4bff9525f0f14b7c5f98%2Fmassachusetts-peabody-essex-museum-shutterstock-edmonia-lewis-pr.jpg"
                      : art10
                }
                alt=""
                className="aspect-[4/5] w-full object-cover pointer-events-none"
              />
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-detail">
                {openPanel === "categories" && "Horizon Field — Søren Kjeldsen, 2024"}
                {openPanel === "artists" &&
                  "When she was 19, Edmonia Lewis met Frederick Douglass, who inspired her to pursue her art"}
                {openPanel === "about" && "From the spring catalogue — printed in editions of 200"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile full-screen sheet — portaled to body to escape header's backdrop-filter containing block */}
      {mounted &&
        mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-100 flex flex-col bg-canvas md:hidden">
            {/* In-sheet header with close button */}
            <div className="flex h-[81px] shrink-0 items-center justify-between border-b border-ink/10 px-6">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl italic tracking-tight text-ink"
              >
                Aethelred
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="text-ink"
              >
                <X className="size-6" strokeWidth={ICON_STROKE} />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
              {/* Primary nav with expandable sub-routes */}
              <nav className="flex flex-col px-6 pt-8">
                <MobileNavLink
                  to="/gallery"
                  label="Gallery"
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileNavLink
                  to="/auctions"
                  label="Auction"
                  onNavigate={() => setMobileOpen(false)}
                />

                <MobileNavGroup
                  label="Categories"
                  items={categories.map((c) => ({
                    to: "/categories/$slug" as const,
                    params: { slug: c.slug },
                    label: c.label,
                    note: c.description,
                  }))}
                  onNavigate={() => setMobileOpen(false)}
                />

                <MobileNavGroup
                  label="Artists"
                  items={artists.map((a) => ({
                    to: "/artists/$slug" as const,
                    params: { slug: a.slug },
                    label: a.name,
                    note: a.discipline,
                  }))}
                  onNavigate={() => setMobileOpen(false)}
                />

                <MobileNavGroup
                  label="About"
                  items={aboutLinks.map((l) => ({
                    to: l.to,
                    label: l.label,
                    note: l.note,
                  }))}
                  onNavigate={() => setMobileOpen(false)}
                />

                <MobileNavLink
                  to="/favourites"
                  label={`Favourites${favCount ? ` (${favCount})` : ""}`}
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileNavLink
                  to="/cart"
                  label={`Cart${cartCount ? ` (${cartCount})` : ""}`}
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileNavLink
                  to="/wallet"
                  label="Wallet"
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileNavLink
                  to="/connect"
                  label="Connect wallet"
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileNavLink to="/bids" label="My bids" onNavigate={() => setMobileOpen(false)} />
                <MobileNavLink
                  to="/sell"
                  label="Sell your work"
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileNavLink
                  to="/profile"
                  label="Profile"
                  onNavigate={() => setMobileOpen(false)}
                />
                <MobileNavLink
                  to="/contact"
                  label="Contact"
                  onNavigate={() => setMobileOpen(false)}
                />
              </nav>

              {/* Footer-style details below nav */}
              <div className="mt-auto border-t border-ink/10 bg-sand/30 px-6 py-10">
                <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-detail">
                  The gallery
                </p>
                <ul className="flex flex-col gap-4 text-sm text-ink">
                  <li className="flex items-start gap-3">
                    <Mail
                      className="mt-0.5 size-4 shrink-0 text-detail"
                      strokeWidth={ICON_STROKE}
                    />
                    <a href="mailto:hello@aethelred.gallery">hello@aethelred.gallery</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-detail"
                      strokeWidth={ICON_STROKE}
                    />
                    <span>Antwerp &middot; Kyoto &middot; Lisbon</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Instagram
                      className="mt-0.5 size-4 shrink-0 text-detail"
                      strokeWidth={ICON_STROKE}
                    />
                    <a href="#">@aethelred.gallery</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen
                      className="mt-0.5 size-4 shrink-0 text-detail"
                      strokeWidth={ICON_STROKE}
                    />
                    <a href="#">Journal &amp; broadsheets</a>
                  </li>
                </ul>

                <div className="mt-8 border-t border-ink/10 pt-6 text-[10px] uppercase tracking-[0.22em] text-detail">
                  <p>Exhibition No. 12</p>
                  <p className="mt-1">Spring 2026 &middot; Open online, daily</p>
                  <p className="mt-4 normal-case tracking-normal text-detail/70">
                    &copy; {new Date().getFullYear()} Aethelred Gallery
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}

function MobileNavLink({
  to,
  label,
  onNavigate,
}: {
  to: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="border-b border-ink/10 py-5 font-display text-3xl italic text-ink"
    >
      {label}
    </Link>
  );
}

type MobileNavItem = {
  to: string;
  params?: Record<string, string>;
  label: string;
  note?: string;
};

function MobileNavGroup({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: MobileNavItem[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left font-display text-3xl italic text-ink"
      >
        <span>{label}</span>
        <ChevronDown
          className={`size-6 text-detail transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={ICON_STROKE}
        />
      </button>
      {open && (
        <ul className="flex flex-col gap-4 pb-6 pl-1 pr-2">
          {items.map((item) => (
            <li key={`${item.to}-${item.label}`}>
              <Link
                to={item.to}
                params={item.params as never}
                onClick={onNavigate}
                className="group block"
              >
                <p className="font-display text-lg italic text-ink group-hover:text-clay">
                  {item.label}
                </p>
                {item.note && (
                  <p className="mt-0.5 text-xs leading-relaxed text-detail">{item.note}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconLink({
  to,
  label,
  count,
  Icon,
}: {
  to: string;
  label: string;
  count?: number;
  Icon: typeof Heart;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative inline-flex size-10 items-center justify-center text-ink/80 transition-colors hover:text-clay"
      activeProps={{ className: "text-clay" }}
    >
      <Icon className="size-4.5" strokeWidth={ICON_STROKE} />
      {typeof count === "number" && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4.5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-medium leading-4.5 text-canvas">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function WalletNavIcon() {
  const { user } = useAuthStore();
  if (user) {
    return (
      <Link
        to="/wallet"
        aria-label="Open wallet"
        className="ml-1 hidden items-center gap-2 border border-ink/20 px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] text-ink hover:border-ink md:inline-flex"
        activeProps={{ className: "border-clay text-clay" }}
      >
        <Wallet className="size-[15px]" strokeWidth={ICON_STROKE} />$
        {user?.wallet?.balance.toLocaleString()}
      </Link>
    );
  }
  return (
    <Link
      to="/connect"
      aria-label="Connect wallet"
      className="relative inline-flex size-10 items-center justify-center text-ink/80 transition-colors hover:text-clay"
    >
      <Wallet className="size-[18px]" strokeWidth={ICON_STROKE} />
      <span className="absolute right-1 top-1.5 size-1.5 rounded-full bg-clay" />
    </Link>
  );
}
