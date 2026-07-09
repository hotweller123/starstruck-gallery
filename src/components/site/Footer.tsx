import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 px-6 py-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <h2 className="font-display text-3xl italic text-ink">Aethelred Gallery</h2>
          <p className="mt-5 text-sm leading-relaxed text-detail">
            A digital sanctuary for the appreciation of modern thought and traditional craft. New
            works released seasonally.
          </p>
          <form
            className="mt-8 flex items-center border-b border-ink/30 pb-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="w-full bg-transparent text-sm outline-none placeholder:text-detail/60"
            />
            <button
              type="submit"
              className="text-[10px] font-medium uppercase tracking-[0.22em] text-ink hover:text-clay"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
              Visit
            </p>
            <Link to="/gallery" className="text-sm text-detail hover:text-ink">
              Gallery
            </Link>
            <Link to="/categories" className="text-sm text-detail hover:text-ink">
              Categories
            </Link>
            <Link to="/artists" className="text-sm text-detail hover:text-ink">
              Artists
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
              Gallery
            </p>
            <Link to="/about" className="text-sm text-detail hover:text-ink">
              About
            </Link>
            <Link to="/contact" className="text-sm text-detail hover:text-ink">
              Contact
            </Link>
            <a href="#" className="text-sm text-detail hover:text-ink">
              Press
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink">
              Follow
            </p>
            <a href="#" className="text-sm text-detail hover:text-ink">
              Instagram
            </a>
            <a href="#" className="text-sm text-detail hover:text-ink">
              Are.na
            </a>
            <a href="#" className="text-sm text-detail hover:text-ink">
              Journal
            </a>
            <Link
              to="/wallet"
              className="mt-2 inline-flex items-center gap-1 text-sm text-clay hover:underline"
            >
              Aethelred Pay ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-7xl items-center justify-between border-t border-ink/10 pt-8 text-[10px] uppercase tracking-[0.22em] text-detail/70">
        <span>&copy; {new Date().getFullYear()} Aethelred Gallery</span>
        <span>Privacy &middot; Terms</span>
      </div>
    </footer>
  );
}
