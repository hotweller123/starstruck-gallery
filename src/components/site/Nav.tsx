import { Link } from "@tanstack/react-router";
import { useState } from "react";

const links = [
  { to: "/gallery", label: "Gallery" },
  { to: "/categories", label: "Categories" },
  { to: "/artists", label: "Artists" },
  { to: "/about", label: "About" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-ink/5 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Link to="/" className="font-display text-2xl italic tracking-tight text-ink" onClick={() => setOpen(false)}>
          Aethelred
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/80 transition-colors hover:text-clay"
              activeProps={{ className: "text-clay" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden border border-ink px-5 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-canvas md:inline-block"
          >
            Contact
          </Link>
          <button type="button" aria-label="Toggle menu" className="md:hidden" onClick={() => setOpen((v) => !v)}>
            <span className="block text-[11px] font-medium uppercase tracking-[0.22em]">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/5 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {[...links, { to: "/contact", label: "Contact" }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-[0.22em] text-ink"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
