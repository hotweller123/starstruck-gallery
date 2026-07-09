import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
<<<<<<< HEAD
import { artworks } from "@/data/artworks";
import { ArtworkCard } from "@/components/site/ArtworkCard";
import { PageHeader } from "@/components/site/PageHeader";
import { WalletGate } from "@/components/site/WalletGate";
=======
// import { artworks } from "@/data/artworks";
import { ArtworkCard } from "@/components/site/ArtworkCard";
import { PageHeader } from "@/components/site/PageHeader";
import { WalletGate } from "@/components/site/WalletGate";
import { useArtworkContext } from "@/lib/useMetArtworksStore";
>>>>>>> 49a1b1e (updated)

export const Route = createFileRoute("/favourites")({
  component: FavouritesPage,
  head: () => ({
    meta: [{ title: "Favourites — Aethelred" }],
  }),
});

function FavouritesPage() {
  const { favorites } = useStore();
<<<<<<< HEAD
  const items = artworks.filter((a) => favorites.includes(a.slug));

  return (
    <WalletGate>
      <>
      <PageHeader
        eyebrow="Your collection"
        title="Favourites"
        description="Works you've set aside. Add or remove the heart on any artwork."
      />
      <section className="mx-auto max-w-7xl px-6 pb-32 pt-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center">
            <Heart className="size-10 text-detail" strokeWidth={1.2} />
            <p className="text-detail">No favourites yet.</p>
            <Link
              to="/gallery"
              className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
            >
              Browse the gallery
            </Link>
          </div>
        ) : (
          <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
            {items.map((a) => (
              <ArtworkCard key={a.slug} artwork={a} />
            ))}
          </div>
        )}
      </section>
=======
  const { artworks } = useArtworkContext();
  const items = artworks.filter((a) => favorites.includes(a.slug));

  console.log(favorites);

  return (
    <WalletGate>
      <>
        <PageHeader
          eyebrow="Your collection"
          title="Favourites"
          description="Works you've set aside. Add or remove the heart on any artwork."
        />
        <section className="mx-auto max-w-7xl px-6 pb-32 pt-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center">
              <Heart className="size-10 text-detail" strokeWidth={1.2} />
              <p className="text-detail">No favourites yet.</p>
              <Link
                to="/gallery"
                className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
              >
                Browse the gallery
              </Link>
            </div>
          ) : (
            <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
              {items.map((a) => (
                <ArtworkCard key={a.slug} artwork={a} />
              ))}
            </div>
          )}
        </section>
>>>>>>> 49a1b1e (updated)
      </>
    </WalletGate>
  );
}
