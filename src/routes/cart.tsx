import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice, getArtworkBySlug } from "@/data/artworks";
import { PageHeader } from "@/components/site/PageHeader";
import { SmartImage } from "@/components/site/SmartImage";
import { useArtworkContext } from "@/lib/useMetArtworksStore";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Cart — Aethelred" }] }),
});

function CartPage() {
  const { artworks } = useArtworkContext();
  const { cart, setQuantity, removeFromCart, clearCart } = useStore();

  const rows = cart
    .map((c) => ({ item: c, artwork: getArtworkBySlug(c.slug, artworks) }))
    .filter(
      (r): r is { item: typeof r.item; artwork: NonNullable<typeof r.artwork> } => !!r.artwork,
    );

  console.log(rows);

  const subtotal = rows.reduce((s, r) => s + r.artwork.price * r.item.quantity, 0);
  const shipping = rows.length ? 95 : 0;
  const total = subtotal + shipping;

  return (
    <>
      <PageHeader
        eyebrow="Your order"
        title="Cart"
        description="Auctioned lots are bid on separately and cannot be added to cart."
      />
      <section className="mx-auto max-w-7xl px-6 pb-32 pt-6">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-dashed border-ink/15 py-24 text-center">
            <ShoppingBag className="size-10 text-detail" strokeWidth={1.2} />
            <p className="text-detail">Your cart is empty.</p>
            <Link
              to="/gallery"
              className="border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-ink hover:text-canvas"
            >
              Find a work
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
              {rows.map(({ item, artwork }) => (
                <li key={item.slug} className="flex gap-5 py-6">
                  <Link
                    to="/artworks/$slug"
                    params={{ slug: artwork.slug }}
                    className="block size-28 shrink-0 overflow-hidden bg-surface"
                  >
                    <SmartImage
                      src={artwork.image}
                      alt={artwork.title}
                      width={artwork.width}
                      height={artwork.height}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-detail">
                          {artwork.artist}
                        </p>
                        <Link
                          to="/artworks/$slug"
                          params={{ slug: artwork.slug }}
                          className="font-display text-2xl italic text-ink hover:text-clay"
                        >
                          {artwork.title}
                        </Link>
                        <p className="mt-1 text-xs text-detail">
                          {artwork.medium} · {artwork.dimensions}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.slug)}
                        className="text-detail hover:text-clay"
                        aria-label="Remove"
                      >
                        <Trash2 className="size-4" strokeWidth={1.25} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div className="flex items-center border border-ink/20">
                        <button
                          onClick={() => setQuantity(item.slug, item.quantity - 1)}
                          className="px-3 py-2 text-detail hover:text-ink"
                          aria-label="Decrease"
                        >
                          <Minus className="size-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.slug, item.quantity + 1)}
                          className="px-3 py-2 text-detail hover:text-ink"
                          aria-label="Increase"
                        >
                          <Plus className="size-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="font-display text-xl italic">
                        {formatPrice(artwork.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="self-start border border-ink/15 bg-surface/40 p-6 lg:sticky lg:top-32">
              <h2 className="font-display text-2xl italic">Order summary</h2>
              <dl className="mt-6 flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-detail">Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-detail">Shipping & handling</dt>
                  <dd>{formatPrice(shipping)}</dd>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-ink/10 pt-4">
                  <dt className="text-[11px] uppercase tracking-[0.22em] text-detail">Total</dt>
                  <dd className="font-display text-3xl italic">{formatPrice(total)}</dd>
                </div>
              </dl>
              <button
                onClick={() => {
                  clearCart();
                  alert("Thank you — a member of the gallery will be in touch shortly.");
                }}
                className="mt-6 w-full border border-ink bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-canvas hover:bg-clay hover:border-clay"
              >
                Proceed to checkout
              </button>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-detail">
                {rows.length} {rows.length === 1 ? "work" : "works"} · of {artworks.length} on view
              </p>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
