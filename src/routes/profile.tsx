import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Gavel, Upload, Mail, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — Aethelred" }] }),
});

const user = {
  name: "Eloise Marchand",
  handle: "@eloise.m",
  location: "Lisbon, Portugal",
  email: "eloise@aethelred.gallery",
  joined: "March 2024",
  bio: "Collector of small works on paper. Patron since the second exhibition. Quietly partial to coastal palettes and considered restraint.",
};

function ProfilePage() {
  const { favorites, cart, bids, listings } = useStore();

  const stats = [
    { label: "Favourites", value: favorites.length, to: "/favourites", icon: Heart },
    {
      label: "In cart",
      value: cart.reduce((s, c) => s + c.quantity, 0),
      to: "/cart",
      icon: ShoppingBag,
    },
    { label: "Active bids", value: bids.length, to: "/bids", icon: Gavel },
    { label: "Listings", value: listings.length, to: "/sell", icon: Upload },
  ] as const;

  return (
    <>
      <PageHeader eyebrow="Your account" title="Profile" />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-[1fr_1.4fr]">
        <aside className="border border-ink/10 p-8">
          <div className="flex size-24 items-center justify-center rounded-full bg-clay/15 font-display text-4xl italic text-clay">
            {user.name.charAt(0)}
          </div>
          <h2 className="mt-6 font-display text-3xl italic">{user.name}</h2>
          <p className="text-[11px] uppercase tracking-[0.22em] text-detail">{user.handle}</p>
          <p className="mt-6 text-sm leading-relaxed text-ink/80">{user.bio}</p>
          <ul className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm text-ink/80">
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-detail" strokeWidth={1.25} />
              {user.email}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-detail" strokeWidth={1.25} />
              {user.location}
            </li>
          </ul>
          <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-detail">
            Member since {user.joined}
          </p>
        </aside>

        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-2 gap-px bg-ink/10">
            {stats.map(({ label, value, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="group bg-canvas p-6 transition-colors hover:bg-surface"
              >
                <Icon className="size-5 text-detail group-hover:text-clay" strokeWidth={1.25} />
                <p className="mt-4 font-display text-4xl italic">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-detail">
                  {label}
                </p>
              </Link>
            ))}
          </div>

          <div className="border border-ink/10 p-8">
            <h3 className="font-display text-2xl italic">Quick actions</h3>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/sell"
                className="border border-ink bg-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
              >
                Sell an artwork
              </Link>
              <Link
                to="/bids"
                className="border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
              >
                My bids
              </Link>
              <Link
                to="/favourites"
                className="border border-ink px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
              >
                Favourites
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
